import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Target, Award, ExternalLink } from "lucide-react";
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

const professors = [
  { name: "교수명1", position: "교수", field: "데이터사이언스", email: "prof1@dankook.ac.kr" },
  { name: "교수명2", position: "부교수", field: "인공지능", email: "prof2@dankook.ac.kr" },
  { name: "교수명3", position: "조교수", field: "메타버스", email: "prof3@dankook.ac.kr" },
];

export default function About() {
  const [loginOpen, setLoginOpen] = useState(false);

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
            <p className="text-blue-200 mb-2">Department Introduction</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">학과 소개</h1>
            <p className="text-blue-100 max-w-2xl">
              데이터지식서비스공학과는 데이터 분석 기반의 융합 연구를 통해 
              미래를 선도하는 전문 인재를 양성합니다.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      데이터지식서비스공학과 전공
                    </h2>
                    <p className="text-primary font-medium">
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-bold text-foreground mb-8 text-center"
          >
            전공 소개
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-0 shadow-md card-hover">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl">데이터사이언스</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    데이터사이언스전공(Data Science)은 데이터의 분석과 처리 기술을 겸비한 데이터 과학자의 
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
              <Card className="h-full border-0 shadow-md card-hover">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl">메타버스융합</CardTitle>
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

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-bold text-foreground mb-8 text-center"
          >
            교과과정
          </motion.h2>

          <Tabs defaultValue="common" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="common" data-testid="tab-common">학과공통</TabsTrigger>
              <TabsTrigger value="data" data-testid="tab-data">데이터사이언스</TabsTrigger>
              <TabsTrigger value="metaverse" data-testid="tab-metaverse">메타버스융합</TabsTrigger>
            </TabsList>

            <TabsContent value="common">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curriculum.common.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-muted/50 rounded-lg text-sm"
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
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curriculum.dataScience.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-muted/50 rounded-lg text-sm"
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
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curriculum.metaverse.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-muted/50 rounded-lg text-sm"
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

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              교수진
            </h2>
            <Button variant="outline" asChild>
              <a 
                href="https://grad.dankook.ac.kr/-33?p_p_id=dku_org_GradDeptInfoPortlet_INSTANCE_lgrb&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_action=view_message&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_orgId=2000004845"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-professors"
              >
                더 알아보기 <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {professors.map((prof, index) => (
              <motion.div
                key={prof.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{prof.name}</h3>
                    <p className="text-primary text-sm font-medium mb-2">{prof.position}</p>
                    <p className="text-muted-foreground text-sm mb-2">{prof.field}</p>
                    <p className="text-muted-foreground text-xs">{prof.email}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}