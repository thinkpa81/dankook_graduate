import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

export default function Privacy() {
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
            <p className="text-blue-200 mb-2">Privacy Policy</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">개인정보처리방침</h1>
            <p className="text-blue-100 max-w-2xl">
              단국대학교 일반대학원 데이터지식서비스공학과 개인정보처리방침
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-8">
                  단국대학교 일반대학원 데이터지식서비스공학과(이하 "학과")는 개인정보보호법 등 관련 법령에 따라 
                  이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 
                  다음과 같이 개인정보 처리방침을 수립·공개합니다.
                </p>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제1조 (개인정보의 처리 목적)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  학과는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 
                  다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 
                  개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>홈페이지 회원가입 및 관리: 회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리 등</li>
                  <li>민원사무 처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등</li>
                  <li>학사 행정 서비스 제공: 수강신청, 성적관리, 학위논문심사, 장학금 지급 등</li>
                  <li>인재풀 관리: 진학 관심 인재풀 등록 및 입학 안내 정보 제공</li>
                </ul>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제2조 (처리하는 개인정보의 항목)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  학과는 다음의 개인정보 항목을 처리하고 있습니다.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>필수항목: 성명, 이메일, 연락처, 학력사항</li>
                  <li>선택항목: 지원동기, 연구관심분야</li>
                  <li>자동수집항목: IP주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
                </ul>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제3조 (개인정보의 처리 및 보유 기간)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  학과는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                  동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>홈페이지 회원정보: 회원 탈퇴 시까지</li>
                  <li>인재풀 등록정보: 등록일로부터 2년 또는 동의 철회 시까지</li>
                  <li>학사 행정 기록: 관련 법령에 따른 보존기간</li>
                </ul>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제4조 (개인정보의 제3자 제공)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  학과는 원칙적으로 정보주체의 개인정보를 제1조에서 명시한 목적 범위 내에서 처리하며, 
                  정보주체의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 
                  다만, 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우에는 예외로 합니다.
                </p>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제5조 (개인정보의 파기)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  학과는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                  지체없이 해당 개인정보를 파기합니다.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>전자적 파일 형태: 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
                  <li>기록물, 인쇄물, 서면 등: 분쇄기로 분쇄하거나 소각</li>
                </ul>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제6조 (정보주체의 권리·의무 및 행사방법)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  정보주체는 학과에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제7조 (개인정보의 안전성 확보 조치)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  학과는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                  <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 보안프로그램 설치</li>
                  <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                </ul>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제8조 (개인정보 보호책임자)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  학과는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 
                  정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <p className="text-foreground font-medium">개인정보 보호책임자</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    부서명: 데이터지식서비스공학과<br />
                    연락처: 031-8005-2000<br />
                    이메일: grad@dankook.ac.kr
                  </p>
                </div>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                  제9조 (개인정보처리방침 변경)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다. 
                  이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.
                </p>

                <div className="border-t pt-6 mt-8">
                  <p className="text-sm text-muted-foreground">
                    시행일자: 2024년 1월 1일
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}