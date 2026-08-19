# Design QA — 단국대학교 대학원 홈페이지 누적 검증

- Reference sources:
  - 논문 목록 조회수 화면: `/workspace/scratch/8305753068ce/upload/7f9600d5-d682-4bec-9b4d-c76f479c4c91.png`
  - 헤더 AIMS Lab 위치: `/workspace/scratch/8305753068ce/upload/b4620ec0-472f-477d-8d9a-2c3dfef2b2f0.png`
  - 지도교수 연구관심분야 기존 3열 화면: `/workspace/scratch/8305753068ce/upload/c52a6034-bf57-496d-9cb8-bc18ae87745e.png`
  - 지도교수 연구관심분야 최종 카드 구조: `/workspace/scratch/8305753068ce/upload/3e20451f-9442-4036-a020-e9584447990c.png` (1290 × 592px)
  - 브라우저 탭 변경 전 화면: `/workspace/scratch/8305753068ce/upload/a8f3bff6-ecf4-4f7c-8986-99fed93e6230.png` (343 × 49px)
  - 메인 히어로 영문 표기: `/workspace/scratch/8305753068ce/upload/99cb2c6d-2715-4026-9776-7a71b87156cf.png`
  - 변경 전 운영 학과 내규: `https://dankook-graduate.onrender.com/regulations`
- Implementation: `/`, `/about`, `/regulations`, `/notices`, `/papers/conference`, `/papers/journal`
- Browser viewport: 1363 × 936 CSS pixels
- Primary state: 로그아웃 상태
- Latest implementation screenshot: `/workspace/scratch/8305753068ce/work/design_qa/about-interests-implementation.png` (1363 × 936px)

## Visual comparison

- 메인 히어로의 영문 표기를 `DATA SCIENCE`로 변경하고, 이전 `DATA KNOWLEDGE SERVICE ENGINEERING` 문구가 남지 않았음을 확인했다.
- 헤더 학과명 바로 아래에 `AIMS Lab(에임즈 랩) : AI, Innovation, Metaverse & Service Lab`이 표시되며 데스크톱 헤더 폭 안에 들어온다.
- 학과 소개 히어로 설명은 요청한 위치에서 명시적으로 줄바꿈되어 정확히 두 줄로 표시된다.
- 연구관심분야 10개는 데스크톱 상단 4열 2행으로 배치되고, 마지막 `CSCL`과 `MOOC`는 각각 2열을 차지하는 335px 대형 카드로 표시된다.
- 기준 이미지와 브라우저 구현 화면을 동일 비교 입력에서 확인했으며, 카드 순서·4열 구조·하단 2개 대형 카드·연한 청색 배경·둥근 모서리가 일치한다.
- 지도교수 소속 아래 AIMS Lab 문구가 표시되고, 학과 개요 문장은 요청한 `사회` 다음에 줄바꿈된다.
- 탭 제목은 `단국대학교 대학원 데이터지식서비스공학과`이며, 파비콘은 청색 DKU 심볼이 작은 탭에서도 식별되도록 확대했다.
- 변경 전 학과 내규의 장식용 이모지와 강한 그라데이션을 제거하고, 흰색 카드·절제된 선·`01`~`08` 번호 체계로 전문적인 대학원 문서 화면을 구성했다.
- 논문 카드의 연도 배지를 `조회수 N` 배지로 교체하고, 정보 전달에 필요한 선형 아이콘만 사용했다.
- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

## Content and interaction checks

- 메인 화면에서 `DATA SCIENCE`가 두 위치에 표시되고 이전 영문 표기는 0건임을 확인했다.
- 학과 개요는 `데이터 관리 및 분석 기술과 비즈니스 마인드를 기반으로 사회`와 `전 분야에 융합 적용이 가능한 미래 인재를 양성합니다.`의 정확한 두 줄로 표시된다.
- 연구관심분야는 요청한 10개 항목이 모두 표시되고 1363px 데스크톱 화면에서 `4·4·2` 배열로 계산된다.
- 375 × 844 CSS px 모바일 프레임에서 연구관심분야는 1열 285px로 전환되며 모든 항목이 뷰포트 안에 위치한다.
- 브라우저 콘솔에는 애플리케이션 오류가 없고 브라우저 확장 프로그램 메타데이터 오류만 1건 확인됐다.
- 학과 내규는 이모지 0건, 장 번호 8개, 가로 넘침 0건으로 확인했다.
- 학과 내규 개별 장 펼침과 `전체보기`를 실행해 제1조·제3조·제20조 본문이 표시되는 것을 확인했다.
- 공지사항과 논문 첨부파일 표시는 장식용 파일 이모지 대신 일관된 선형 파일 아이콘을 사용한다.
- 논문 제목 선택 시 조회수 증가 API를 호출한 다음 갱신된 상세 데이터를 표시하도록 연결했다.
- PostgreSQL 조회수 증가는 `views = views + 1` 원자 연산으로 변경해 동시 조회 시 증가값 유실을 방지했다.
- 모든 확인 페이지에서 의도하지 않은 가로 스크롤이 없다.
- 로컬 Vite 단독 미리보기에서는 백엔드 API가 연결되지 않아 논문 DB 목록이 비어 보이는 것이 정상이며, 배포 후 운영 DB에서 조회수 증가를 최종 확인한다.
- TypeScript 검사, 프로덕션 빌드 및 `git diff --check`를 통과했다.

## Latest comparison history

- 1차 비교: P0/P1/P2 불일치 없음. 기준 이미지의 카드 구조와 구현 화면이 동일한 정보 순서와 열 배치를 유지해 추가 수정 없이 통과했다.
- 타이포그래피: 기존 Noto Sans KR·시스템 산세리프와 제목/본문 위계를 유지했다.
- 공간과 레이아웃: 상단 카드는 4열, 마지막 2개 카드는 각 2열 폭과 124px 높이로 구현했다.
- 색상과 토큰: 기존 `blue-50`, `blue-100`, `slate-700` 토큰을 유지했다.
- 이미지 품질: 제공된 단국대학교 원본 로고에서 DKU 심볼을 추출해 512px RGBA 파비콘으로 생성했다.
- 문구: AIMS Lab, 학과 개요 2개 문장, 브라우저 탭 제목을 요청 문구와 일치시켰다.

## Final result

passed
