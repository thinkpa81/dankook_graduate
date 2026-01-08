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
  Eye,
  Sparkles,
  TrendingUp,
  Award
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
    description: "데이터의 분석과 처리 기술을 겸비한 데이터 과학자 육성",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "AI/머신러닝",
    description: "기계학습과 딥러닝 기반의 인공지능 응용 연구",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "메타버스융합",
    description: "미래 메타버스 기술과 산업 융합 전문가 양성",
    color: "from-orange-500 to-amber-500"
  }
];

const stats = [
  { label: "재학생", value: "120+", icon: Users },
  { label: "졸업생", value: "350+", icon: GraduationCap },
  { label: "논문 실적", value: "500+", icon: FileText },
  { label: "취업률", value: "95%", icon: TrendingUp },
];

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />
      
      <section className="hero-gradient hero-pattern text-white py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl floating" />
          <div className="absolute bottom-10 right-20 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-blue-100">단국대학교 일반대학원</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              데이터지식<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">
                서비스공학과
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-3 font-light">
              Department of Data and Knowledge Service Engineering
            </p>
            <p className="text-blue-200/80 text-lg max-w-2xl mb-10 leading-relaxed">
              데이터 분석 기반의 융합 연구를 통해 사회 전 분야에 적용 가능한 
              미래 지향적 인재를 양성합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-base h-14"
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
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 rounded-full backdrop-blur-sm text-base h-14"
                data-testid="button-intro"
                asChild
              >
                <Link href="/about">학과 소개</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-8 relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="stat-card border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              PROGRAMS
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-5">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="h-full card-hover border-0 shadow-lg bg-card rounded-3xl overflow-hidden group">
                  <CardContent className="p-8 text-center relative">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
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

      <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                    NOTICES
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-black text-foreground">
                    공지사항
                  </h2>
                </div>
                <Button variant="ghost" asChild className="text-primary hover:text-primary/80 font-semibold rounded-full">
                  <Link href="/notices" data-testid="link-notices-more">
                    더보기 <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  {notices.map((notice, index) => (
                    <Link 
                      key={notice.id} 
                      href={`/notices/${notice.id}`}
                      data-testid={`link-notice-${notice.id}`}
                    >
                      <div 
                        className={`p-5 flex items-center justify-between hover:bg-primary/5 transition-all duration-300 cursor-pointer group ${
                          index !== notices.length - 1 ? 'border-b border-border/50' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate pr-4 group-hover:text-primary transition-colors">
                            {notice.title}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {notice.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              {notice.views}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                  QUICK LINKS
                </span>
                <h2 className="text-3xl lg:text-4xl font-black text-foreground">
                  바로가기
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: GraduationCap, title: "학과 소개", href: "/about", color: "from-blue-500 to-indigo-500" },
                  { icon: BookOpen, title: "논문", href: "/papers", color: "from-emerald-500 to-teal-500" },
                  { icon: FileText, title: "학과 내규", href: "/regulations", color: "from-amber-500 to-orange-500" },
                  { icon: Users, title: "인재풀 등록", href: "/talent-pool", color: "from-rose-500 to-pink-500" },
                ].map((item, index) => (
                  <Link key={item.title} href={item.href} data-testid={`link-quick-${index}`}>
                    <Card className="h-full card-hover border-0 shadow-lg cursor-pointer group rounded-2xl overflow-hidden">
                      <CardContent className="p-7 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="font-bold text-foreground text-lg">{item.title}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 hero-gradient hero-pattern text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Award className="w-16 h-16 mx-auto mb-6 text-amber-300" />
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              미래를 선도하는 데이터 전문가가 되세요
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              데이터지식서비스공학과에서 여러분의 꿈을 실현하세요
            </p>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold px-10 rounded-full shadow-xl h-14 text-base"
              asChild
            >
              <Link href="/talent-pool">
                지금 신청하기 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}