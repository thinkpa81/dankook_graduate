import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Eye, FileText, Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, X, Upload, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  views: number;
  hasFile: boolean;
  isImportant: boolean;
}

const initialNotices: Notice[] = [
  { id: 1, title: "2024학년도 2학기 학위논문 심사 일정 안내", content: "학위논문 심사 일정을 안내드립니다.", date: "2024.01.05", views: 234, hasFile: true, isImportant: true },
  { id: 2, title: "겨울학기 수강신청 안내", content: "겨울학기 수강신청 관련 안내입니다.", date: "2024.01.03", views: 189, hasFile: true, isImportant: true },
  { id: 3, title: "대학원 장학금 신청 안내", content: "장학금 신청 안내입니다.", date: "2024.01.02", views: 156, hasFile: true, isImportant: false },
  { id: 4, title: "연구실 안전교육 이수 안내", content: "안전교육 이수 안내입니다.", date: "2023.12.28", views: 142, hasFile: false, isImportant: false },
  { id: 5, title: "2024학년도 1학기 대학원 신입생 모집 안내", content: "신입생 모집 안내입니다.", date: "2023.12.20", views: 312, hasFile: true, isImportant: false },
];

export default function Notices() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isImportant: false,
    hasFile: false,
  });

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const newNotice: Notice = {
      id: Math.max(...notices.map(n => n.id)) + 1,
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      views: 0,
      hasFile: formData.hasFile,
      isImportant: formData.isImportant,
    };
    setNotices([newNotice, ...notices]);
    setIsAddOpen(false);
    setFormData({ title: "", content: "", isImportant: false, hasFile: false });
  };

  const handleEdit = () => {
    if (!editingNotice) return;
    setNotices(notices.map(n => 
      n.id === editingNotice.id 
        ? { ...n, title: formData.title, content: formData.content, isImportant: formData.isImportant, hasFile: formData.hasFile }
        : n
    ));
    setIsEditOpen(false);
    setEditingNotice(null);
    setFormData({ title: "", content: "", isImportant: false, hasFile: false });
  };

  const handleDelete = () => {
    if (deleteId) {
      setNotices(notices.filter(n => n.id !== deleteId));
      setDeleteId(null);
    }
  };

  const openEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      isImportant: notice.isImportant,
      hasFile: notice.hasFile,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="hero-gradient hero-pattern text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-blue-100">Notices</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">공지사항</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              학과의 주요 소식과 공지사항을 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요"
                className="pl-12 h-12 rounded-xl border-0 bg-card shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button 
              onClick={() => setIsAddOpen(true)} 
              className="rounded-full shadow-lg font-semibold px-6"
              data-testid="button-add-notice"
            >
              <Plus className="w-4 h-4 mr-2" />
              공지 등록
            </Button>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden rounded-2xl">
            <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-gradient-to-r from-primary/5 to-transparent font-semibold text-sm text-muted-foreground border-b">
              <div className="col-span-1 text-center">번호</div>
              <div className="col-span-6">제목</div>
              <div className="col-span-2 text-center">작성일</div>
              <div className="col-span-1 text-center">조회수</div>
              <div className="col-span-1 text-center">첨부</div>
              <div className="col-span-1 text-center">관리</div>
            </div>
            
            <CardContent className="p-0">
              {filteredNotices.map((notice, index) => (
                <div 
                  key={notice.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-5 hover:bg-primary/5 transition-all duration-300 group ${
                    index !== filteredNotices.length - 1 ? 'border-b border-border/50' : ''
                  }`}
                >
                  <div className="hidden md:flex col-span-1 items-center justify-center text-muted-foreground text-sm font-medium">
                    {notice.id}
                  </div>
                  <div className="col-span-1 md:col-span-6 flex items-center gap-2">
                    {notice.isImportant && (
                      <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 text-xs">중요</Badge>
                    )}
                    <Link href={`/notices/${notice.id}`} data-testid={`link-notice-${notice.id}`}>
                      <span className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                        {notice.title}
                      </span>
                    </Link>
                  </div>
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1.5 md:hidden" />
                    {notice.date}
                  </div>
                  <div className="col-span-1 md:col-span-1 flex items-center md:justify-center text-sm text-muted-foreground">
                    <Eye className="w-4 h-4 mr-1.5 md:hidden" />
                    {notice.views}
                  </div>
                  <div className="hidden md:flex col-span-1 items-center justify-center">
                    {notice.hasFile && (
                      <FileText className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => openEdit(notice)}
                      data-testid={`button-edit-${notice.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDeleteId(notice.id)}
                      data-testid={`button-delete-${notice.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredNotices.length === 0 && (
                <div className="p-16 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>검색 결과가 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="icon" disabled className="rounded-full" data-testid="button-prev">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button className="rounded-full w-10 h-10" data-testid="button-page-1">1</Button>
            <Button variant="outline" className="rounded-full w-10 h-10" data-testid="button-page-2">2</Button>
            <Button variant="outline" className="rounded-full w-10 h-10" data-testid="button-page-3">3</Button>
            <Button variant="outline" size="icon" className="rounded-full" data-testid="button-next">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">공지사항 등록</DialogTitle>
            <DialogDescription>새로운 공지사항을 작성합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="공지사항 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl"
                data-testid="input-notice-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                placeholder="공지사항 내용을 입력하세요"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[150px] rounded-xl"
                data-testid="textarea-notice-content"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="important"
                  checked={formData.isImportant}
                  onCheckedChange={(checked) => setFormData({ ...formData, isImportant: checked as boolean })}
                  data-testid="checkbox-important"
                />
                <Label htmlFor="important" className="cursor-pointer">중요 공지</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasFile"
                  checked={formData.hasFile}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasFile: checked as boolean })}
                  data-testid="checkbox-file"
                />
                <Label htmlFor="hasFile" className="cursor-pointer">파일 첨부</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-xl h-12">
                취소
              </Button>
              <Button onClick={handleAdd} className="flex-1 rounded-xl h-12 font-semibold" data-testid="button-submit-notice">
                등록
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">공지사항 수정</DialogTitle>
            <DialogDescription>공지사항을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">제목</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl"
                data-testid="input-edit-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">내용</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[150px] rounded-xl"
                data-testid="textarea-edit-content"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-important"
                  checked={formData.isImportant}
                  onCheckedChange={(checked) => setFormData({ ...formData, isImportant: checked as boolean })}
                />
                <Label htmlFor="edit-important" className="cursor-pointer">중요 공지</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-hasFile"
                  checked={formData.hasFile}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasFile: checked as boolean })}
                />
                <Label htmlFor="edit-hasFile" className="cursor-pointer">파일 첨부</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 rounded-xl h-12">
                취소
              </Button>
              <Button onClick={handleEdit} className="flex-1 rounded-xl h-12 font-semibold" data-testid="button-update-notice">
                수정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 공지사항이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground rounded-xl" data-testid="button-confirm-delete">
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