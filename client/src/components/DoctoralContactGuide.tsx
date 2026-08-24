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
        <p className="text-base font-bold tracking-[0.08em] text-[#2156D9]">DOCTORAL PROGRAM CONTACT</p>
        <h3 id="doctoral-contact-heading" className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
          박사과정 컨택
        </h3>
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          지원에 앞서, 아래의 간단한 양식에 맞춰 지도교수님께 이메일로 먼저 문의해 주시기 바랍니다.
        </p>

        <div className="mt-8 border-y border-slate-200">
          <section className="min-w-0 py-8" aria-labelledby="doctoral-email-heading">
            <h4 id="doctoral-email-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">이메일 문의</h4>
            <div className="mt-6 min-w-0 space-y-5 text-base leading-8 text-slate-700 sm:text-lg">
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
                <p className="mt-1 text-base text-slate-600">예시: [박사과정 지원 문의] 홍길동_2027년 전기</p>
              </div>
              <p>
                <span className="font-bold text-slate-900">내용:</span>
              </p>
              <p>
                <strong className="font-bold text-slate-900">자기소개 및 관심 연구 분야</strong>{" "}
                (어떤 프로젝트에 관심이 있는지 A4 1장 내외로 간략히 작성)
              </p>
              <p className="rounded-md bg-slate-50 px-4 py-3 text-base leading-7 text-slate-600">
                ※ 작성방식: 이메일 본문에 직접 작성하거나 PDF 파일(자유양식)로 첨부
              </p>
              <p>보내주신 내용을 검토한 후 개별적으로 면담 일정을 회신해 드립니다.</p>
              <a
                href={`mailto:${professorEmail}?subject=${inquirySubject}`}
                className="inline-flex min-h-11 items-center py-2 font-bold text-[#2156D9] underline underline-offset-4 [overflow-wrap:anywhere] hover:text-[#1848bc] focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]"
              >
                지도교수에게 이메일 보내기
              </a>
            </div>
          </section>

          <section className="min-w-0 border-t border-slate-200 py-8" aria-labelledby="doctoral-other-heading">
            <h4 id="doctoral-other-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">기타 문의</h4>
            <p className="mt-6 min-w-0 text-base leading-8 text-slate-700 [overflow-wrap:anywhere] sm:text-lg">
              이메일(
              <a href="mailto:yubinlove@hotmail.com" className="font-bold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]">
                yubinlove@hotmail.com
              </a>
              {" "}또는{" "}
              <a href="mailto:thinkpa@naver.com" className="font-bold text-[#2156D9] underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2156D9]">
                thinkpa@naver.com
              </a>
              )로 편하게 문의 주시기 바랍니다.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
