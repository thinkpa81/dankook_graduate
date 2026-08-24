# Design QA — 학과소개 세로형 지도교수·컨택 카드

## Source truth

- 지도교수·연구분야 기준: `C:/Users/User/AppData/Local/Temp/codex-clipboard-40ea3e10-6c13-4c24-a1d6-c0f8326adb7b.png` (1383×895px)
- 박사과정 컨택 기준: `C:/Users/User/AppData/Local/Temp/codex-clipboard-31f96ef3-4a72-4dc3-8431-abf4b66017c0.png` (1945×1146px)
- 구현 캡처:
  - `docs/screenshots/about-stacked-top-1440.png`
  - `docs/screenshots/about-stacked-contact-1440.png`
  - `docs/screenshots/about-stacked-final-1440.png`
  - `docs/screenshots/about-stacked-final-375.png`
- 브라우저: Codex in-app browser, 1× CSS density
- 주 비교 상태: 로컬 Vite `/about`, 1440×2400 CSS viewport
- 보조 폭: 1024, 768, 375, 320 CSS px

## Full-view comparison

- 기준 이미지 1처럼 지도교수 영역을 한 개의 전체 폭 카드로 구성하고, 기준 이미지 2의 컨택 안내는 첫 카드 바로 아래의 독립 전체 폭 카드로 배치했다.
- 1440px에서 카드의 실제 폭은 1376px(`x=32`)이며 좌측 사진 패널은 336px, 우측 정보·연구 패널은 1038px이다. 기준 이미지의 카드 시작점 `x≈31`, 좌측 패널 `≈336px`, 사진 `210×196px`과 일치한다.
- 사진 패널에는 승인된 `/portrait_transparent.png`만 배치했다. 우측은 지도교수·교수명 → 소속·AIMS Lab → 구분선 → 연구관심분야 순서다.
- 연구카드는 4·4·2로 구성했고 긴 영문은 기준 이미지의 행 분리와 동일하게 줄바꿈했다. 마지막 CSCL·MOOC 카드는 각각 두 열을 차지한다.
- 컨택 카드는 사용자 확정 문구의 `박사과정 컨택`, 쉼표가 포함된 안내문, 1단계와 3단계, 제목·예시·내용·작성방식 및 두 기타 문의 문장을 그대로 사용한다. 2단계는 표시하지 않는다.

## Fidelity surfaces

- Typography: 기존 Pretendard 계열과 디자인 토큰의 `font-black`·`font-bold`·`leading-7` 위계를 사용해 기준의 교수명, 섹션명, 본문 대비를 유지했다.
- Spacing and layout: 카드 간격 24px, 데스크톱 좌측 336px, 우측 유동 폭, 사진 상단 여백 136px, 연구카드 12–16px 간격을 적용했다.
- Color and depth: 사진 패널 `#F3F8FF`, 연구카드 `blue-50`, 브랜드 파랑 `#2156D9`, 흰 패널·얕은 테두리·그림자를 기존 토큰으로 통일했다.
- Image quality: 원본 210×196 RGBA 초상 자산을 추가 크롭이나 CSS 테두리 없이 1:1 표시해 보라–분홍 원형 링을 보존했다.
- Copy and content: 교수 정보, 10개 연구분야, 4개 `mailto:` 링크, 1단계→3단계 번호 건너뜀을 DOM과 화면에서 확인했다.

## Responsive and interaction QA

- 1440px: 카드 1376px, 사진 패널 336px, 연구 `4·4·2`, 컨택 카드 동일 폭, `scrollWidth=clientWidth=1440`.
- 1024px: 사진 패널 280px, 연구 `4·4·2`, 컨택 아래 배치, 가로 넘침 없음.
- 768px: 사진 패널 240px, 연구 2열, 컨택 아래 배치, 가로 넘침 없음.
- 375px: 사진 → 교수 정보·연구 1열 → 컨택 순서, 카드 343px, 이메일 링크 잘림 0건, `scrollWidth=clientWidth=375`.
- 320px: 연구와 긴 이메일이 카드 안에서 줄바꿈되며 `scrollWidth<=clientWidth`.
- 교수 수신 메일, 교수 전송 링크(subject 포함), 두 기타 문의 메일을 모두 실제 `mailto:`로 확인했다. 모든 링크에는 가시적 포커스 상태를, 번호형 전송 링크에는 44px 이상 세로 조작 영역을 유지했다.
- 브라우저 화면에서 콘솔 오류·경고가 없고 제목 구조, `서응교 지도교수` 대체텍스트, 장식 아이콘의 접근성 처리를 확인했다.

## Comparison history

- 1차: 이전 배포의 교수·연구 2/3 + 컨택 1/3 가로 배치는 새 기준과 달랐다.
- 2차: 컨택을 첫 카드 아래로 이동하고 카드 폭을 기존 1200px에서 최대 1440px 래퍼로 확장했다.
- 3차: 기준 이미지 실측에 맞춰 좌측 패널을 336px, 사진을 210×196px로 고정하고 우측 연구카드를 4·4·2로 재구성했다.
- 최종: 사용자 확정 문구로 2단계를 제거하고 1단계→3단계를 유지했으며, 기준 이미지와 최종 1440px 캡처를 같은 비교 입력에서 재검토했다.

- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

final result: passed
