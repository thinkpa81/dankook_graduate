# Design QA — 공개 편집·학과소개 좌우 패널

## Source truth

- 교수·연구분야 기준: `C:/Users/User/AppData/Local/Temp/codex-clipboard-284752db-c9ab-4ba8-a5ff-ab200203640b.png` (945×575px)
- 박사과정 컨택 기준: `C:/Users/User/AppData/Local/Temp/codex-clipboard-e68a3496-c665-4cfa-bac0-a84297b201d3.png` (1945×1146px)
- 구현 캡처:
  - `docs/screenshots/about-public-edit-1440.png`
  - `docs/screenshots/about-public-edit-768.png`
  - `docs/screenshots/about-public-edit-375.png`
  - `docs/screenshots/about-contact-375.png`
  - `docs/screenshots/notices-public-add-1440.png`
- 브라우저: Codex in-app browser, 1× CSS density
- 주 비교 상태: 1440×1000 CSS viewport, 비로그인, 실제 Express 라우트 + 메모리 저장소 로컬 QA 서버
- 보조 폭: 1024×900, 768×900, 375×812, 320×760

## Full-view comparison

- 제공된 두 이미지를 왼쪽 교수·연구 패널과 오른쪽 박사과정 컨택 패널로 해석해 1200px 컨테이너 안에 독립 패널로 배치했다.
- 1440px에서 사용 가능한 1176px을 `784px + 24px gap + 392px`로 나눠 왼쪽이 정확히 2/3, 오른쪽이 1/3이다. 왼쪽 패널을 컨택 높이까지 강제로 늘리지 않아 기준 이미지처럼 교수·연구 영역은 자체 높이에서 끝난다.
- 왼쪽은 지도교수·교수명 → 원형 초상 → 소속·AIMS Lab 순서와 연구카드 `4·4·2`를 유지한다. 제공된 보라–분홍 테두리 초상 자산을 그대로 사용했다.
- 오른쪽은 영어 kicker, `박사과정 합류 전 사전 컨택`, 최신 안내문, 1–3단계, 교수·랩실 이메일과 CTA를 유지한다. 모든 이메일은 실제 `mailto:`이며 긴 주소가 패널 안에서 줄바꿈된다.

## Focused responsive comparison

- 1440px: 왼쪽 784px / 오른쪽 392px, 연구카드 `4·4·2`, 가로 넘침 없음.
- 1024px: 왼쪽 633px / 오른쪽 320px. 왼쪽 연구영역이 좁아지는 구간은 2열로 전환해 긴 `Computer-mediated communication` 항목을 포함한 10개 카드의 내부 overflow가 0건이다.
- 768px: 교수 프로필 240px + 연구 479px 내부 2열, 컨택 패널은 전체 폭 아래에 배치된다.
- 375px: 교수 → 연구 1열 → 컨택 순서이며 `clientWidth=scrollWidth=360`이다.
- 320px: 프로필·컨택 273px, 연구카드 223px, `clientWidth=scrollWidth=305`로 가로 스크롤이 없다.

## Content, interaction, and accessibility

- 헤더·모바일 메뉴에 관리자 로그인·로그아웃·관리자 메뉴가 없고 `/admin`은 `/admissions/guidelines`로 이동한다.
- 공지·논문·모집요강의 등록 모달이 비로그인 상태에서 열리고, 실제 로컬 서버에서 세 메뉴 모두 생성과 수정을 완료했다. 삭제 버튼은 확인 대화상자까지 비파괴로 확인했고, 실제 DELETE는 Express HTTP 통합 테스트의 격리된 메모리 데이터로 검증했다.
- 논문 사이트 주소는 선택 입력이며 빈 값으로도 등록·수정된다.
- 논문 화면의 `댓글 (`과 `로그인 후 댓글 작성`은 0건이며 논문 댓글 쓰기 API 세 종류는 410을 반환한다.
- 실제 HTTP 통합 검사는 공지·논문·모집요강 POST 201, PATCH 200, DELETE 200, 잘못된 Origin 403을 확인했다.
- 제목 구조는 h2 → h3 → h4, 초상 대체텍스트는 `서응교 지도교수`, 이메일과 조작 버튼에는 가시적 포커스가 있다. 14px 예시문은 AA 대비를 확보하도록 `text-slate-600`을 사용한다.
- 실제 로컬 QA 서버(5010) 범위 브라우저 warning/error 로그는 0건이다.

## Comparison history

- 1차: 두 기준을 한 카드의 같은 행에 넣어 오른쪽 컨택 높이 때문에 왼쪽 아래에 큰 빈 패널이 생겼다.
- 2차: 2/3·1/3 비율은 유지하면서 독립 패널로 분리해 왼쪽 기준 이미지의 자체 높이와 오른쪽 긴 안내 흐름을 각각 보존했다.
- 3차: 1024px 왼쪽 연구영역의 4열에서 긴 영문이 잘리는 것을 확인하고, 1024–1279px만 2열로 조정했다.
- 최종: 기준 이미지 2개와 1440px 구현 캡처를 같은 비교 입력에서 재확인하고, 1024·768·375·320px 수치·overflow·메일 링크·공개 편집 UI와 실제 HTTP 흐름을 다시 통과했다.

- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

final result: passed
