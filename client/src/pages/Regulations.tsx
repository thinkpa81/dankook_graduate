import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ChevronDown, ChevronUp, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

const regulations = [
  {
    id: 1,
    title: "제1장 총칙",
    description: "목적 및 적용 범위",
    icon: "📜",
    content: `제1조 (목적)
본 내규는 단국대학교 창학정신을 구현하기 위하여 설립된 대학원의 학칙 및 시행세칙에 따라 데이터지식서비스공학과의 합리적인 운영에 필요한 사항들을 규정하여 정리하는 데 목적을 둔다.

제2조 (적용 범위와 효력)
본 내규는 일반대학원 데이터지식서비스공학과 석·박사과정 및 통합학위과정에 적용되며, 대학원 학칙 및 시행세칙의 범위 내에서만 효력을 발생한다.`,
    hasDownload: true,
  },
  {
    id: 2,
    title: "제2장 입학관리",
    description: "우수학생 유치",
    icon: "🎓",
    content: `제3조 (우수학생의 유치)
데이터지식서비스공학과 소속 교수들은 데이터지식서비스공학과 석·박사 및 통합 학위과정이 활성화될 수 있도록 우수학생의 모집에 적극적으로 노력한다.`,
    hasDownload: true,
  },
  {
    id: 3,
    title: "제3장 교육과정 및 교·강사 배정",
    description: "교과과정, 과목개설, 코어 과목",
    icon: "📚",
    content: `제4조 (교육과정)
데이터사이언스학 교육 및 연구에 맞는 내용으로 교육을 진행, 일반적인 규정은 학칙에 따른다.

제5조 (과목개설)
데이터사이언스학 관련 적합한 교과목을 개설하며, 일반적인 규정은 학칙에 따른다.

제6조 (교·강사 배정)
각 교과목은 데이터사이언스학 교육 및 연구에 적합한 교·강사를 배정하며, 일반적인 규정은 학칙에 따른다.

제7조 (코어 과목과 이수 가능 과목)
학과 코어 과목과 이수 가능 과목은 다음과 같다.

1. 6개 코어 과목은 빅데이터처리, 기계학습, 이미지처리인식, 글로벌융합프로젝트 1/2, 경영의사결정론이다.

2. 원칙적으로 데이터지식서비스공학과에 개설된 과목을 수강해야 한다. 단, 타학과에 개설된 동일/유사과목의 경우, 지도교수와 주임교수의 승인을 받아서 수강할 수 있다.

3. 코어 과목을 수강하지 못한 타당한 사유가 있을 경우, 지도교수와 주임교수의 승인을 받아 코어 교과목의 이수를 유사교과목 이수로 대체 인정받을 수 있다.

4. 부칙(2021. 06. 15) 7조(경과조치) 이 개정 규정은 2020년도 1학기 신입생부터 적용한다.`,
    hasDownload: true,
  },
  {
    id: 4,
    title: "제4장 논문지도",
    description: "지도교수 선정",
    icon: "👨‍🏫",
    content: `제8조 (지도교수의 선정)
지도교수는 컴퓨터공학, 소프트웨어학, 통계학, 경영학, 모바일시스템공학, 디자인씽킹, 건축공학 등 데이터지식서비스공학 관련 학과 소속 교수진으로 데이터지식서비스공학 개설 과목을 강의할 수 있는 교수로 한정한다. 일반적인 규정은 학칙에 따른다.`,
    hasDownload: true,
  },
  {
    id: 5,
    title: "제5장 자격시험",
    description: "종합시험 응시자격, 면제기준, 출제와 채점",
    icon: "✍️",
    content: `제9조 (종합시험 응시자격)
다음 조건을 갖춘 경우에 종합학력시험에 응시할 수 있다.

1. (석사과정) 6개 코어과목 중 2과목 이상을 이수해야 한다. 또한, 데이터사이언스학과에 개설된 과목을 6과목 이상 수강해야 한다.

2. (박사과정) 6개 코어과목 중 3과목 이상일 이수해야 한다. 또한, 데이터사이언스학과에 개설된 과목을 9과목 이상 수강해야 한다.

제10조 (종합학력시험 면제기준)
다음 조건을 갖춘 경우에 종합학력시험을 면제한다.

1. SCI(E) 논문은 공저자 이상 논문 1편
2. 연구재단 등재 논문(등재후보 논문 포함)은 주저자(1저자 또는 교신저자) 논문 1편 제출 시 종합시험을 면제함.

제11조 (종합학력시험 출제와 채점)
석사과정은 전임교원의 과목 중 2개 과목 이상, 박사 과정은 전임교원의 과목 중 4개 과목 이상.
※ 지도교수의 과목을 1개 이상 선택할 수 없음.
시험 방법은 필기시험으로 하며 합격점수는 80점 이상임

제12조 (외국어시험 과목)
대학원에서 실시하는 외국어 시험과목을 영어 과목만으로 한정함.`,
    hasDownload: true,
  },
  {
    id: 6,
    title: "제6장 학위과정",
    description: "석사학위 과정 선택, 변경, 졸업요건",
    icon: "🎖️",
    content: `제13조 (석사학위 과정 선택)
석사학위 취득은 학위논문을 기본으로 한다.

제14조 (석사학위 과정의 변경)
학위취득과정 변경은 원칙적으로 불가함. 단, 사유서 첨부 후 주임교수의 승인을 얻을 경우에는 3학기 말까지 대학원장의 승인하에 변경이 가능함.

제15조 (졸업요건)
석·박사 학위 취득을 위한 졸업 요건은 다음과 같다.

1. (석사과정) 석사학위의 경우 국내학술대회 논문 1편 이상을 발표해야 한다. 단, 포스터 논문, 초록만 포함된 논문도 포함한다.

2. (박사과정) 박사학위의 경우 국제논문지 논문 1편, 국내논문지(학진등재후보 이상) 논문 1편, 국제학술대회 논문 1편, 국내학술대회 논문 1편 이상을 제출해야 한다.`,
    hasDownload: true,
  },
  {
    id: 7,
    title: "제7장 학위논문 심사 및 제출",
    description: "연구계획서, 예비발표, 논문심사위원",
    icon: "📝",
    content: `제16조 (연구계획서 제출 및 심사)
석·박사과정 중 혹은 수료 후 적절한 시기에 지도교수에게 연구계획서를 제출한다.

제17조 (예비발표)
학위논문심사에 앞서 예비 발표를 진행한다.

제18조 (논문심사위원)
일반적인 규정은 학칙에 따른다.

제19조 (논문 대체 심사절차)
본 학과에서는 학위논문을 기본으로 하며 논문 이외 대체하지 않는다.`,
    hasDownload: true,
  },
  {
    id: 8,
    title: "제8장 학과 운영위원회",
    description: "의사결정 방식",
    icon: "🏛️",
    content: `제20조 (의사결정 방식)
학과 운영에 관한 제반 사항에 의사결정은 학과 운영위원회를 개최하여 전체 교수의 1/2 이상의 참석(위임 포함)과 참석 교수의 2/3 찬성으로 결정하는 것을 원칙으로 한다.`,
    hasDownload: true,
  },
];

export default function Regulations() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([1]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="hero-gradient hero-pattern text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-blue-100">Regulations</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">학과 내규</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              대학원 데이터지식서비스공학과 운영 내규
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      대학원 데이터지식서비스공학과 운영 내규
                    </h2>
                    <p className="text-muted-foreground">
                      단국대학교 일반대학원 학칙 및 시행세칙에 따른 학과 운영 규정
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {regulations.map((reg, index) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible
                  open={openItems.includes(reg.id)}
                  onOpenChange={() => toggleItem(reg.id)}
                >
                  <Card className="border-0 shadow-lg overflow-hidden rounded-2xl">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-primary/5 transition-all duration-300 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center text-2xl">
                              {reg.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold" data-testid={`regulation-title-${reg.id}`}>
                                {reg.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {reg.description}
                              </p>
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openItems.includes(reg.id) ? 'bg-primary text-white' : 'bg-muted'}`}>
                            {openItems.includes(reg.id) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 px-6 pb-6">
                        <div className="border-t pt-6">
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans bg-muted/30 p-6 rounded-xl">
                            {reg.content.trim()}
                          </pre>
                          {reg.hasDownload && (
                            <div className="flex gap-3 mt-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                data-testid={`button-download-pdf-${reg.id}`}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                PDF 다운로드
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                data-testid={`button-download-pptx-${reg.id}`}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                PPTX 다운로드
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
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