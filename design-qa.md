# Design QA — Galaxy Z Fold6 메인 히어로 줄바꿈·강조 개선

## Source truth

- 원본 화면: `/workspace/scratch/8a56fa0940b3/upload/f2fb0934-912f-460b-834d-f2f37ebddbb9.png`
- 구현 화면: `docs/screenshots/home-fold6-borderless-335.jpg`
- 비교 화면: Galaxy Z Fold6 사용자 캡처와 동일한 335×410px 히어로 영역
- 상태: 메인 화면 최초 표시, 애니메이션 완료 후 기본 상태
- 밀도 정규화: 원본과 구현 모두 335×410 픽셀로 맞춰 1:1 비교

## Full-view comparison evidence

- 원본에서는 `데이터로 지식을 만들고,`의 `고,`만 다음 줄로 떨어져 제목이 3줄이었고, 구현에서는 첫 문장을 한 줄로 고정해 제목이 의도한 2줄로 표시된다.
- 구현 제목은 335px 화면에서 32.495px, 자간 -1.787px로 계산되며 첫 줄 오른쪽 끝은 325.28px로 335px 화면 안에 들어온다.
- 문서 전체 `scrollWidth`와 `clientWidth`는 모두 335px로 가로 넘침이 없다.
- 원본의 흰색 박스와 금색 좌측 테두리를 제거하고, 흰색 `직장인을 위한`과 Accent `토요일 전일 수업`의 2단계 문자 위계로 변경했다.
- 학과 소개와 모집요강 버튼의 순서·너비·대비는 유지되며 335×410px 비교 영역 안에서 두 버튼이 모두 표시된다.

## Focused comparison evidence

- 제목 첫 행 DOM은 `데이터로 지식을 만들고,`, 둘째 행은 `미래를 설계합니다`로 분리되어 자연 줄바꿈에 영향을 받지 않는다.
- 제목은 320–639px에서 `clamp(31px, 9.7vw, 35px)`로 동작하고 640px 이상 기존 48–50.4px 반응형 크기를 유지한다.
- 안내 문구의 계산 스타일은 배경 투명, 테두리 0px, 본문 흰색, 핵심어 `#F4A000`, 핵심어 굵기 900이다.
- 중요한 변경 대상이 제목 줄바꿈과 안내 문구이므로 두 영역이 선명하게 보이는 동일 크기 전체 히어로 비교로 세부 판독이 가능해 별도 확대 크롭은 필요하지 않았다.

## Required fidelity surfaces

- Fonts and typography: 기존 Pretendard 계열과 제목 굵기 900을 유지했다. 좁은 화면에서만 유동 크기와 -0.055em 자간을 적용하고 첫 문장을 한 행으로 고정했다.
- Spacing and layout rhythm: 기존 좌우 20px 여백과 버튼 간격을 보존했다. 테두리형 배지를 제거해 제목과 CTA 사이의 시각적 흐름을 단순화했다.
- Colors and visual tokens: 흰색 본문, Navy 이미지 오버레이와 Accent `#F4A000`을 사용했다. 새 색상이나 테두리 토큰은 추가하지 않았다.
- Image quality and asset fidelity: 기존 단국대학교 캠퍼스 히어로 이미지를 변경·재압축하지 않았으며 크롭과 오버레이도 유지했다.
- Copy and content: `데이터로 지식을 만들고,`, `미래를 설계합니다`, `직장인을 위한 토요일 전일 수업`의 문구와 구두점을 화면·DOM에서 확인했다.

## Responsive and interaction QA

- 335px: 제목 32.495px, 첫 문장 한 줄, 둘째 문장 한 줄, 가로 넘침 0건.
- 320–639px: 31–35px 유동형 제목 규칙이 프로덕션 CSS에 포함된다.
- 640px 이상: `sm:text-5xl`, 1024px 이상: `lg:text-[3.15rem]`을 유지한다.
- `학과 소개 보기`는 `/about`, `모집요강 보기`는 `/admissions/guidelines`로 연결되고 두 링크 모두 화면에 표시된다.
- 애플리케이션 출처의 브라우저 console warning/error는 0건이다.

## Comparison history

- 1차 발견(P2): 335px 화면에서 `고,`가 단독 행으로 떨어져 제목 위계와 세로 공간이 불안정했다.
- 1차 발견(P2): 수업 안내의 흰색 표면·좌측 금색 테두리가 제목과 CTA 사이에서 별도 버튼처럼 보였다.
- 수정: 제목을 31–35px 유동 크기로 바꾸고 첫 문장을 `block whitespace-nowrap`으로 고정했다.
- 수정: 안내 문구의 배경·테두리·박스 그림자를 제거하고 흰색 본문과 Accent 핵심어, 텍스트 그림자만 적용했다.
- 재검증: 335×410px 동일 크기 비교에서 2줄 제목, 테두리 없는 안내, 가로 넘침 0건과 정상 CTA를 확인했다.

## Findings

- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

## Follow-up polish

- P3 제안: 실제 기기 글꼴 렌더러 차이가 확인될 경우 `9.7vw` 계수만 ±0.1vw 범위에서 미세 조정할 수 있다.

final result: passed