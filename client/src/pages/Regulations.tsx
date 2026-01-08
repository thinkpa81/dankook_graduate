import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
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
    title: "학과 운영 규정",
    description: "데이터지식서비스공학과 학과 운영에 관한 전반적인 규정",
    content: `
제1조 (목적) 본 규정은 단국대학교 일반대학원 데이터지식서비스공학과의 운영에 필요한 사항을 규정함을 목적으로 한다.

제2조 (적용범위) 본 규정은 데이터지식서비스공학과 소속 모든 대학원생에게 적용된다.

제3조 (학과 조직) 학과는 학과장, 전공주임, 교수회의로 구성된다.

제4조 (학과장) 학과장은 학과의 제반 업무를 총괄하며, 교수회의 의장이 된다.
    `,
    hasDownload: true,
  },
  {
    id: 2,
    title: "학위논문 심사 규정",
    description: "석사 및 박사 학위논문 심사에 관한 규정",
    content: `
제1조 (목적) 본 규정은 학위논문 심사에 관한 기준과 절차를 규정함을 목적으로 한다.

제2조 (논문 제출 자격)
1. 석사과정: 소정의 학점을 이수하고 종합시험에 합격한 자
2. 박사과정: 소정의 학점을 이수하고 종합시험 및 외국어시험에 합격한 자

제3조 (논문 심사 절차)
1. 논문계획서 제출 및 승인
2. 예비심사
3. 본심사
4. 최종 합격 판정

제4조 (심사위원회) 심사위원회는 3인 이상의 교수로 구성한다.
    `,
    hasDownload: true,
  },
  {
    id: 3,
    title: "장학금 지급 규정",
    description: "대학원 장학금 지급에 관한 규정",
    content: `
제1조 (목적) 본 규정은 장학금의 종류와 지급 기준을 명시함을 목적으로 한다.

제2조 (장학금 종류)
1. 연구장학금: 연구 실적이 우수한 학생
2. 성적장학금: 학업 성적이 우수한 학생
3. 근로장학금: 학과 업무를 보조하는 학생

제3조 (지급 기준) 장학금은 매 학기 심사를 통해 지급 대상자를 선정한다.

제4조 (의무) 장학금 수혜자는 학과가 정한 연구 및 학업 의무를 성실히 이행해야 한다.
    `,
    hasDownload: true,
  },
  {
    id: 4,
    title: "연구실 운영 규정",
    description: "연구실 이용 및 안전에 관한 규정",
    content: `
제1조 (목적) 본 규정은 연구실의 효율적인 운영과 안전 관리에 관한 사항을 규정함을 목적으로 한다.

제2조 (연구실 사용 시간) 연구실은 24시간 사용 가능하나, 야간 이용 시 안전 수칙을 준수해야 한다.

제3조 (안전 교육) 모든 연구실 이용자는 매년 안전 교육을 이수해야 한다.

제4조 (장비 사용) 고가 장비 사용 시에는 사전 교육을 이수하고 사용 승인을 받아야 한다.

제5조 (청결 유지) 연구실 이용자는 사용 후 정리정돈을 철저히 해야 한다.
    `,
    hasDownload: true,
  },
];

export default function Regulations() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
            <p className="text-blue-200 mb-2">Regulations</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">학과 내규</h1>
            <p className="text-blue-100 max-w-2xl">
              학과 운영에 관한 규정 및 내규를 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {regulations.map((reg, index) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Collapsible
                  open={openItems.includes(reg.id)}
                  onOpenChange={() => toggleItem(reg.id)}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg" data-testid={`regulation-title-${reg.id}`}>
                                {reg.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {reg.description}
                              </p>
                            </div>
                          </div>
                          {openItems.includes(reg.id) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans">
                            {reg.content.trim()}
                          </pre>
                          {reg.hasDownload && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              data-testid={`button-download-${reg.id}`}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PDF 다운로드
                            </Button>
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