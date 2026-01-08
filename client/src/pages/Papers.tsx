import { useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { FileText, Users, BookOpen, Plus, Pencil, Trash2, Upload, X, MessageSquare, Send, Download, ExternalLink, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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

interface FileAttachment {
  name: string;
  type: string;
  size: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

interface Paper {
  id: number;
  title: string;
  authors: string;
  firstAuthor?: string;
  correspondingAuthor?: string;
  websiteUrl?: string;
  venue?: string;
  journal?: string;
  year: string;
  volume?: string;
  files: FileAttachment[];
  comments: Comment[];
}

const initialPapers: Record<string, Paper[]> = {
  "domestic-conference": [
    { id: 1, title: "빅데이터 분석을 활용한 소비자 행동 예측 모델 연구", authors: "김철수, 이영희", firstAuthor: "김철수", correspondingAuthor: "이영희", venue: "한국정보과학회 학술대회", year: "2024", files: [{ name: "논문.pdf", type: "pdf", size: 245000 }], comments: [] },
    { id: 2, title: "자연어 처리 기반 감성 분석 시스템 개발", authors: "박지민, 최수진", firstAuthor: "박지민", correspondingAuthor: "최수진", venue: "한국데이터베이스학회 학술대회", year: "2023", files: [], comments: [] },
    { id: 3, title: "클라우드 컴퓨팅 환경에서의 데이터 보안 연구", authors: "정민수, 김하늘", firstAuthor: "정민수", correspondingAuthor: "김하늘", venue: "한국정보보호학회 학술대회", year: "2023", files: [{ name: "발표자료.pptx", type: "pptx", size: 1250000 }], comments: [] },
  ],
  "international-conference": [
    { id: 1, title: "Deep Learning Approach for Time Series Prediction", authors: "Kim, J., Lee, H.", firstAuthor: "Kim, J.", correspondingAuthor: "Lee, H.", venue: "IEEE International Conference on Data Mining", year: "2024", files: [], comments: [] },
    { id: 2, title: "A Novel Framework for Knowledge Graph Construction", authors: "Park, S., Choi, M.", firstAuthor: "Park, S.", correspondingAuthor: "Choi, M.", venue: "ACM SIGKDD Conference", year: "2023", files: [], comments: [] },
  ],
  "domestic-journal": [
    { id: 1, title: "인공지능 기반 의료 데이터 분석 플랫폼 설계", authors: "이민호, 김서연", firstAuthor: "이민호", correspondingAuthor: "김서연", journal: "한국정보과학회논문지", year: "2024", volume: "51(3)", files: [], comments: [] },
    { id: 2, title: "메타버스 환경에서의 사용자 경험 분석", authors: "정유진, 박현우", firstAuthor: "정유진", correspondingAuthor: "박현우", journal: "한국HCI학회논문지", year: "2023", volume: "18(4)", files: [], comments: [] },
  ],
  "international-journal": [
    { id: 1, title: "Machine Learning for Predictive Analytics in Healthcare", authors: "Kim, Y., Lee, J.", firstAuthor: "Kim, Y.", correspondingAuthor: "Lee, J.", journal: "IEEE Transactions on Knowledge and Data Engineering", year: "2024", volume: "36(2)", files: [], comments: [] },
    { id: 2, title: "Efficient Data Mining Algorithms for Big Data Processing", authors: "Park, H., Choi, S.", firstAuthor: "Park, H.", correspondingAuthor: "Choi, S.", journal: "ACM Computing Surveys", year: "2023", volume: "55(4)", files: [], comments: [] },
  ],
  "main-journal": [
    { id: 1, title: "데이터지식서비스공학과 연구 동향 분석", authors: "학과 연구팀", firstAuthor: "학과 연구팀", journal: "단국대학교 대학원 논문집", year: "2024", volume: "12(1)", files: [], comments: [] },
  ],
  "paper-review": [
    { id: 1, title: "최신 딥러닝 트렌드 리뷰", authors: "김철수", firstAuthor: "김철수", journal: "학과 세미나", year: "2024", volume: "", files: [], comments: [{ id: 1, author: "이영희", content: "좋은 리뷰 감사합니다!", date: "2024.01.05" }] },
  ]
};

const categoryTitles: Record<string, string> = {
  "domestic-conference": "국내 학술대회",
  "international-conference": "해외 학술대회",
  "domestic-journal": "국내 저널",
  "international-journal": "해외 저널",
  "main-journal": "본 저널",
  "paper-review": "논문리뷰",
};

const categoryColors: Record<string, string> = {
  "domestic-conference": "from-blue-600 to-indigo-600",
  "international-conference": "from-violet-600 to-purple-600",
  "domestic-journal": "from-emerald-500 to-teal-500",
  "international-journal": "from-orange-500 to-amber-500",
  "main-journal": "from-rose-500 to-pink-500",
  "paper-review": "from-cyan-500 to-blue-500",
};

const ITEMS_PER_PAGE = 5;

export default function Papers() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [, params] = useRoute("/papers/:category");
  const category = params?.category || "domestic-conference";
  const [papers, setPapers] = useState(initialPapers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [viewingPaper, setViewingPaper] = useState<Paper | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    firstAuthor: "",
    correspondingAuthor: "",
    websiteUrl: "",
    venue: "",
    journal: "",
    year: "",
    volume: "",
    files: [] as FileAttachment[],
  });

  const currentPapers = papers[category] || [];
  const isJournal = category.includes("journal") || category === "paper-review";
  const isPaperReview = category === "paper-review";

  const totalPages = Math.ceil(currentPapers.length / ITEMS_PER_PAGE);
  const displayedPapers = showAll ? currentPapers : currentPapers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: FileAttachment[] = Array.from(files).map(file => ({
        name: file.name,
        type: file.name.split('.').pop() || '',
        size: file.size,
      }));
      setFormData({ ...formData, files: [...formData.files, ...newFiles] });
    }
  };

  const removeFile = (index: number) => {
    setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'docx':
      case 'doc':
        return '📄';
      case 'xlsx':
      case 'xls':
        return '📊';
      case 'pptx':
      case 'ppt':
        return '📽️';
      case 'pdf':
        return '📕';
      default:
        return '📎';
    }
  };

  const handleAdd = () => {
    const newPaper: Paper = {
      id: Math.max(...currentPapers.map(p => p.id), 0) + 1,
      title: formData.title,
      authors: formData.authors,
      firstAuthor: formData.firstAuthor,
      correspondingAuthor: formData.correspondingAuthor,
      websiteUrl: formData.websiteUrl,
      year: formData.year,
      files: formData.files,
      comments: [],
      ...(isJournal ? { journal: formData.journal, volume: formData.volume } : { venue: formData.venue }),
    };
    setPapers({ ...papers, [category]: [newPaper, ...currentPapers] });
    setIsAddOpen(false);
    setFormData({ title: "", authors: "", firstAuthor: "", correspondingAuthor: "", websiteUrl: "", venue: "", journal: "", year: "", volume: "", files: [] });
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
              firstAuthor: formData.firstAuthor,
              correspondingAuthor: formData.correspondingAuthor,
              websiteUrl: formData.websiteUrl,
              year: formData.year,
              files: formData.files,
              ...(isJournal ? { journal: formData.journal, volume: formData.volume } : { venue: formData.venue }),
            }
          : p
      ),
    });
    setIsEditOpen(false);
    setEditingPaper(null);
    setFormData({ title: "", authors: "", firstAuthor: "", correspondingAuthor: "", websiteUrl: "", venue: "", journal: "", year: "", volume: "", files: [] });
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
      firstAuthor: paper.firstAuthor || "",
      correspondingAuthor: paper.correspondingAuthor || "",
      websiteUrl: paper.websiteUrl || "",
      venue: paper.venue || "",
      journal: paper.journal || "",
      year: paper.year,
      volume: paper.volume || "",
      files: paper.files || [],
    });
    setIsEditOpen(true);
  };

  const openView = (paper: Paper) => {
    setViewingPaper(paper);
    setIsViewOpen(true);
  };

  const openAdd = () => {
    setFormData({ title: "", authors: "", firstAuthor: "", correspondingAuthor: "", websiteUrl: "", venue: "", journal: "", year: "", volume: "", files: [] });
    setIsAddOpen(true);
  };

  const addComment = () => {
    if (!viewingPaper || !newComment.trim() || !commentAuthor.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      author: commentAuthor,
      content: newComment,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    };
    setPapers({
      ...papers,
      [category]: currentPapers.map(p =>
        p.id === viewingPaper.id
          ? { ...p, comments: [...p.comments, comment] }
          : p
      ),
    });
    setViewingPaper({ ...viewingPaper, comments: [...viewingPaper.comments, comment] });
    setNewComment("");
    setCommentAuthor("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.3)_0%,_transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-cyan-400 font-semibold mb-2 text-base tracking-wide">PAPERS & PUBLICATIONS</p>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 text-white">논문</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              학과의 연구 성과와 논문을 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-14 flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <Tabs value={category} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-white shadow-md rounded-xl">
                <TabsTrigger value="domestic-conference" asChild className="rounded-lg py-2 text-xs lg:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Link href="/papers/domestic-conference" data-testid="tab-domestic-conf">
                    국내 학술대회
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="international-conference" asChild className="rounded-lg py-2 text-xs lg:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Link href="/papers/international-conference" data-testid="tab-intl-conf">
                    해외 학술대회
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="domestic-journal" asChild className="rounded-lg py-2 text-xs lg:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Link href="/papers/domestic-journal" data-testid="tab-domestic-journal">
                    국내 저널
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="international-journal" asChild className="rounded-lg py-2 text-xs lg:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Link href="/papers/international-journal" data-testid="tab-intl-journal">
                    해외 저널
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="main-journal" asChild className="rounded-lg py-2 text-xs lg:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Link href="/papers/main-journal" data-testid="tab-main-journal">
                    본 저널
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="paper-review" asChild className="rounded-lg py-2 text-xs lg:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Link href="/papers/paper-review" data-testid="tab-paper-review">
                    논문리뷰
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}
                className="rounded-lg font-semibold px-4 h-11"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showAll ? "페이지별 보기" : "전체보기"}
              </Button>
              <Button 
                onClick={openAdd} 
                className="rounded-lg shadow-md font-bold px-6 bg-gradient-to-r from-primary to-blue-600 h-11"
                data-testid="button-add-paper"
              >
                <Plus className="w-4 h-4 mr-2" />
                등록
              </Button>
            </div>
          </div>

          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[category]} rounded-lg flex items-center justify-center shadow-md`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl lg:text-2xl font-black text-gray-900">
                {categoryTitles[category]}
              </h2>
            </div>

            <div className="space-y-4">
              {displayedPapers.map((paper) => (
                <Card key={paper.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
                  <CardContent className="p-5 lg:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[category]} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <h3 
                            className="font-bold text-lg text-gray-900 mb-2 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => openView(paper)}
                          >
                            {paper.title}
                          </h3>
                          {paper.comments.length > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <MessageSquare className="w-3 h-3" />
                              {paper.comments.length}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-base text-gray-600 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {paper.authors}
                          </span>
                          {paper.firstAuthor && (
                            <span className="text-sm text-blue-600">주저자: {paper.firstAuthor}</span>
                          )}
                          {paper.correspondingAuthor && (
                            <span className="text-sm text-green-600">교신저자: {paper.correspondingAuthor}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            {paper.venue || paper.journal}
                            {paper.volume && ` (${paper.volume})`}
                          </span>
                          <Badge className={`bg-gradient-to-r ${categoryColors[category]} text-white border-0`}>
                            {paper.year}
                          </Badge>
                          {paper.websiteUrl && (
                            <a href={paper.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 hover:underline">
                              <ExternalLink className="w-3.5 h-3.5" />
                              사이트
                            </a>
                          )}
                        </div>
                        {paper.files && paper.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {paper.files.map((file, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                                {getFileIcon(file.type)} {file.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={() => openEdit(paper)}
                          data-testid={`button-edit-paper-${paper.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-destructive"
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
                <div className="p-16 text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-base">등록된 논문이 없습니다.</p>
                </div>
              )}
            </div>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="rounded-lg" 
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className="rounded-lg w-10 h-10"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="rounded-lg" 
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold pr-8">{viewingPaper?.title}</DialogTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{viewingPaper?.authors}</span>
              <Badge className={`bg-gradient-to-r ${categoryColors[category]} text-white border-0`}>
                {viewingPaper?.year}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-700 text-base">
                <strong>게재처:</strong> {viewingPaper?.venue || viewingPaper?.journal}
                {viewingPaper?.volume && ` (${viewingPaper.volume})`}
              </p>
              {viewingPaper?.firstAuthor && (
                <p className="text-blue-600 text-base"><strong>주저자:</strong> {viewingPaper.firstAuthor}</p>
              )}
              {viewingPaper?.correspondingAuthor && (
                <p className="text-green-600 text-base"><strong>교신저자:</strong> {viewingPaper.correspondingAuthor}</p>
              )}
              {viewingPaper?.websiteUrl && (
                <p className="text-base">
                  <strong>사이트:</strong>{" "}
                  <a href={viewingPaper.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {viewingPaper.websiteUrl}
                  </a>
                </p>
              )}
            </div>

            {viewingPaper?.files && viewingPaper.files.length > 0 && (
              <div className="space-y-2">
                <Label className="font-bold text-base">첨부파일</Label>
                <div className="space-y-2">
                  {viewingPaper.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(file.type)}</span>
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary h-8">
                        <Download className="w-4 h-4 mr-1" />
                        다운로드
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <Label className="font-bold flex items-center gap-2 mb-4 text-base">
                <MessageSquare className="w-4 h-4" />
                댓글 ({viewingPaper?.comments.length || 0})
              </Label>
              
              {viewingPaper?.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-400">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
              ))}

              <div className="space-y-2 mt-4">
                <Input
                  placeholder="이름을 입력하세요"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="h-10 rounded-lg text-base"
                  data-testid="input-comment-author"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="h-11 rounded-lg text-base"
                    data-testid="input-paper-comment"
                  />
                  <Button onClick={addComment} className="rounded-lg px-4 h-11" data-testid="button-add-paper-comment">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">등록</DialogTitle>
            <DialogDescription className="text-base">{categoryTitles[category]}에 새 논문을 등록합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-bold">논문 제목</Label>
              <Input
                placeholder="논문 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-paper-title"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">저자</Label>
              <Input
                placeholder="저자를 입력하세요 (예: 홍길동, 김철수)"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-paper-authors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">주저자</Label>
                <Input
                  placeholder="주저자"
                  value={formData.firstAuthor}
                  onChange={(e) => setFormData({ ...formData, firstAuthor: e.target.value })}
                  className="h-11 rounded-lg text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">교신저자</Label>
                <Input
                  placeholder="교신저자"
                  value={formData.correspondingAuthor}
                  onChange={(e) => setFormData({ ...formData, correspondingAuthor: e.target.value })}
                  className="h-11 rounded-lg text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">사이트 주소</Label>
              <Input
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="h-11 rounded-lg text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{isJournal ? "저널명" : "학술대회명"}</Label>
              <Input
                placeholder={isJournal ? "저널명을 입력하세요" : "학술대회명을 입력하세요"}
                value={isJournal ? formData.journal : formData.venue}
                onChange={(e) => setFormData({ ...formData, [isJournal ? 'journal' : 'venue']: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-paper-venue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">발행년도</Label>
                <Input
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="h-11 rounded-lg text-base"
                  data-testid="input-paper-year"
                />
              </div>
              {isJournal && (
                <div className="space-y-2">
                  <Label className="font-bold">Volume</Label>
                  <Input
                    placeholder="51(3)"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="h-11 rounded-lg text-base"
                    data-testid="input-paper-volume"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">첨부파일</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="paper-file-upload"
                />
                <label htmlFor="paper-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">클릭하여 파일 업로드</span>
                </label>
              </div>
              {formData.files.length > 0 && (
                <div className="space-y-2 mt-3">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(file.type)}</span>
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-lg h-11 text-base">
                취소
              </Button>
              <Button onClick={handleAdd} className="flex-1 rounded-lg h-11 font-bold bg-gradient-to-r from-primary to-blue-600 text-base" data-testid="button-submit-paper">
                등록
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">논문 수정</DialogTitle>
            <DialogDescription className="text-base">논문 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-bold">논문 제목</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-11 rounded-lg text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">저자</Label>
              <Input
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="h-11 rounded-lg text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">주저자</Label>
                <Input
                  value={formData.firstAuthor}
                  onChange={(e) => setFormData({ ...formData, firstAuthor: e.target.value })}
                  className="h-11 rounded-lg text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">교신저자</Label>
                <Input
                  value={formData.correspondingAuthor}
                  onChange={(e) => setFormData({ ...formData, correspondingAuthor: e.target.value })}
                  className="h-11 rounded-lg text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">사이트 주소</Label>
              <Input
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="h-11 rounded-lg text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{isJournal ? "저널명" : "학술대회명"}</Label>
              <Input
                value={isJournal ? formData.journal : formData.venue}
                onChange={(e) => setFormData({ ...formData, [isJournal ? 'journal' : 'venue']: e.target.value })}
                className="h-11 rounded-lg text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">발행년도</Label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="h-11 rounded-lg text-base"
                />
              </div>
              {isJournal && (
                <div className="space-y-2">
                  <Label className="font-bold">Volume</Label>
                  <Input
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="h-11 rounded-lg text-base"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">첨부파일</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="paper-file-upload-edit"
                />
                <label htmlFor="paper-file-upload-edit" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">클릭하여 파일 업로드</span>
                </label>
              </div>
              {formData.files.length > 0 && (
                <div className="space-y-2 mt-3">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(file.type)}</span>
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 rounded-lg h-11 text-base">
                취소
              </Button>
              <Button onClick={handleEdit} className="flex-1 rounded-lg h-11 font-bold bg-gradient-to-r from-primary to-blue-600 text-base" data-testid="button-update-paper">
                수정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">논문을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              이 작업은 되돌릴 수 없습니다. 논문이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground rounded-lg">
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