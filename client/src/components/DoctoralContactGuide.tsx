import { Mail, Paperclip } from "lucide-react";

const professorEmail = "eungkyosuh@dankook.ac.kr";
const inquirySubject = encodeURIComponent("[박사과정 지원 문의] 본인 이름_지원 희망 연도/학기");

export default function DoctoralContactGuide() {
  return (
    <section
      className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8 lg:p-7 xl:p-8"
      aria-labelledby="doctoral-contact-heading"
      data-testid="doctoral-contact-guide"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold tracking-[0.08em] text-[#2156D9]">DOCTORAL PROGRAM CONTACT</p>
        <h3 id="doctoral-contact-heading" className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 xl:text-3xl">
          박사과정 합류 전 사전 컨택
        </h3>
        <p className="mt-4 text-[15px] leading-7 text-slate-600">
          지원에 앞서 아래의 간단한 양식에 맞춰 지도교수님께 이메일로 먼저 문의해 주시기 바랍니다.
        </p>

        <ol className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          <li className="min-w-0 py-6">
            <div>
              <span className="text-xs font-bold tracking-[0.12em] text-[#2156D9]">1단계:</span>{" "}
              <h4 className="mt-1 text-lg font-extrabold text-slate-900">이메일 문의하기</h4>
            </div>
            <div className="mt-4 min-w-0 space-y-4 text-[15px] leading-7 text-slate-700">
              <p className="[overflow-wrap:anywhere]">
                <span className="mr-3 font-bold text-slate-900">수신:</span>{" "}
                서응교 교수 (
                <a
                  href={`mailto:${professorEmail}`}
                  className="font-semibold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]"
                >
                  {professorEmail}
                </a>
                )
              </p>
              <div className="min-w-0 rounded-md border border-blue-100 bg-blue-50/70 px-4 py-3 [overflow-wrap:anywhere]">
                <p>
                  <span className="mr-3 font-bold text-slate-900">제목:</span>{" "}
                  [박사과정 지원 문의] 본인 이름_지원 희망 연도/학기
                </p>
                <p className="mt-1 text-sm text-slate-600">예시: [박사과정 지원 문의] 홍길동_2027년 전기</p>
              </div>
              <p>
                <span className="mr-3 font-bold text-slate-900">내용:</span>{" "}
                간단한 인사 및 면담 희망 일정 제안
              </p>
              <a
                href={`mailto:${professorEmail}?subject=${inquirySubject}`}
                className="inline-flex min-h-11 w-full max-w-full items-center justify-center gap-2 rounded-md bg-[#2156D9] px-5 py-2.5 text-center font-bold text-white transition-colors hover:bg-[#1848bc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2156D9] sm:w-auto"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                지도교수에게 이메일 보내기
              </a>
            </div>
          </li>

          <li className="min-w-0 py-6">
            <div>
              <span className="text-xs font-bold tracking-[0.12em] text-[#2156D9]">2단계:</span>{" "}
              <h4 className="mt-1 text-lg font-extrabold text-slate-900">필수 첨부 서류 (간소화)</h4>
            </div>
            <div className="mt-4 min-w-0 text-[15px] leading-7 text-slate-700">
              <ul className="space-y-3" aria-label="필수 첨부 서류 목록">
                <li className="flex items-start gap-3">
                  <Paperclip className="mt-1.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <p><strong className="font-bold text-slate-900">이력서 (CV)</strong>: 자유 양식</p>
                </li>
                <li className="flex items-start gap-3">
                  <Paperclip className="mt-1.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <p>
                    <strong className="font-bold text-slate-900">자기소개 및 관심 연구 분야</strong>: 본 연구실의 어떤 프로젝트에
                    관심이 있는지 A4 1장 내외로 간략히 작성 (이메일 본문에 직접 작성하거나 PDF 파일로 첨부)
                  </p>
                </li>
              </ul>
              <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
                ※ 성적증명서, 포트폴리오 등 상세 서류는 1차 면담 이후 필요시 별도로 요청드립니다.
              </p>
            </div>
          </li>

          <li className="min-w-0 py-6">
            <div>
              <span className="text-xs font-bold tracking-[0.12em] text-[#2156D9]">3단계:</span>{" "}
              <h4 className="mt-1 text-lg font-extrabold text-slate-900">행정 및 기타 문의</h4>
            </div>
            <div className="mt-4 min-w-0 space-y-3 text-[15px] leading-7 text-slate-700">
              <p>보내주신 내용을 검토한 후 개별적으로 면담 일정을 회신해 드립니다.</p>
              <p className="[overflow-wrap:anywhere]">
                관련 문의는 랩실 대표 이메일(
                <a href="mailto:yubinlove@hotmail.com" className="font-semibold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]">
                  yubinlove@hotmail.com
                </a>
                {" "}또는{" "}
                <a href="mailto:thinkpa@naver.com" className="font-semibold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]">
                  thinkpa@naver.com
                </a>
                )로 편하게 연락해 주시기 바랍니다.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
