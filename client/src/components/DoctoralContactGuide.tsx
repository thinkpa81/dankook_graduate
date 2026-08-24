const professorEmail = "eungkyosuh@dankook.ac.kr";
const inquirySubject = encodeURIComponent("[박사과정 지원 문의] 본인 이름_지원 희망 연도/학기");

export default function DoctoralContactGuide() {
  return (
    <section
      className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8 lg:p-10 xl:p-12"
      aria-labelledby="doctoral-contact-heading"
      data-testid="doctoral-contact-guide"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold tracking-[0.08em] text-[#2156D9]">DOCTORAL PROGRAM CONTACT</p>
        <h3 id="doctoral-contact-heading" className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 xl:text-3xl">
          박사과정 컨택
        </h3>
        <p className="mt-4 text-[15px] leading-7 text-slate-600">
          지원에 앞서, 아래의 간단한 양식에 맞춰 지도교수님께 이메일로 먼저 문의해 주시기 바랍니다.
        </p>

        <ol className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          <li value={1} className="min-w-0 py-7">
            <div>
              <span className="text-xs font-bold tracking-[0.12em] text-[#2156D9]">1단계:</span>{" "}
              <h4 className="mt-1 text-lg font-extrabold text-slate-900">이메일 문의</h4>
            </div>
            <div className="mt-5 min-w-0 space-y-4 text-[15px] leading-7 text-slate-700">
              <p className="[overflow-wrap:anywhere]">
                <span className="mr-3 font-bold text-slate-900">수신:</span>{" "}
                서응교 교수 (
                <a
                  href={`mailto:${professorEmail}`}
                  className="font-bold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]"
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
                <span className="font-bold text-slate-900">내용:</span>
              </p>
              <p>
                <strong className="font-bold text-slate-900">자기소개 및 관심 연구 분야</strong>{" "}
                (어떤 프로젝트에 관심이 있는지 A4 1장 내외로 간략히 작성)
              </p>
              <p className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
                ※ 작성방식: 이메일 본문에 직접 작성하거나 PDF 파일(자유양식)로 첨부
              </p>
              <ol className="list-decimal pl-5">
                <li>
                  <a
                    href={`mailto:${professorEmail}?subject=${inquirySubject}`}
                    className="inline-block min-h-11 py-2 font-bold text-[#2156D9] underline underline-offset-4 [overflow-wrap:anywhere] hover:text-[#1848bc] focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]"
                  >
                    지도교수에게 이메일 보내기
                  </a>
                </li>
              </ol>
            </div>
          </li>

          <li value={3} className="min-w-0 py-7">
            <div>
              <span className="text-xs font-bold tracking-[0.12em] text-[#2156D9]">3단계:</span>{" "}
              <h4 className="mt-1 text-lg font-extrabold text-slate-900">기타 문의</h4>
            </div>
            <ol className="mt-5 min-w-0 list-decimal space-y-3 pl-5 text-[15px] leading-7 text-slate-700">
              <li>보내주신 내용을 검토한 후 개별적으로 면담 일정을 회신해 드립니다.</li>
              <li className="[overflow-wrap:anywhere]">
                기타 문의는 이메일(
                <a href="mailto:yubinlove@hotmail.com" className="font-bold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]">
                  yubinlove@hotmail.com
                </a>
                {" "}또는{" "}
                <a href="mailto:thinkpa@naver.com" className="font-bold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]">
                  thinkpa@naver.com
                </a>
                )로 편하게 연락해 주시기 바랍니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </section>
  );
}
