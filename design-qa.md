# Design QA — 지도교수·박사과정 컨택·모집요강 최종 보완

- Reference sources:
  - 지도교수·사전 컨택: `C:/Users/User/AppData/Local/Temp/codex-clipboard-97177b53-4b01-43a8-b079-8008fef301b8.png`
  - 모집요강 게시판: `C:/Users/User/AppData/Local/Temp/codex-clipboard-7a72c81b-e111-4af8-b874-59c308407725.png`
- Implementation screenshots:
  - `docs/screenshots/about-advisor-final-1440.png`
  - `docs/screenshots/about-advisor-final-375.png`
  - `docs/screenshots/admissions-final-1440.png`
  - `docs/screenshots/admissions-final-375.png`
- Browser: Codex in-app browser, 1× CSS density
- Primary comparison viewport/state: 1440×1000, logged out, local Vite preview data
- Secondary viewports: 1024×1000, 768×1000, 375×1000, 320×1000

## Visual comparison

- 지도교수 기준 이미지와 구현 캡처를 같은 비교 입력에서 확인했다. 교수명·원형 초상·소속·AIMS Lab·이메일이 276px 청색 프로필 열에 모이고, 우측에는 연구관심분야와 컨택 안내만 남는다.
- 제공된 초상 자산의 보라–분홍 원형 테두리를 그대로 사용해 중복 테두리나 대체 이미지를 만들지 않았다.
- 연구카드 순서와 데스크톱 `4·4·2` 배열, 마지막 CSCL/MOOC 광폭 카드, 연한 청색 표면과 기존 산세리프 위계가 기준 의도를 유지한다.
- 컨택 영역은 개인정보 입력 폼을 제거하고 1–3단계 이메일 안내 문서로 바꿨다. 확정 문구의 콜론·쉼표·괄호·`예시:`·`※` 표기까지 DOM에서 일치한다.
- 모집요강 기준 이미지와 구현 캡처를 같은 비교 입력에서 확인했다. 230px 좌측 메뉴, 본문 제목·검색·최신순 목록·우측 첨부 버튼 구조를 기존 청색 디자인 시스템으로 재현했다.
- 모바일은 검색 범위·검색어·검색 버튼을 전체 폭으로 적층하며, 메타정보 구분선은 다음 줄 첫 문자로 고립되지 않는다.

## Responsive measurements

- 1440px: 지도교수 `276px + 874.667px`, 연구 4열, 모집요강 검색 672px, 첨부 버튼 44×44px, 가로 넘침 없음.
- 1024px: 지도교수 `276px + 699.333px`, 연구 4열, 230px 모집요강 메뉴, 가로 넘침 없음.
- 768px: 지도교수 프로필/연구영역 세로 배치, 연구 2열, 모집요강 메뉴/본문 세로 배치, 가로 넘침 없음.
- 375px: 지도교수→연구 1열→컨택 안내, 검색 328px 전체 폭, 이메일·긴 제목 정상 줄바꿈, 가로 넘침 없음.
- 320px: 연구 1열 223.333px, 검색 273px 전체 폭, `scrollWidth <= clientWidth`, 가로 넘침 없음.

## Content, interaction, and accessibility

- 연구관심분야 10개, 교수·랩실 이메일 5개 `mailto:`, `서응교 지도교수` 대체텍스트, h2→h3→h4 제목 계층을 확인했다.
- 컨택 카드 안의 `form`, `input`, `textarea`, `select`, 파일 입력은 0건이다.
- 모집요강 범위는 전체·제목·내용·게시기관의 실제 `<select>`이며 검색은 실제 submit 버튼과 Enter로 실행된다.
- 제목 범위의 앞뒤 공백 검색, 게시기관 버튼 검색, 검색 결과 없음 상태와 `aria-live` 단일 결과 알림을 확인했다.
- 목록 날짜는 `2026-06-16 → 2026-05-08 → 2026-04-01`로 최신순이고 비관리자 등록·수정·삭제 버튼은 0건이다.
- 첨부 버튼은 모든 확인 폭에서 최소 44×44px이고, 긴 제목·기관명·상세본문·첨부명에는 안전한 줄바꿈을 적용했다.
- `/admin` 로그아웃 화면과 로그인 모달을 1440/375px에서 확인했다. 아이디·password 입력, submit 버튼, 회원가입 없음 안내와 가로 넘침 없음이 정상이다.
- 브라우저 콘솔 error 로그는 0건이다.

## Comparison history

- 1차: 768px에서 지도교수 2열 유지, 375/320px 가로 넘침, 장식형 모집요강 검색을 발견했다.
- 2차: `lg` 프로필 전환, 연구 `md/lg` 그리드, 실제 검색 form/select/button, 이메일 줄바꿈으로 수정했다.
- 3차: 확정 문구의 콜론·`예시:` 누락, 중복 live region, 모바일 메타 구분선과 긴 상세 데이터 줄바꿈을 보완했다.
- 최종: 기준/구현 동시 비교, 5개 폭 수치 검사, 키보드 검색, 로그인 모달 및 콘솔 검사를 다시 통과했다.

- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

final result: passed
