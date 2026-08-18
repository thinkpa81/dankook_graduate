# Design QA — 대학원 홈페이지 전문성 및 조회수 개편

- Reference sources:
  - 논문 목록 조회수 화면: `/workspace/scratch/8305753068ce/upload/7f9600d5-d682-4bec-9b4d-c76f479c4c91.png`
  - 헤더 AIMS Lab 위치: `/workspace/scratch/8305753068ce/upload/b4620ec0-472f-477d-8d9a-2c3dfef2b2f0.png`
  - 지도교수 연구관심분야 기존 3열 화면: `/workspace/scratch/8305753068ce/upload/c52a6034-bf57-496d-9cb8-bc18ae87745e.png`
  - 메인 히어로 영문 표기: `/workspace/scratch/8305753068ce/upload/99cb2c6d-2715-4026-9776-7a71b87156cf.png`
  - 변경 전 운영 학과 내규: `https://dankook-graduate.onrender.com/regulations`
- Implementation: `/`, `/about`, `/regulations`, `/notices`, `/papers/conference`, `/papers/journal`
- Browser viewport: 1363 × 936 CSS pixels
- Primary state: 로그아웃 상태

## Visual comparison

- 메인 히어로의 영문 표기를 `DATA SCIENCE`로 변경하고, 이전 `DATA KNOWLEDGE SERVICE ENGINEERING` 문구가 남지 않았음을 확인했다.
- 헤더 학과명 바로 아래에 `AIMS Lab(에임즈 랩) : AI, Innovation, Metaverse & Service Lab`이 표시되며 데스크톱 헤더 폭 안에 들어온다.
- 학과 소개 히어로 설명은 요청한 위치에서 명시적으로 줄바꿈되어 정확히 두 줄로 표시된다.
- 연구관심분야 10개는 데스크톱에서 요청한 4열(각 열 약 161.5px)로 배치되고 긴 항목도 카드 내부에서 자연스럽게 줄바꿈된다.
- 변경 전 학과 내규의 장식용 이모지와 강한 그라데이션을 제거하고, 흰색 카드·절제된 선·`01`~`08` 번호 체계로 전문적인 대학원 문서 화면을 구성했다.
- 논문 카드의 연도 배지를 `조회수 N` 배지로 교체하고, 정보 전달에 필요한 선형 아이콘만 사용했다.
- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

## Content and interaction checks

- 메인 화면에서 `DATA SCIENCE`가 두 위치에 표시되고 이전 영문 표기는 0건임을 확인했다.
- 학과 소개 설명은 `전문 인재를` 다음에 줄바꿈되고 다음 줄에 `양성합니다.`가 표시된다.
- 연구관심분야는 요청한 10개 항목이 모두 표시되고 1363px 데스크톱 화면에서 CSS `grid-template-columns`가 4개 열로 계산된다.
- 학과 내규는 이모지 0건, 장 번호 8개, 가로 넘침 0건으로 확인했다.
- 학과 내규 개별 장 펼침과 `전체보기`를 실행해 제1조·제3조·제20조 본문이 표시되는 것을 확인했다.
- 공지사항과 논문 첨부파일 표시는 장식용 파일 이모지 대신 일관된 선형 파일 아이콘을 사용한다.
- 논문 제목 선택 시 조회수 증가 API를 호출한 다음 갱신된 상세 데이터를 표시하도록 연결했다.
- PostgreSQL 조회수 증가는 `views = views + 1` 원자 연산으로 변경해 동시 조회 시 증가값 유실을 방지했다.
- 모든 확인 페이지에서 의도하지 않은 가로 스크롤이 없다.
- 로컬 Vite 단독 미리보기에서는 백엔드 API가 연결되지 않아 논문 DB 목록이 비어 보이는 것이 정상이며, 배포 후 운영 DB에서 조회수 증가를 최종 확인한다.
- TypeScript 검사, 프로덕션 빌드 및 `git diff --check`를 통과했다.

## Final result

passed
