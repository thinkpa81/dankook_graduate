import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Eye, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

const notices = [
  { id: 1, title: "2024학년도 2학기 학위논문 심사 일정 안내", date: "2024.01.05", views: 234, hasFile: true, isImportant: true },
  { id: 2, title: "겨울학기 수강신청 안내", date: "2024.01.03", views: 189, hasFile: true, isImportant: true },
  { id: 3, title: "대학원 장학금 신청 안내", date: "2024.01.02", views: 156, hasFile: true, isImportant: false },
  { id: 4, title: "연구실 안전교육 이수 안내", date: "2023.12.28", views: 142, hasFile: false, isImportant: false },
  { id: 5, title: "2024학년도 1학기 대학원 신입생 모집 안내", date: "2023.12.20", views: 312, hasFile: true, isImportant: false },
  { id: 6, title: "학과 세미나 개최 안내 - 인공지능 최신 동향", date: "2023.12.15", views: 98, hasFile: false, isImportant: false },
  { id: 7, title: "논문 작성 가이드라인 업데이트", date: "2023.12.10", views: 187, hasFile: true, isImportant: false },
  { id: 8, title: "연구실 배정 결과 공지", date: "2023.12.05", views: 223, hasFile: false, isImportant: false },
  { id: 9, title: "겨울방학 연구실 운영 안내", date: "2023.12.01", views: 134, hasFile: false, isImportant: false },
  { id: 10, title: "2023년 우수 논문상 수상자 발표", date: "2023.11.28", views: 267, hasFile: true, isImportant: false },
];

export default function Notices() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="hero-gradient text-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-200 mb-2">Notices</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">공지사항</h1>
            <p className="text-blue-100 max-w-2xl">
              학과의 주요 소식과 공지사항을 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <Card className="border-0 shadow-md overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 font-semibold text-sm text-muted-foreground border-b">
              <div className="col-span-1 text-center">번호</div>
              <div className="col-span-7">제목</div>
              <div className="col-span-2 text-center">작성일</div>
              <div className="col-span-1 text-center">조회수</div>
              <div className="col-span-1 text-center">첨부</div>
            </div>
            
            <CardContent className="p-0">
              {filteredNotices.map((notice, index) => (
                <Link 
                  key={notice.id} 
                  href={`/notices/${notice.id}`}
                  data-testid={`link-notice-${notice.id}`}
                >
                  <div 
                    className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                      index !== filteredNotices.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="hidden md:flex col-span-1 items-center justify-center text-muted-foreground text-sm">
                      {notice.id}
                    </div>
                    <div className="col-span-1 md:col-span-7 flex items-center gap-2">
                      {notice.isImportant && (
                        <Badge variant="destructive" className="text-xs">중요</Badge>
                      )}
                      <span className="font-medium text-foreground hover:text-primary transition-colors">
                        {notice.title}
                      </span>
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
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {filteredNotices.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="icon" disabled data-testid="button-prev">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" data-testid="button-page-1">1</Button>
            <Button variant="outline" size="sm" data-testid="button-page-2">2</Button>
            <Button variant="outline" size="sm" data-testid="button-page-3">3</Button>
            <Button variant="outline" size="icon" data-testid="button-next">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}