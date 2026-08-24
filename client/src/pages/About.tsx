import { motion } from "framer-motion";
import { GraduationCap, Award, ExternalLink, Database, Globe, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import DoctoralContactGuide from "@/components/DoctoralContactGuide";

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

const advisorResearchInterests = [
  "Artificial\nIntelligence",
  "Metaverse",
  "Smart City",
  "M&A, PMI",
  "Interface design\nfor e-business",
  "Computer-\nmediated\ncommunication",
  "IT management",
  "Design thinking",
  "CSCL (Computer Supported\nCollaborative Learning)",
  "MOOC",
];

function AdvisorSection() {
  return (
    <section className="bg-gray-50 py-12 lg:py-16" aria-labelledby="advisor-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto mb-8 space-y-6"
          data-testid="advisor-layout"
        >
          <Card
            className="min-w-0 overflow-hidden rounded-xl border border-slate-200 shadow-lg"
            data-testid="advisor-profile"
          >
            <CardContent className="p-0">
              <div className="grid min-w-0 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] xl:min-h-[840px] xl:grid-cols-[336px_minmax(0,1fr)]">
                <div className="flex min-h-[300px] min-w-0 items-start justify-center bg-[#F3F8FF] px-6 pb-10 pt-12 md:min-h-full md:pt-24 lg:pt-28 xl:pt-[136px]">
                  <img
                    src="/portrait_transparent.png"
                    alt="서응교 지도교수"
                    className="h-auto w-[210px] max-w-full object-contain"
                    width="210"
                    height="196"
                    loading="eager"
                    decoding="async"
                    data-testid="advisor-portrait"
                  />
                </div>

                <div className="min-w-0 bg-white p-6 sm:p-8 lg:px-10 lg:py-9 xl:px-12 xl:py-10">
                  <h2 id="advisor-heading">
                    <span className="block text-base font-bold tracking-[0.04em] text-[#2156D9]">지도교수</span>
                    <span className="mt-2 block text-3xl font-black tracking-[-0.03em] text-slate-950 xl:text-4xl">
                      서응교 교수
                    </span>
                  </h2>

                  <div className="mt-7 flex min-w-0 items-start gap-3 text-base leading-7 text-slate-700">
                    <Building className="mt-1 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p>단국대학교 대학원 데이터지식서비스공학과</p>
                      <p className="mt-2 font-semibold leading-7 text-[#2156D9]">
                        AIMS Lab(에임즈 랩): AI, Innovation, Metaverse &amp; Service Lab
                      </p>
                    </div>
                  </div>

                  <div className="mt-9 border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950">연구관심분야</h3>
                  </div>
                  <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4" aria-label="서응교 교수 연구관심분야">
                    {advisorResearchInterests.map((interest, index) => (
                      <li
                        key={interest}
                        className={`flex min-w-0 whitespace-pre-line break-words items-center rounded-lg border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold leading-snug text-slate-700 [overflow-wrap:anywhere] ${
                          index >= 8
                            ? "min-h-[96px] lg:col-span-2 lg:min-h-[108px] lg:justify-center lg:px-5 lg:text-center lg:text-base lg:font-bold"
                            : "min-h-[80px] lg:min-h-[96px] lg:text-base"
                        }`}
                      >
                        {interest}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-16 border-t border-slate-200" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>

          <DoctoralContactGuide />
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="h-14 rounded-lg bg-gradient-to-r from-primary to-blue-600 px-8 text-base font-bold"
            asChild
          >
            <a
              href="https://grad.dankook.ac.kr/-33?p_p_id=dku_org_GradDeptInfoPortlet_INSTANCE_lgrb&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_action=view_message&_dku_org_GradDeptInfoPortlet_INSTANCE_lgrb_orgId=2000004845"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-professors"
            >
              교수진 더 알아보기 <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen overflow-x-clip flex flex-col bg-gray-50">
      <Header />

      <PageHero
        eyebrow="DEPARTMENT INTRODUCTION"
        title="학과 소개"
        description={"데이터지식서비스공학과는 데이터 분석 기반의 융합 연구를 통해 미래를 선도하는 전문 인재를\n양성합니다."}
        imageSrc="/page-hero-about.jpg"
        objectPosition="70% 50%"
        overlayClassName="bg-[#071B33]/60"
      />

      <AdvisorSection />

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
                        <p className="text-primary font-semibold text-base">
                          Department of Data and Knowledge Service Engineering
                        </p>
                      </div>
                    </div>
                    <p className="text-base leading-relaxed text-gray-600">
                      <span className="block">데이터 관리 및 분석 기술과 비즈니스 마인드를 기반으로 사회</span>
                      <span className="block">전 분야에 융합 적용이 가능한 미래 인재를 양성합니다.</span>
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
                          className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 text-center font-bold text-gray-800 text-base"
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
            <p className="text-primary font-semibold text-base mb-1">PROGRAMS</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
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
                  <p className="text-primary font-medium text-base">Data Science</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-base">
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
                  <p className="text-primary font-medium text-base">Metaverse Convergence</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-base">
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
            <p className="text-primary font-semibold text-base mb-1">CURRICULUM</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
              교과과정
            </h2>
          </motion.div>

          <Tabs defaultValue="common" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-14 p-1 bg-gray-100 rounded-xl">
              <TabsTrigger value="common" className="rounded-lg py-3 font-bold text-base data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-common">
                학과공통
              </TabsTrigger>
              <TabsTrigger value="data" className="rounded-lg py-3 font-bold text-base data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-data">
                데이터사이언스
              </TabsTrigger>
              <TabsTrigger value="metaverse" className="rounded-lg py-3 font-bold text-base data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-metaverse">
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
                        className="p-3 bg-blue-50 rounded-lg text-base font-medium text-gray-700 border border-blue-100"
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
                        className="p-3 bg-emerald-50 rounded-lg text-base font-medium text-gray-700 border border-emerald-100"
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
                        className="p-3 bg-purple-50 rounded-lg text-base font-medium text-gray-700 border border-purple-100"
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

      <Footer />
    </div>
  );
}
