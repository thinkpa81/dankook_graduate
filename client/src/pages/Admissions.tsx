import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Download, ExternalLink, Eye, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, type AdmissionGuideline } from "@/lib/api";
import { useSession } from "@/hooks/use-session";

type GuidelineForm = {
  title: string;
  content: string;
  organization: string;
  date: string;
  attachmentUrl: string;
  attachmentName: string;
};

type SearchScope = "all" | "title" | "content" | "organization";

const searchScopeLabels: Record<SearchScope, string> = {
  all: "전체",
  title: "제목",
  content: "내용",
  organization: "게시기관",
};

const currentKoreanIsoDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
};

const emptyForm = (): GuidelineForm => ({
  title: "",
  content: "",
  organization: "단국대학교 대학원",
  date: currentKoreanIsoDate(),
  attachmentUrl: "",
  attachmentName: "",
});

const normalizeDateForInput = (date: string) => date.replaceAll(".", "-").slice(0, 10);

const previewGuidelines: AdmissionGuideline[] = [
  {
    id: 3,
    title: "2026학년도 후기 대학원 신입학·편입학 추가전형 모집요강",
    content: "접수기간과 전형일정은 단국대학교 대학원 공식 모집요강에서 확인해 주세요. 학과 연구실 사전 컨택은 학과 소개의 안내에 따라 이메일로 진행합니다.",
    organization: "단국대학교 대학원",
    date: "2026-06-16",
    views: 3505,
    attachmentUrl: "https://grad.dankook.ac.kr/-91",
    attachmentName: "공식 모집요강 바로보기",
  },
  {
    id: 2,
    title: "대학원 입학 지원 절차 및 제출서류 안내",
    content: "입학 지원 자격, 전형 방법과 제출서류는 모집 시기별 공식 안내를 기준으로 확인해 주세요.",
    organization: "단국대학교 대학원",
    date: "2026-05-08",
    views: 2148,
    attachmentUrl: "https://grad.dankook.ac.kr/web/kor/graduate_ipsi",
    attachmentName: "대학원 입학 안내",
  },
  {
    id: 1,
    title: "데이터지식서비스공학과 박사과정 사전 컨택 안내",
    content: "정식 지원 전 지도교수에게 연구 관심분야와 면담 희망 일정을 이메일로 문의해 주세요. 세부 작성 방법은 학과 소개에서 확인할 수 있습니다.",
    organization: "데이터지식서비스공학과",
    date: "2026-04-01",
    views: 972,
    attachmentUrl: null,
    attachmentName: null,
  },
];

export default function Admissions() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [guidelines, setGuidelines] = useState<AdmissionGuideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");
  const [form, setForm] = useState<GuidelineForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState<AdmissionGuideline | null>(null);
  const [viewing, setViewing] = useState<AdmissionGuideline | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { user } = useSession();
  const isAdmin = user?.role === "ADMIN";

  const loadGuidelines = async () => {
    setError(null);
    if (import.meta.env.DEV && window.location.port === "4173") {
      setGuidelines(previewGuidelines);
      setLoading(false);
      return;
    }
    try {
      const data = await api.admissions.list();
      setGuidelines(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "모집요강을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGuidelines();
  }, []);

  const filteredGuidelines = useMemo(() => {
    const keyword = searchQuery.trim().toLocaleLowerCase("ko-KR");
    return [...guidelines]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
      .filter((item) => {
        if (!keyword) return true;
        const values = searchScope === "all"
          ? [item.title, item.content, item.organization]
          : [item[searchScope]];
        return values.some((value) => value.toLocaleLowerCase("ko-KR").includes(keyword));
      });
  }, [guidelines, searchQuery, searchScope]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEdit = (item: AdmissionGuideline) => {
    setEditing(item);
    setForm({
      title: item.title,
      content: item.content,
      organization: item.organization,
      date: normalizeDateForInput(item.date),
      attachmentUrl: item.attachmentUrl ?? "",
      attachmentName: item.attachmentName ?? "",
    });
    setFormOpen(true);
  };

  const saveGuideline = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.organization.trim()) {
      window.alert("제목, 내용, 게시 기관을 입력해 주세요.");
      return;
    }

    if (form.attachmentUrl.trim() && !/^https:\/\//i.test(form.attachmentUrl.trim())) {
      window.alert("첨부 주소는 https://로 시작해야 합니다.");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      organization: form.organization.trim(),
      date: form.date || currentKoreanIsoDate(),
      attachmentUrl: form.attachmentUrl.trim() || null,
      attachmentName: form.attachmentName.trim() || null,
    };

    try {
      if (editing) {
        await api.admissions.update(editing.id, payload);
      } else {
        await api.admissions.create(payload);
      }
      await loadGuidelines();
      setFormOpen(false);
      setEditing(null);
    } catch (caught) {
      window.alert(caught instanceof Error ? caught.message : "모집요강 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (item: AdmissionGuideline) => {
    setViewing(item);
    setDetailOpen(true);
    try {
      await api.admissions.incrementViews(item.id);
      const updated = await api.admissions.get(item.id);
      setViewing(updated);
      setGuidelines((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
    } catch {
      // 상세 내용은 표시하고 조회수 갱신 실패만 조용히 무시합니다.
    }
  };

  const openAttachment = async (item: AdmissionGuideline) => {
    if (!item.attachmentUrl) return;
    window.open(item.attachmentUrl, "_blank", "noopener,noreferrer");
  };

  const deleteGuideline = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await api.admissions.delete(deleteId);
      setGuidelines((current) => current.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch (caught) {
      window.alert(caught instanceof Error ? caught.message : "모집요강 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-slate-50">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <PageHero
        eyebrow="ADMISSIONS"
        title="입학안내"
        description="데이터지식서비스공학과의 모집 일정과 지원 안내를 확인하세요."
        imageSrc="/page-hero-talent-pool.jpg"
        objectPosition="68% 50%"
        overlayClassName="bg-[#071B33]/68"
      />

      <main className="flex-1 py-10 lg:py-14">
        <div className="container mx-auto grid max-w-[1200px] gap-8 px-4 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
          <aside aria-label="입학안내 메뉴">
            <div className="border-t-2 border-slate-900 bg-white lg:sticky lg:top-32">
              <h2 className="border-b border-slate-200 px-5 py-5 text-xl font-black text-slate-950">입학안내</h2>
              <nav className="p-2">
                <span className="block rounded-md bg-[#0B2B50] px-4 py-3.5 font-bold text-white" aria-current="page">
                  모집요강
                </span>
              </nav>
            </div>
          </aside>

          <section aria-labelledby="admissions-guidelines-heading">
            <div className="flex flex-col gap-6 border-b-2 border-slate-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold tracking-[0.08em] text-[#2156D9]">APPLICATION GUIDELINES</p>
                <h2 id="admissions-guidelines-heading" className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-950 lg:text-4xl">
                  모집요강
                </h2>
              </div>
              {isAdmin && (
                <Button onClick={openCreate} className="h-11 rounded-md bg-[#2156D9] px-5 font-bold hover:bg-[#1848bc]" data-testid="button-add-admission">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />모집요강 등록
                </Button>
              )}
            </div>

            <div className="my-6 flex justify-end">
              <form
                role="search"
                aria-label="모집요강 검색"
                className="flex w-full max-w-2xl flex-col overflow-hidden rounded-md border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#2156D9]/30 sm:flex-row"
                onSubmit={submitSearch}
              >
                <label htmlFor="admissions-search-scope" className="sr-only">검색 범위</label>
                <select
                  id="admissions-search-scope"
                  value={searchScope}
                  onChange={(event) => setSearchScope(event.target.value as SearchScope)}
                  className="h-12 w-full border-b border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2156D9] sm:w-36 sm:border-r sm:border-b-0"
                  data-testid="select-admissions-search-scope"
                >
                  {Object.entries(searchScopeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <label htmlFor="admissions-search" className="sr-only">검색어</label>
                <Input
                  id="admissions-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="검색어를 입력해 주세요"
                  className="h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-4 shadow-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2156D9]"
                  data-testid="input-admissions-search"
                />
                <Button
                  type="submit"
                  className="h-12 w-full shrink-0 rounded-none bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:w-12"
                  aria-label="모집요강 검색"
                  data-testid="button-admissions-search"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  <span className="sm:sr-only">검색</span>
                </Button>
              </form>
            </div>

            <div className="bg-white">
              <p className="sr-only" role="status" aria-live="polite">
                {!loading && !error
                  ? searchQuery
                    ? `${searchScopeLabels[searchScope]} 범위에서 ${filteredGuidelines.length}개의 검색 결과가 있습니다.`
                    : `모집요강 ${filteredGuidelines.length}건이 있습니다.`
                  : ""}
              </p>
              {loading && <p role="status" className="border-b border-slate-200 px-5 py-14 text-center text-slate-500">모집요강을 불러오는 중입니다.</p>}
              {!loading && error && (
                <div role="alert" className="border-b border-slate-200 px-5 py-14 text-center">
                  <p className="font-semibold text-rose-700">모집요강을 불러오지 못했습니다.</p>
                  <p className="mt-1 text-sm text-slate-500">{error}</p>
                </div>
              )}
              {!loading && !error && filteredGuidelines.length === 0 && (
                <div className="border-b border-slate-200 px-5 py-14 text-center text-slate-500">
                  <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
                  <p>{searchQuery.trim() ? "검색 결과가 없습니다." : "학과에서 등록한 모집요강이 없습니다."}</p>
                  <Button asChild variant="outline" className="mt-5 h-11 rounded-md border-slate-300 font-bold text-slate-800">
                    <a href="https://grad.dankook.ac.kr/-91" target="_blank" rel="noopener noreferrer">
                      단국대학교 공식 모집요강 확인 <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              )}
              {!loading && !error && filteredGuidelines.map((item) => (
                <article
                  key={item.id}
                  className="group grid gap-4 border-b border-slate-200 px-4 py-6 transition-colors hover:bg-blue-50/40 sm:px-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold leading-7 tracking-[-0.02em] text-slate-950 [overflow-wrap:anywhere] transition-colors group-hover:text-[#2156D9] sm:text-xl">
                      <button type="button" className="max-w-full text-left [overflow-wrap:anywhere] focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]" onClick={() => void openDetail(item)} data-testid={`admission-title-${item.id}`}>
                        {item.title}
                      </button>
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-3"><span>No.{item.id}</span><span aria-hidden="true">|</span></span>
                      <span className="inline-flex min-w-0 items-center gap-3"><span className="[overflow-wrap:anywhere]">{item.organization}</span><span aria-hidden="true">|</span></span>
                      <span className="inline-flex items-center gap-3"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{item.date}</span><span aria-hidden="true">|</span></span>
                      <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden="true" />조회수 {item.views}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:justify-end">
                    {item.attachmentUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => void openAttachment(item)}
                        className="h-11 w-11 rounded-md border-slate-300"
                        aria-label={`${item.attachmentName || item.title} 첨부자료 열기`}
                      >
                        <Download className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-11 w-11 rounded-md" aria-label={`${item.title} 수정`}>
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="h-11 w-11 rounded-md text-rose-700 hover:bg-rose-50 hover:text-rose-800" aria-label={`${item.title} 삭제`}>
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="pr-8 text-xl font-black leading-8 [overflow-wrap:anywhere]">{viewing?.title}</DialogTitle>
            <DialogDescription className="flex flex-wrap gap-x-3 gap-y-1 pt-2 text-sm">
              <span className="[overflow-wrap:anywhere]">{viewing?.organization}</span>
              <span>{viewing?.date}</span>
              <span>조회수 {viewing?.views}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 whitespace-pre-wrap border-y border-slate-200 py-6 text-[15px] leading-7 text-slate-700 [overflow-wrap:anywhere]">
            {viewing?.content}
          </div>
          {viewing?.attachmentUrl && (
            <Button asChild className="mt-2 h-auto min-h-11 max-w-full whitespace-normal break-words rounded-md bg-[#2156D9] py-2 font-bold hover:bg-[#1848bc]">
              <a href={viewing.attachmentUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                {viewing.attachmentName || "첨부자료 열기"}
              </a>
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={(open) => { if (!saving) setFormOpen(open); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">모집요강 {editing ? "수정" : "등록"}</DialogTitle>
            <DialogDescription>지원자가 확인할 모집요강 정보를 입력합니다.</DialogDescription>
          </DialogHeader>
          <form className="mt-3 space-y-5" onSubmit={(event) => { event.preventDefault(); void saveGuideline(); }}>
            <div className="space-y-2">
              <Label htmlFor="guideline-title" className="font-bold">제목</Label>
              <Input id="guideline-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-11 rounded-md" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guideline-content" className="font-bold">내용</Label>
              <Textarea id="guideline-content" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="min-h-36 rounded-md" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guideline-organization" className="font-bold">게시 기관</Label>
                <Input id="guideline-organization" value={form.organization} onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))} className="h-11 rounded-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guideline-date" className="font-bold">게시일</Label>
                <Input id="guideline-date" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-11 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guideline-attachment-url" className="font-bold">첨부자료 주소</Label>
              <Input id="guideline-attachment-url" type="url" placeholder="https://" value={form.attachmentUrl} onChange={(event) => setForm((current) => ({ ...current, attachmentUrl: event.target.value }))} className="h-11 rounded-md" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guideline-attachment-name" className="font-bold">첨부자료 이름</Label>
              <Input id="guideline-attachment-name" placeholder="예: 2027학년도 전기 모집요강" value={form.attachmentName} onChange={(event) => setForm((current) => ({ ...current, attachmentName: event.target.value }))} className="h-11 rounded-md" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={saving} className="h-11 flex-1 rounded-md">취소</Button>
              <Button type="submit" disabled={saving} className="h-11 flex-1 rounded-md bg-[#2156D9] font-bold hover:bg-[#1848bc]">
                {saving ? "저장 중..." : editing ? "수정" : "등록"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open && !deleting) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>모집요강을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>삭제한 모집요강은 복구할 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="h-11 rounded-md">취소</AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={() => void deleteGuideline()} className="h-11 rounded-md bg-rose-700 text-white hover:bg-rose-800">{deleting ? "삭제 중..." : "삭제"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
