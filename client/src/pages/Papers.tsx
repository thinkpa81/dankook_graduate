import { useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { FileText, Calendar, Users, ExternalLink, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

const papers = {
  domesticConference: [
    { id: 1, title: "빅데이터 분석을 활용한 소비자 행동 예측 모델 연구", authors: "김철수, 이영희", venue: "한국정보과학회 학술대회", year: "2024" },
    { id: 2, title: "자연어 처리 기반 감성 분석 시스템 개발", authors: "박지민, 최수진", venue: "한국데이터베이스학회 학술대회", year: "2023" },
    { id: 3, title: "클라우드 컴퓨팅 환경에서의 데이터 보안 연구", authors: "정민수, 김하늘", venue: "한국정보보호학회 학술대회", year: "2023" },
  ],
  internationalConference: [
    { id: 1, title: "Deep Learning Approach for Time Series Prediction", authors: "Kim, J., Lee, H.", venue: "IEEE International Conference on Data Mining", year: "2024" },
    { id: 2, title: "A Novel Framework for Knowledge Graph Construction", authors: "Park, S., Choi, M.", venue: "ACM SIGKDD Conference", year: "2023" },
  ],
  domesticJournal: [
    { id: 1, title: "인공지능 기반 의료 데이터 분석 플랫폼 설계", authors: "이민호, 김서연", journal: "한국정보과학회논문지", year: "2024", volume: "51(3)" },
    { id: 2, title: "메타버스 환경에서의 사용자 경험 분석", authors: "정유진, 박현우", journal: "한국HCI학회논문지", year: "2023", volume: "18(4)" },
  ],
  internationalJournal: [
    { id: 1, title: "Machine Learning for Predictive Analytics in Healthcare", authors: "Kim, Y., Lee, J.", journal: "IEEE Transactions on Knowledge and Data Engineering", year: "2024", volume: "36(2)" },
    { id: 2, title: "Efficient Data Mining Algorithms for Big Data Processing", authors: "Park, H., Choi, S.", journal: "ACM Computing Surveys", year: "2023", volume: "55(4)" },
  ],
  mainJournal: [
    { id: 1, title: "데이터지식서비스공학과 연구 동향 분석", authors: "학과 연구팀", journal: "단국대학교 대학원 논문집", year: "2024", volume: "12(1)" },
  ]
};

const categoryTitles: Record<string, string> = {
  "domestic-conference": "국내 학술대회",
  "international-conference": "해외 학술대회",
  "domestic-journal": "국내 저널",
  "international-journal": "해외 저널",
  "main-journal": "본 저널",
};

export default function Papers() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [, params] = useRoute("/papers/:category");
  const category = params?.category || "domestic-conference";

  const getPapers = (cat: string) => {
    switch (cat) {
      case "domestic-conference": return papers.domesticConference;
      case "international-conference": return papers.internationalConference;
      case "domestic-journal": return papers.domesticJournal;
      case "international-journal": return papers.internationalJournal;
      case "main-journal": return papers.mainJournal;
      default: return papers.domesticConference;
    }
  };

  const currentPapers = getPapers(category);

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
            <p className="text-blue-200 mb-2">Papers & Publications</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">논문</h1>
            <p className="text-blue-100 max-w-2xl">
              학과의 연구 성과와 논문을 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <Tabs value={category} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 h-auto">
              <TabsTrigger value="domestic-conference" asChild className="py-3">
                <Link href="/papers/domestic-conference" data-testid="tab-domestic-conf">
                  국내 학술대회
                </Link>
              </TabsTrigger>
              <TabsTrigger value="international-conference" asChild className="py-3">
                <Link href="/papers/international-conference" data-testid="tab-intl-conf">
                  해외 학술대회
                </Link>
              </TabsTrigger>
              <TabsTrigger value="domestic-journal" asChild className="py-3">
                <Link href="/papers/domestic-journal" data-testid="tab-domestic-journal">
                  국내 저널
                </Link>
              </TabsTrigger>
              <TabsTrigger value="international-journal" asChild className="py-3">
                <Link href="/papers/international-journal" data-testid="tab-intl-journal">
                  해외 저널
                </Link>
              </TabsTrigger>
              <TabsTrigger value="main-journal" asChild className="py-3 col-span-2 lg:col-span-1">
                <Link href="/papers/main-journal" data-testid="tab-main-journal">
                  본 저널
                </Link>
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {categoryTitles[category]}
              </h2>

              <div className="space-y-4">
                {currentPapers.map((paper) => (
                  <Card key={paper.id} className="border-0 shadow-md card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground mb-2">
                            {paper.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {paper.authors}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {'venue' in paper ? paper.venue : paper.journal}
                              {'volume' in paper && ` (${paper.volume})`}
                            </span>
                            <Badge variant="secondary">{paper.year}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {currentPapers.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    등록된 논문이 없습니다.
                  </div>
                )}
              </div>
            </motion.div>
          </Tabs>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}