# Design QA — 학과소개 여백 축소·컨택 타이포 확대

## Source truth

- 지도교수·연구분야 기준: `C:/Users/User/AppData/Local/Temp/codex-clipboard-659e85cf-a557-4371-a1a6-fcc9ddada1ae.png` (1622×993px)
- 컨택 콘텐츠 기준: 사용자 확정 문구(단계·목록 번호 없는 이메일 문의·기타 문의 구조)
- 구현 캡처:
  - `docs/screenshots/about-tightened-top-1440.png`
  - `docs/screenshots/about-contact-large-type-1440.png`
  - `docs/screenshots/about-contact-large-type-375.png`
- 브라우저: Codex in-app browser, 1× CSS density
- 주 비교 상태: 로컬 Vite `/about`, 1440×2400 CSS viewport, 기본 상태
- 보조 폭: 1024, 768, 375, 320 CSS px

## Full-view comparison evidence

- 기준 이미지와 구현의 왼쪽 336px 사진 패널, 오른쪽 교수 정보·연구카드 `4·4·2`, 210×196px 초상과 콘텐츠 정렬을 함께 열어 비교했다.
- 데스크톱 상단 카드 높이는 기존 842px에서 754px로 88px 줄었다. `xl:min-height` 강제를 제거해 마지막 구분선 아래의 과도한 공백만 줄이고 사진 위치·패널 비율·연구카드 크기는 유지했다.
- 카드 너비는 1360.7px(`x=32`), 좌우 열은 `336px + 1023.3px`이며 `scrollWidth=clientWidth=1425`로 가로 넘침이 없다.
- 상단 카드 직후 24px 간격으로 같은 폭의 컨택 카드가 이어지는 세로 구조를 유지했다.

## Focused contact comparison evidence

- 데스크톱 컨택 카드에서 영어 머리말 16px, 제목 36px, 소제목 24px, 안내·주요 본문 18px, 예시·작성방식 16px을 실측했다. 모바일은 제목 30px, 소제목 20px, 본문 16px로 축소된다.
- `1단계`, `3단계`와 모든 숫자 목록 표시는 0건이다. 이메일 문의에는 수신 → 제목·예시 → 내용 → 연구분야 → 작성방식 → 회신 안내 → 전송 링크 순서를 적용했다.
- 기타 문의는 확정된 한 문장만 표시한다. 교수 수신 링크, subject가 포함된 교수 전송 링크, 기타 문의 이메일 2개 등 `mailto:` 4개를 확인했다.
- 375px 상세 캡처에서 모든 이메일·제목·본문이 카드 안에서 줄바꿈되며 링크 잘림 0건이다.

## Required fidelity surfaces

- Fonts and typography: 기존 Pretendard 계열과 굵기 토큰을 유지하면서 컨택 위계를 한 단계 확대했다. 데스크톱 16–36px, 모바일 16–30px 범위로 가독성과 반응형 밀도를 함께 확보했다.
- Spacing and layout rhythm: 상단 카드의 강제 최소 높이만 제거해 하단 공백을 88px 줄였다. 카드 간 24px, 컨택 섹션 32px 수직 패딩과 기존 반경·그림자를 유지했다.
- Colors and tokens: 브랜드 파랑 `#2156D9`, 사진 패널 `#F3F8FF`, 연구카드 `blue-50`, 흰 카드와 slate 경계선을 기존 디자인 토큰 그대로 사용했다.
- Image quality: 승인된 210×196 RGBA 초상 자산을 크롭·추가 테두리 없이 표시해 보라–분홍 링과 선명도를 보존했다.
- Copy and content: 사용자 확정 문구, 구두점, 밑줄 문자, 회신 안내 위치, `문의 주시기 바랍니다` 표현과 굵은 이메일을 화면·DOM에서 확인했다.

## Responsive and interaction QA

- 1024px: 상단 카드 764px, 연구카드 4열, 컨택 제목 36px·본문 18px, 가로 넘침 없음.
- 768px: 사진 240px·연구 2열, 컨택 제목 36px·본문 18px, 가로 넘침 없음.
- 375px: 사진 → 교수 정보·연구 1열 → 컨택 순서, 컨택 328px 폭, 링크 잘림 0건, `scrollWidth=clientWidth=360`.
- 320px: 컨택 272.7px 폭, 제목 30px·본문 16px, 링크 잘림 0건, `scrollWidth=clientWidth=305`.
- 네 개의 이메일 링크는 실제 `mailto:`이고 전송 링크에는 subject가 유지된다. 모든 링크에 가시적 포커스 스타일이 있다.
- 브라우저 콘솔 warning/error는 0건이다.

## Comparison history

- 1차 발견: 데스크톱 상단 카드의 840px 강제 최소 높이로 연구카드 아래 공백이 과했고, 컨택은 14–15px 중심의 작은 본문과 단계·목록 번호를 사용했다.
- 수정: 강제 최소 높이를 제거하고, 컨택의 단계·목록 구조를 두 소제목 구조로 바꿨다. 회신 안내를 이메일 문의 안으로 이동하고 모든 타이포 계층을 확대했다.
- 재검증: 상단 카드 높이가 88px 줄고, 1440·1024·768·375·320px에서 정확 문구·4개 mailto·무오버플로와 콘솔 오류 0건을 확인했다.

- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

final result: passed
