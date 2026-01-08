import { useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { FileText, Users, BookOpen, Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

interface Paper {
  id: number;
  title: string;
  authors: string;
  venue?: string;
  journal?: string;
  year: string;
  volume?: string;
}

const initialPapers: Record<string, Paper[]> = {
  "domestic-conference": [
    { id: 1, title: "빅데이터 분석을 활용한 소비자 행동 예측 모델 연구", authors: "김철수, 이영희", venue: "한국정보과학회 학술대회", year: "2024" },
    { id: 2, title: "자연어 처리 기반 감성 분석 시스템 개발", authors: "박지민, 최수진", venue: "한국데이터베이스학회 학술대회", year: "2023" },
    { id: 3, title: "클라우드 컴퓨팅 환경에서의 데이터 보안 연구", authors: "정민수, 김하늘", venue: "한국정보보호학회 학술대회", year: "2023" },
  ],
  "international-conference": [
    { id: 1, title: "Deep Learning Approach for Time Series Prediction", authors: "Kim, J., Lee, H.", venue: "IEEE International Conference on Data Mining", year: "2024" },
    { id: 2, title: "A Novel Framework for Knowledge Graph Construction", authors: "Park, S., Choi, M.", venue: "ACM SIGKDD Conference", year: "2023" },
  ],
  "domestic-journal": [
    { id: 1, title: "인공지능 기반 의료 데이터 분석 플랫폼 설계", authors: "이민호, 김서연", journal: "한국정보과학회논문지", year: "2024", volume: "51(3)" },
    { id: 2, title: "메타버스 환경에서의 사용자 경험 분석", authors: "정유진, 박현우", journal: "한국HCI학회논문지", year: "2023", volume: "18(4)" },
  ],
  "international-journal": [
    { id: 1, title: "Machine Learning for Predictive Analytics in Healthcare", authors: "Kim, Y., Lee, J.", journal: "IEEE Transactions on Knowledge and Data Engineering", year: "2024", volume: "36(2)" },
    { id: 2, title: "Efficient Data Mining Algorithms for Big Data Processing", authors: "Park, H., Choi, S.", journal: "ACM Computing Surveys", year: "2023", volume: "55(4)" },
  ],
  "main-journal": [
    { id: 1, title: "데이터지식서비스공학과 연구 동향 분석", authors: "학과 연구팀", journal: "단국대학교 대학원 논문집", year: "2024", volume: "12(1)" },
  ]
};

const categoryTitles: Record<string, string> = {
  "domestic-conference": "국내 학술대회",
  "international-conference": "해외 학술대회",
  "domestic-journal": "국내 저널",
  "international-journal": "해외 저널",
  "main-journal": "본 저널",
};

const categoryColors: Record<string, string> = {
  "domestic-conference": "from-blue-500 to-indigo-500",
  "international-conference": "from-purple-500 to-pink-500",
  "domestic-journal": "from-emerald-500 to-teal-500",
  "international-journal": "from-orange-500 to-amber-500",
  "main-journal": "from-rose-500 to-red-500",
};

export default function Papers() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [, params] = useRoute("/papers/:category");
  const category = params?.category || "domestic-conference";
  const [papers, setPapers] = useState(initialPapers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    venue: "",
    journal: "",
    year: "",
    volume: "",
  });

  const currentPapers = papers[category] || [];
  const isJournal = category.includes("journal");

  const handleAdd = () => {
    const newPaper: Paper = {
      id: Math.max(...currentPapers.map(p => p.id), 0) + 1,
      title: formData.title,
      authors: formData.authors,
      year: formData.year,
      ...(isJournal ? { journal: formData.journal, volume: formData.volume } : { venue: formData.venue }),
    };
    setPapers({ ...papers, [category]: [newPaper, ...currentPapers] });
    setIsAddOpen(false);
    setFormData({ title: "", authors: "", venue: "", journal: "", year: "", volume: "" });
  };

  const handleEdit = () => {
    if (!editingPaper) return;
    setPapers({
      ...papers,
      [category]: currentPapers.map(p =>
        p.id === editingPaper.id
          ? {
              ...p,
              title: formData.title,
              authors: formData.authors,
              year: formData.year,
              ...(isJournal ? { journal: formData.journal, volume: formData.volume } : { venue: formData.venue }),
            }
          : p
      ),
    });
    setIsEditOpen(false);
    setEditingPaper(null);
    setFormData({ title: "", authors: "", venue: "", journal: "", year: "", volume: "" });
  };

  const handleDelete = () => {
    if (deleteId) {
      setPapers({ ...papers, [category]: currentPapers.filter(p => p.id !== deleteId) });
      setDeleteId(null);
    }
  };

  const openEdit = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      authors: paper.authors,
      venue: paper.venue || "",
      journal: paper.journal || "",
      year: paper.year,
      volume: paper.volume || "",
    });
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="hero-gradient hero-pattern text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-blue-100">Papers & Publications</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">논문</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              학과의 연구 성과와 논문을 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <Tabs value={category} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-muted rounded-2xl">
                <TabsTrigger value="domestic-conference" asChild className="rounded-xl py-3 data-[state=active]:shadow-md">
                  <Link href="/papers/domestic-conference" data-testid="tab-domestic-conf">
                    국내 학술대회
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="international-conference" asChild className="rounded-xl py-3 data-[state=active]:shadow-md">
                  <Link href="/papers/international-conference" data-testid="tab-intl-conf">
                    해외 학술대회
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="domestic-journal" asChild className="rounded-xl py-3 data-[state=active]:shadow-md">
                  <Link href="/papers/domestic-journal" data-testid="tab-domestic-journal">
                    국내 저널
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="international-journal" asChild className="rounded-xl py-3 data-[state=active]:shadow-md">
                  <Link href="/papers/international-journal" data-testid="tab-intl-journal">
                    해외 저널
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="main-journal" asChild className="rounded-xl py-3 col-span-2 lg:col-span-1 data-[state=active]:shadow-md">
                  <Link href="/papers/main-journal" data-testid="tab-main-journal">
                    본 저널
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button 
              onClick={() => setIsAddOpen(true)} 
              className="rounded-full shadow-lg font-semibold px-6"
              data-testid="button-add-paper"
            >
              <Plus className="w-4 h-4 mr-2" />
              논문 등록
            </Button>
          </div>

          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[category]} rounded-xl flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-foreground">
                {categoryTitles[category]}
              </h2>
            </div>

            <div className="space-y-4">
              {currentPapers.map((paper) => (
                <Card key={paper.id} className="border-0 shadow-lg card-hover rounded-2xl overflow-hidden group">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 bg-gradient-to-br ${categoryColors[category]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg lg:text-xl text-foreground mb-3">
                          {paper.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {paper.authors}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            {paper.venue || paper.journal}
                            {paper.volume && ` (${paper.volume})`}
                          </span>
                          <Badge className={`bg-gradient-to-r ${categoryColors[category]} text-white border-0`}>
                            {paper.year}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full"
                          onClick={() => openEdit(paper)}
                          data-testid={`button-edit-paper-${paper.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full text-destructive"
                          onClick={() => setDeleteId(paper.id)}
                          data-testid={`button-delete-paper-${paper.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {currentPapers.length === 0 && (
                <div className="p-16 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>등록된 논문이 없습니다.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">논문 등록</DialogTitle>
            <DialogDescription>{categoryTitles[category]}에 새 논문을 등록합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label>논문 제목</Label>
              <Input
                placeholder="논문 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl"
                data-testid="input-paper-title"
              />
            </div>
            <div className="space-y-2">
              <Label>저자</Label>
              <Input
                placeholder="저자를 입력하세요 (예: 홍길동, 김철수)"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="h-12 rounded-xl"
                data-testid="input-paper-authors"
              />
            </div>
            <div className="space-y-2">
              <Label>{isJournal ? "저널명" : "학술대회명"}</Label>
              <Input
                placeholder={isJournal ? "저널명을 입력하세요" : "학술대회명을 입력하세요"}
                value={isJournal ? formData.journal : formData.venue}
                onChange={(e) => setFormData({ ...formData, [isJournal ? 'journal' : 'venue']: e.target.value })}
                className="h-12 rounded-xl"
                data-testid="input-paper-venue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>발행년도</Label>
                <Input
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="h-12 rounded-xl"
                  data-testid="input-paper-year"
                />
              </div>
              {isJournal && (
                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Input
                    placeholder="51(3)"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="h-12 rounded-xl"
                    data-testid="input-paper-volume"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-xl h-12">
                취소
              </Button>
              <Button onClick={handleAdd} className="flex-1 rounded-xl h-12 font-semibold" data-testid="button-submit-paper">
                등록
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">논문 수정</DialogTitle>
            <DialogDescription>논문 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label>논문 제목</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl"
                data-testid="input-edit-paper-title"
              />
            </div>
            <div className="space-y-2">
              <Label>저자</Label>
              <Input
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{isJournal ? "저널명" : "학술대회명"}</Label>
              <Input
                value={isJournal ? formData.journal : formData.venue}
                onChange={(e) => setFormData({ ...formData, [isJournal ? 'journal' : 'venue']: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>발행년도</Label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              {isJournal && (
                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Input
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 rounded-xl h-12">
                취소
              </Button>
              <Button onClick={handleEdit} className="flex-1 rounded-xl h-12 font-semibold" data-testid="button-update-paper">
                수정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>논문을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 논문이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground rounded-xl">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}