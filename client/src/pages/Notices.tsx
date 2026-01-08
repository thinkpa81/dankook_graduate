import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Eye, FileText, Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Upload, X, Download, MessageSquare, Send } from "lucide-react";
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
import { api, Notice, NoticeComment } from "@/lib/api";

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
  file?: File;
}

const ITEMS_PER_PAGE = 5;

export default function Notices() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isImportant: false,
    files: [] as FileAttachment[],
  });

  const loadNotices = async () => {
    setError(null);
    try {
      const data = await api.notices.list();
      setNotices(data);
    } catch (e: any) {
      console.error("Failed to load notices", e);
      setError("공지사항을 불러오는데 실패했습니다: " + (e.message || "알 수 없는 오류"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const paginatedNotices = filteredNotices.slice(
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
        url: URL.createObjectURL(file),
        file: file,
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
      case 'docx': case 'doc': return '📄';
      case 'xlsx': case 'xls': return '📊';
      case 'pptx': case 'ppt': return '📽️';
      case 'pdf': return '📕';
      default: return '📎';
    }
  };

  const downloadFile = (file: FileAttachment) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    setSaving(true);
    try {
      const newFiles = formData.files.filter(f => f.file);
      let uploadedUrls: string[] = [];
      
      if (newFiles.length > 0) {
        const uploaded = await api.uploadFiles(newFiles.map(f => f.file!));
        uploadedUrls = uploaded.map(u => u.url);
      }
      
      const existingUrls = formData.files.filter(f => !f.file && f.url).map(f => f.url);
      const allFileUrls = [...existingUrls, ...uploadedUrls];
      
      await api.notices.create({
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        views: 0,
        isImportant: formData.isImportant,
        files: allFileUrls,
      });
      await loadNotices();
      setIsAddOpen(false);
      setFormData({ title: "", content: "", isImportant: false, files: [] });
    } catch (e: any) {
      console.error("Failed to add notice", e);
      alert("공지사항 등록에 실패했습니다: " + (e.message || "서버 오류"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingNotice) return;
    setSaving(true);
    try {
      const newFiles = formData.files.filter(f => f.file);
      let uploadedUrls: string[] = [];
      
      if (newFiles.length > 0) {
        const uploaded = await api.uploadFiles(newFiles.map(f => f.file!));
        uploadedUrls = uploaded.map(u => u.url);
      }
      
      const existingUrls = formData.files.filter(f => !f.file && f.url).map(f => f.url);
      const allFileUrls = [...existingUrls, ...uploadedUrls];
      
      await api.notices.update(editingNotice.id, {
        title: formData.title,
        content: formData.content,
        isImportant: formData.isImportant,
        files: allFileUrls,
      });
      await loadNotices();
      setIsEditOpen(false);
      setEditingNotice(null);
      setFormData({ title: "", content: "", isImportant: false, files: [] });
    } catch (e: any) {
      console.error("Failed to edit notice", e);
      alert("공지사항 수정에 실패했습니다: " + (e.message || "서버 오류"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await api.notices.delete(deleteId);
        await loadNotices();
        setDeleteId(null);
      } catch (e: any) {
        console.error("Failed to delete notice", e);
        alert("공지사항 삭제에 실패했습니다: " + (e.message || "서버 오류"));
      }
    }
  };

  const openEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      isImportant: notice.isImportant,
      files: notice.files.map(fileStr => {
        const isUrl = fileStr.startsWith('/uploads/');
        const name = isUrl ? fileStr.split('/').pop()?.replace(/^\d+-\d+-/, '') || fileStr : fileStr;
        return { name, type: name.split('.').pop() || '', size: 0, url: isUrl ? fileStr : '' };
      }),
    });
    setIsEditOpen(true);
  };

  const openView = async (notice: Notice) => {
    try {
      await api.notices.incrementViews(notice.id);
      const updated = await api.notices.get(notice.id);
      setViewingNotice(updated);
      setNotices(prev => prev.map(n => n.id === notice.id ? updated : n));
      setIsViewOpen(true);
    } catch (e) {
      setViewingNotice(notice);
      setIsViewOpen(true);
    }
  };

  const openAdd = () => {
    setFormData({ title: "", content: "", isImportant: false, files: [] });
    setIsAddOpen(true);
  };

  const addComment = async () => {
    if (!viewingNotice || !newComment.trim() || !commentAuthor.trim()) return;
    try {
      const comment = await api.notices.addComment(viewingNotice.id, {
        author: commentAuthor,
        content: newComment,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      });
      const updated = { ...viewingNotice, comments: [...viewingNotice.comments, comment] };
      setViewingNotice(updated);
      setNotices(prev => prev.map(n => n.id === viewingNotice.id ? updated : n));
      setNewComment("");
      setCommentAuthor("");
    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  const startEditComment = (comment: NoticeComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const saveEditComment = async () => {
    if (!viewingNotice || !editingCommentId) return;
    try {
      await api.notices.updateComment(editingCommentId, editingCommentContent);
      const updatedComments = viewingNotice.comments.map(c => 
        c.id === editingCommentId ? { ...c, content: editingCommentContent } : c
      );
      const updated = { ...viewingNotice, comments: updatedComments };
      setViewingNotice(updated);
      setNotices(prev => prev.map(n => n.id === viewingNotice.id ? updated : n));
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (e) {
      console.error("Failed to update comment", e);
    }
  };

  const deleteComment = async () => {
    if (!viewingNotice || !deleteCommentId) return;
    try {
      await api.notices.deleteComment(deleteCommentId);
      const updatedComments = viewingNotice.comments.filter(c => c.id !== deleteCommentId);
      const updated = { ...viewingNotice, comments: updatedComments };
      setViewingNotice(updated);
      setNotices(prev => prev.map(n => n.id === viewingNotice.id ? updated : n));
      setDeleteCommentId(null);
    } catch (e) {
      console.error("Failed to delete comment", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onLoginClick={() => setLoginOpen(true)} onSignupClick={() => setSignupOpen(true)} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.3)_0%,_transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-cyan-400 font-semibold mb-2 text-base tracking-wide">NOTICES</p>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 text-white">공지사항</h1>
            <p className="text-blue-100 max-w-2xl text-lg">학과의 주요 소식과 공지사항을 확인하세요.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-14 flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="검색어를 입력하세요"
                className="pl-12 h-12 rounded-lg border-gray-200 bg-white shadow-sm text-base"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                data-testid="input-search"
              />
            </div>
            <Button onClick={openAdd} className="rounded-lg shadow-md font-bold px-6 bg-gradient-to-r from-primary to-blue-600 h-12 text-base" data-testid="button-add-notice">
              <Plus className="w-5 h-5 mr-2" />
              공지 등록
            </Button>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden rounded-xl">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-bold text-sm text-gray-600 border-b">
              <div className="col-span-1 text-center">번호</div>
              <div className="col-span-6">제목</div>
              <div className="col-span-2 text-center">작성일</div>
              <div className="col-span-1 text-center">조회수</div>
              <div className="col-span-1 text-center">첨부</div>
              <div className="col-span-1 text-center">관리</div>
            </div>
            
            <CardContent className="p-0 bg-white">
              {loading ? (
                <div className="p-16 text-center text-gray-500">로딩 중...</div>
              ) : paginatedNotices.map((notice, index) => {
                const displayNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                return (
                <div key={notice.id} className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 hover:bg-blue-50/50 transition-colors group ${index !== paginatedNotices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="hidden md:flex col-span-1 items-center justify-center text-gray-500 text-sm">{displayNumber}</div>
                  <div className="col-span-1 md:col-span-6 flex items-center gap-2">
                    {notice.isImportant && <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 text-xs">중요</Badge>}
                    <span className="font-medium text-gray-900 hover:text-primary transition-colors cursor-pointer text-base" onClick={() => openView(notice)} data-testid={`link-notice-${notice.id}`}>{notice.title}</span>
                    {notice.comments.length > 0 && <span className="text-xs text-gray-400 flex items-center gap-1"><MessageSquare className="w-3 h-3" />{notice.comments.length}</span>}
                  </div>
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-center text-sm text-gray-500"><Calendar className="w-4 h-4 mr-1.5 md:hidden" />{notice.date}</div>
                  <div className="col-span-1 md:col-span-1 flex items-center md:justify-center text-sm text-gray-500"><Eye className="w-4 h-4 mr-1.5 md:hidden" />{notice.views}</div>
                  <div className="hidden md:flex col-span-1 items-center justify-center gap-1">{notice.files.length > 0 && <span className="flex items-center gap-1 text-xs text-gray-500"><FileText className="w-4 h-4 text-primary" />{notice.files.length}</span>}</div>
                  <div className="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEdit(notice)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeleteId(notice.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              )})}
              {!loading && error && (
                <div className="p-16 text-center text-red-500"><FileText className="w-12 h-12 mx-auto mb-4 opacity-30" /><p className="text-base">{error}</p></div>
              )}
              {!loading && !error && filteredNotices.length === 0 && (
                <div className="p-16 text-center text-gray-500"><FileText className="w-12 h-12 mx-auto mb-4 opacity-30" /><p className="text-base">검색 결과가 없습니다.</p></div>
              )}
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button key={page} variant={currentPage === page ? "default" : "outline"} className="rounded-lg w-10 h-10" onClick={() => setCurrentPage(page)}>{page}</Button>
              ))}
              <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          )}
        </div>
      </section>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold pr-8">{viewingNotice?.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{viewingNotice?.date}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{viewingNotice?.views}</span>
            </div>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]"><p className="text-gray-700 whitespace-pre-wrap text-base">{viewingNotice?.content}</p></div>
            {viewingNotice?.files && viewingNotice.files.length > 0 && (
              <div className="space-y-2">
                <Label className="font-bold text-base">첨부파일</Label>
                <div className="space-y-2">
                  {viewingNotice.files.map((fileStr, index) => {
                    const isUrl = fileStr.startsWith('/uploads/');
                    const displayName = isUrl ? decodeURIComponent(fileStr.split('/').pop()?.replace(/^\d+-\d+-/, '') || fileStr) : fileStr;
                    const downloadUrl = isUrl ? fileStr : '';
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFileIcon(displayName.split('.').pop() || '')}</span>
                          <span className="text-sm font-medium text-gray-700">{displayName}</span>
                        </div>
                        {downloadUrl ? (
                          <a href={downloadUrl} download={displayName} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-blue-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />다운로드
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">다운로드 불가</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="border-t pt-6">
              <Label className="font-bold flex items-center gap-2 mb-4 text-base"><MessageSquare className="w-4 h-4" />댓글 ({viewingNotice?.comments.length || 0})</Label>
              {viewingNotice?.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Input value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)} className="h-10 rounded-lg" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEditComment} className="rounded-lg">저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)} className="rounded-lg">취소</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{comment.author}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{comment.date}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditComment(comment)}><Pencil className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setDeleteCommentId(comment.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </>
                  )}
                </div>
              ))}
              <div className="space-y-2 mt-4">
                <Input placeholder="이름을 입력하세요" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} className="h-10 rounded-lg text-base" />
                <div className="flex gap-2">
                  <Input placeholder="댓글을 입력하세요..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="h-11 rounded-lg text-base" />
                  <Button onClick={addComment} className="rounded-lg px-4 h-11"><Send className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">공지사항 등록</DialogTitle>
            <DialogDescription className="text-base">새로운 공지사항을 작성합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label className="font-bold text-base">제목</Label>
              <Input placeholder="공지사항 제목을 입력하세요" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-12 rounded-lg text-base" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-base">내용</Label>
              <Textarea placeholder="공지사항 내용을 입력하세요" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="min-h-[120px] rounded-lg text-base" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-base">첨부파일</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input type="file" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
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
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="important" checked={formData.isImportant} onCheckedChange={(checked) => setFormData({ ...formData, isImportant: checked as boolean })} />
              <Label htmlFor="important" className="cursor-pointer text-base">중요 공지로 등록</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving} className="flex-1 rounded-lg h-12 text-base">취소</Button>
              <Button onClick={handleAdd} disabled={saving} className="flex-1 rounded-lg h-12 font-bold bg-gradient-to-r from-primary to-blue-600 text-base">{saving ? "등록 중..." : "등록"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">공지사항 수정</DialogTitle>
            <DialogDescription className="text-base">공지사항을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label className="font-bold text-base">제목</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-12 rounded-lg text-base" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-base">내용</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="min-h-[120px] rounded-lg text-base" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-base">첨부파일</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input type="file" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf" onChange={handleFileChange} className="hidden" id="file-upload-edit" />
                <label htmlFor="file-upload-edit" className="cursor-pointer flex flex-col items-center gap-2">
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
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="edit-important" checked={formData.isImportant} onCheckedChange={(checked) => setFormData({ ...formData, isImportant: checked as boolean })} />
              <Label htmlFor="edit-important" className="cursor-pointer text-base">중요 공지로 등록</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving} className="flex-1 rounded-lg h-12 text-base">취소</Button>
              <Button onClick={handleEdit} disabled={saving} className="flex-1 rounded-lg h-12 font-bold bg-gradient-to-r from-primary to-blue-600 text-base">{saving ? "수정 중..." : "수정"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground rounded-lg">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteCommentId !== null} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>댓글을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">취소</AlertDialogCancel>
            <AlertDialogAction onClick={deleteComment} className="bg-destructive text-destructive-foreground rounded-lg">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <LoginModal open={signupOpen} onOpenChange={setSignupOpen} defaultTab="signup" />
    </div>
  );
}