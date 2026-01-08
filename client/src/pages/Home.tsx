import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Users, 
  ChevronRight,
  Database,
  Brain,
  Globe,
  ArrowRight,
  Calendar,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

const notices = [
  { id: 1, title: "2024학년도 2학기 학위논문 심사 일정 안내", date: "2024.01.05", views: 234 },
  { id: 2, title: "겨울학기 수강신청 안내", date: "2024.01.03", views: 189 },
  { id: 3, title: "대학원 장학금 신청 안내", date: "2024.01.02", views: 156 },
  { id: 4, title: "연구실 안전교육 이수 안내", date: "2023.12.28", views: 142 },
];

const features = [
  {
    icon: Database,
    title: "데이터사이언스",
    description: "데이터의 분석과 처리 기술을 겸비한 데이터 과학자 육성"
  },
  {
    icon: Brain,
    title: "AI/머신러닝",
    description: "기계학습과 딥러닝 기반의 인공지능 응용 연구"
  },
  {
    icon: Globe,
    title: "메타버스융합",
    description: "미래 메타버스 기술과 산업 융합 전문가 양성"
  }
];

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />
      
      <section className="hero-gradient text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-blue-200 text-lg mb-4 font-medium">
              단국대학교 일반대학원
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              데이터지식서비스공학과
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              Department of Data and Knowledge Service Engineering
            </p>
            <p className="text-blue-200 text-lg max-w-2xl mb-8 leading-relaxed">
              데이터 분석 기반의 융합 연구를 통해 사회 전 분야에 적용 가능한 
              미래 지향적 인재를 양성합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-blue-50 font-semibold px-8"
                data-testid="button-talent-pool"
                asChild
              >
                <Link href="/talent-pool">
                  인재풀 등록 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/50 text-white hover:bg-white/10 font-semibold px-8"
                data-testid="button-intro"
                asChild
              >
                <Link href="/about">학과 소개</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              전공 분야
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              데이터 과학과 메타버스 기술의 융합을 통한 미래 인재 양성
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full card-hover border-0 shadow-md bg-card">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  공지사항
                </h2>
                <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
                  <Link href="/notices" data-testid="link-notices-more">
                    더보기 <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Card className="border-0 shadow-md">
                <CardContent className="p-0">
                  {notices.map((notice, index) => (
                    <Link 
                      key={notice.id} 
                      href={`/notices/${notice.id}`}
                      data-testid={`link-notice-${notice.id}`}
                    >
                      <div 
                        className={`p-5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer ${
                          index !== notices.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate pr-4">
                            {notice.title}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {notice.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {notice.views}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                바로가기
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GraduationCap, title: "학과 소개", href: "/about" },
                  { icon: BookOpen, title: "논문", href: "/papers" },
                  { icon: FileText, title: "학과 내규", href: "/regulations" },
                  { icon: Users, title: "인재풀 등록", href: "/talent-pool" },
                ].map((item, index) => (
                  <Link key={item.title} href={item.href} data-testid={`link-quick-${index}`}>
                    <Card className="h-full card-hover border-0 shadow-md cursor-pointer group">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-7 h-7 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">{item.title}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}