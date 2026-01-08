import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Target, Award, ExternalLink, Sparkles, Database, Brain, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

const curriculum = {
  common: [
    "경영정보시스템(13025)", "전사적 자원관리론(13025)", "경영의사결정론(13025)",
    "컴퓨터 프로그래밍(13025)", "데이터베이스(13025)", "유닉스/리눅스(13025)",
    "선형통계분석(13025)", "기계 학습(13025)", "AI 헬스케어를 위한 컴퓨터 비전(13027)",
    "AI 헬스케어 개방형 혁신 프로젝트1(13027)", "기계학습과 딥러닝(13027)",
    "AI 헬스케어 개방형 혁신 프로젝트2(13027)"
  ],
  dataScience: [
    "데이터베이스 관리(13026)", "정보 검색(13026)", "클라우드 컴퓨팅(13026)",
    "빅데이터 처리(13026)", "하둡 프로그래밍(13026)", "자연어 처리(13026)",
    "지식 표현과 모델링(13026)", "인공 지능 응용(13026)", "개인정보 보호(13026)",
    "센서 네트워크(13026)", "이미지 처리와 인식(13026)", "인간-컴퓨터 상호작용(13026)",
    "경영최적화이론(13026)", "데이터 분석 및 기획(13026)", "데이터 마이닝(13026)"
  ],
  metaverse: [
    "메타버스기획론(13026)"
  ]
};

const coreCourses = [
  "빅데이터처리",
  "기계학습", 
  "이미지처리인식",
  "글로벌융합프로젝트 1",
  "글로벌융합프로젝트 2",
  "경영의사결정론"
];

export default function About() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="hero-gradient hero-pattern text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-blue-100">Department Introduction</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">학과 소개</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              데이터지식서비스공학과는 데이터 분석 기반의 융합 연구를 통해 
              미래를 선도하는 전문 인재를 양성합니다.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-2">
                          데이터지식서비스공학과
                        </h2>
                        <p className="text-primary font-semibold">
                          Department of Data and Knowledge Service Engineering
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      컴퓨터학, 통계학의 데이터 관리 및 분석 기술과 경영학 전반에 걸친 비즈니스마인드를 기반으로 
                      SAP의 실무 중심 기술을 반영하여 사회 전분야에 융합 적용이 가능한 교육과정을 구성함으로써, 
                      학부에서 컴퓨터학, 소프트웨어학, 통계학, 경영학, 경제학 등 관련 전공을 전공한 학생들 뿐 아니라 
                      데이터 분석 기반의 융합 연구에 관심을 갖고 있는 학생들도 지원이 가능합니다.
                    </p>
                  </div>
                  <div className="p-8 lg:p-12 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      6개 코어 과목
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {coreCourses.map((course, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-white rounded-xl shadow-sm border border-border/50 text-center font-medium text-foreground"
                        >
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              PROGRAMS
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">
              전공 소개
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-0 shadow-lg card-hover rounded-3xl overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">데이터사이언스</CardTitle>
                  <p className="text-primary font-medium">Data Science</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    데이터사이언스전공은 데이터의 분석과 처리 기술을 겸비한 데이터 과학자의 
                    육성을 목표로 관련 학문 분야의 이론적 지식과 실무를 습득할 수 있도록 
                    '데이터 기반의 인사이트와 가치'를 창출하는 미래 지향적인 교육과정을 운영합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg card-hover rounded-3xl overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">메타버스융합</CardTitle>
                  <p className="text-primary font-medium">Metaverse Convergence</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    메타버스융합 전공은 가상현실, 증강현실, 혼합현실 등 확장현실(XR) 기술과 
                    다양한 산업 분야의 융합을 통해 미래 메타버스 시대를 이끌어갈 
                    전문 인재를 양성하는 것을 목표로 합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              CURRICULUM
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">
              교과과정
            </h2>
          </motion.div>

          <Tabs defaultValue="common" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1.5 bg-muted rounded-2xl">
              <TabsTrigger value="common" className="rounded-xl py-3 text-base font-semibold data-[state=active]:shadow-md" data-testid="tab-common">
                학과공통
              </TabsTrigger>
              <TabsTrigger value="data" className="rounded-xl py-3 text-base font-semibold data-[state=active]:shadow-md" data-testid="tab-data">
                데이터사이언스
              </TabsTrigger>
              <TabsTrigger value="metaverse" className="rounded-xl py-3 text-base font-semibold data-[state=active]:shadow-md" data-testid="tab-metaverse">
                메타버스융합
              </TabsTrigger>
            </TabsList>

            <TabsContent value="common">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curriculum.common.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl text-sm font-medium border border-blue-100"
                        data-testid={`course-common-${index}`}
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curriculum.dataScience.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl text-sm font-medium border border-emerald-100"
                        data-testid={`course-data-${index}`}
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metaverse">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curriculum.metaverse.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl text-sm font-medium border border-purple-100"
                        data-testid={`course-metaverse-${index}`}
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              FACULTY
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-6">
              교수진
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              데이터지식서비스공학과의 우수한 교수진을 확인하세요.
            </p>
            <Button 
              size="lg" 
              className="rounded-full px-8 h-14 font-bold shadow-lg"
              asChild
            >
              <a 
                href="https://grad.dankook.ac.kr/-33?p_p_id=dku_org_GradDeptInfoPortlet_INSTANCE_lgrb&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_action=view_message&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_orgId=2000004845"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-professors"
              >
                교수진 더 알아보기 <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}