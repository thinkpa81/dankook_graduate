import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Target, Award, ExternalLink, Database, Brain, Globe, User, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import dkuLogo from "@assets/image_1767877726952.png";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.3)_0%,_transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.2)_0%,_transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-cyan-400 font-semibold mb-2 text-sm tracking-wide">DEPARTMENT INTRODUCTION</p>
            <h1 className="text-3xl lg:text-4xl font-black mb-4 text-white">학과 소개</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              데이터지식서비스공학과는 데이터 분석 기반의 융합 연구를 통해 
              미래를 선도하는 전문 인재를 양성합니다.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                          데이터지식서비스공학과
                        </h2>
                        <p className="text-primary font-semibold">
                          Department of Data and Knowledge Service Engineering
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-base">
                      컴퓨터학, 통계학의 데이터 관리 및 분석 기술과 경영학 전반에 걸친 비즈니스마인드를 기반으로 
                      SAP의 실무 중심 기술을 반영하여 사회 전분야에 융합 적용이 가능한 교육과정을 구성함으로써, 
                      학부에서 컴퓨터학, 소프트웨어학, 통계학, 경영학, 경제학 등 관련 전공을 전공한 학생들 뿐 아니라 
                      데이터 분석 기반의 융합 연구에 관심을 갖고 있는 학생들도 지원이 가능합니다.
                    </p>
                  </div>
                  <div className="p-8 lg:p-10 bg-gradient-to-br from-amber-50 to-orange-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      6개 코어 과목
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {coreCourses.map((course, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 text-center font-medium text-gray-800 text-sm"
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

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary font-semibold text-sm mb-1">PROGRAMS</p>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
              전공 소개
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">데이터사이언스</CardTitle>
                  <p className="text-primary font-medium text-sm">Data Science</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm">
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
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">메타버스융합</CardTitle>
                  <p className="text-primary font-medium text-sm">Metaverse Convergence</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm">
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

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary font-semibold text-sm mb-1">CURRICULUM</p>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
              교과과정
            </h2>
          </motion.div>

          <Tabs defaultValue="common" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-gray-100 rounded-xl">
              <TabsTrigger value="common" className="rounded-lg py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-common">
                학과공통
              </TabsTrigger>
              <TabsTrigger value="data" className="rounded-lg py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-data">
                데이터사이언스
              </TabsTrigger>
              <TabsTrigger value="metaverse" className="rounded-lg py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-metaverse">
                메타버스융합
              </TabsTrigger>
            </TabsList>

            <TabsContent value="common">
              <Card className="border-0 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curriculum.common.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-blue-50 rounded-lg text-sm font-medium text-gray-700 border border-blue-100"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card className="border-0 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curriculum.dataScience.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-emerald-50 rounded-lg text-sm font-medium text-gray-700 border border-emerald-100"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metaverse">
              <Card className="border-0 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curriculum.metaverse.map((course, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-purple-50 rounded-lg text-sm font-medium text-gray-700 border border-purple-100"
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

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary font-semibold text-sm mb-1">FACULTY</p>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-6">
              교수진
            </h2>
          </motion.div>

          <Card className="border-0 shadow-lg rounded-xl max-w-md mx-auto mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-xs text-primary font-semibold mb-1">지도교수</p>
                  <h3 className="text-xl font-bold text-gray-900">서응교</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>죽전</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                <Building className="w-4 h-4 text-gray-400" />
                <span>소속: 대학원 데이터지식서비스공학과</span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              size="lg" 
              className="rounded-lg px-8 h-12 font-bold bg-gradient-to-r from-primary to-blue-600"
              asChild
            >
              <a 
                href="https://grad.dankook.ac.kr/-33?p_p_id=dku_org_GradDeptInfoPortlet_INSTANCE_lgrb&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_action=view_message&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_orgId=2000004845"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-professors"
              >
                교수진 더 알아보기 <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}