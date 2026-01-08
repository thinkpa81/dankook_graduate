import { useState, useEffect } from "react";
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
import { getNotices } from "@/lib/dataStore";

const features = [
  {
    icon: Database,
    title: "데이터사이언스",
    description: "데이터의 분석과 처리 기술을 겸비한 데이터 과학자 육성",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    icon: Brain,
    title: "AI/머신러닝",
    description: "기계학습과 딥러닝 기반의 인공지능 응용 연구",
    gradient: "from-violet-600 to-purple-500"
  },
  {
    icon: Globe,
    title: "메타버스융합",
    description: "미래 메타버스 기술과 산업 융합 전문가 양성",
    gradient: "from-orange-500 to-amber-400"
  }
];

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [notices, setNotices] = useState<{ id: number; title: string; date: string; views: number }[]>([]);

  useEffect(() => {
    const storedNotices = getNotices();
    setNotices(storedNotices.slice(0, 4).map((n, index) => ({
      id: index + 1,
      title: n.title,
      date: n.date,
      views: n.views
    })));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onLoginClick={() => setLoginOpen(true)} onSignupClick={() => setSignupOpen(true)} />
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.3)_0%,_transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.2)_0%,_transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              데이터 기반의<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                미래 인재 양성
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed">
              컴퓨터학, 통계학의 데이터 관리 및 분석 기술과 경영학 전반에 걸친 비즈니스 마인드를 기반으로 
              사회 전 분야에 융합 적용이 가능한 미래 지향적 인재를 양성합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 h-14 text-base"
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
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 rounded-lg backdrop-blur-sm h-14 text-base"
                data-testid="button-intro"
                asChild
              >
                <Link href="/about">학과 소개 보기</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-primary font-semibold mb-2 text-lg">PROGRAMS</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
              전공 분야
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-primary font-semibold text-sm mb-1">NOTICES</p>
                  <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                    공지사항
                  </h2>
                </div>
                <Button variant="ghost" asChild className="text-primary hover:text-primary/80 font-semibold">
                  <Link href="/notices" data-testid="link-notices-more">
                    더보기 <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  {notices.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">공지사항이 없습니다.</div>
                  ) : notices.map((notice, index) => (
                    <Link 
                      key={notice.id} 
                      href="/notices"
                      data-testid={`link-notice-${notice.id}`}
                    >
                      <div 
                        className={`p-5 flex items-center justify-between hover:bg-blue-50/50 transition-colors cursor-pointer group ${
                          index !== notices.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate pr-4 group-hover:text-primary transition-colors text-base">
                            {notice.title}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-primary transition-colors" />
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
              <div className="mb-6">
                <p className="text-primary font-semibold text-sm mb-1">QUICK LINKS</p>
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                  바로가기
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GraduationCap, title: "학과 소개", href: "/about", gradient: "from-blue-600 to-indigo-600" },
                  { icon: BookOpen, title: "논문", href: "/papers", gradient: "from-emerald-500 to-teal-500" },
                  { icon: FileText, title: "학과 내규", href: "/regulations", gradient: "from-orange-500 to-amber-500" },
                  { icon: Users, title: "인재풀 등록", href: "/talent-pool", gradient: "from-rose-500 to-pink-500" },
                ].map((item, index) => (
                  <Link key={item.title} href={item.href} data-testid={`link-quick-${index}`}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl cursor-pointer group rounded-xl overflow-hidden transition-all duration-300">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-base">{item.title}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.4)_0%,_transparent_60%)]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              미래를 선도하는 데이터 전문가가 되세요
            </h2>
            <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
              데이터지식서비스공학과에서 여러분의 꿈을 실현하세요
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-10 rounded-lg shadow-lg h-14 text-base"
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
      <LoginModal open={signupOpen} onOpenChange={setSignupOpen} defaultTab="signup" />
    </div>
  );
}