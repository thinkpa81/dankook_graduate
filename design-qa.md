# Design QA — 학과 소개 및 논문 관리 개편

- Reference sources:
  - 지도교수 카드: `upload/c59adf96-a3dc-424d-89cc-c165894ed6f7.png`
  - 학과·전공·교과과정: `upload/0c60e4d5-98cf-4bf3-92a5-7f9b38c381d8.png`
  - 논문 분류 화면: `upload/78261f7c-b793-4afd-aa40-1cf2c3d6191c.png`
  - 논문 등록 화면: `upload/4b717499-b98f-443f-85f3-1b16e340b725.png`
- Implementation: `/about`, `/papers/conference`, `/papers/journal`
- Browser viewport: 1363 × 936 CSS pixels
- Primary state: 로그아웃 상태

## Visual comparison

- 참고 화면과 로컬 구현 화면을 동일 검수 입력에서 직접 비교했다.
- 학과 소개 히어로 바로 아래에 `ADVISOR / 지도교수` 섹션을 배치하고, 기존 학과 개요·전공 소개·교과과정이 이어지도록 순서를 확인했다.
- 지도교수 카드는 제공된 사진을 왼쪽, 교수 정보와 연구관심분야를 오른쪽에 배치했다. 사진은 원본 비율의 `object-contain`으로 표시한다.
- 연구관심분야가 길어져도 데스크톱 3열·태블릿 2열·모바일 1열로 재배치되며 텍스트가 잘리지 않는다.
- 논문 페이지는 두 개의 동일 비중 탭과 기존 카드 스타일을 유지해 정보 구조만 간결하게 변경했다.
- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

## Content and interaction checks

- 지도교수 섹션의 문서상 위치(약 605px)가 학과 개요(약 1524px)보다 앞에 있음을 확인했다.
- 교수명 `서응교 교수`, 역할 `지도교수`, 소속, 이메일 링크와 사진 대체 텍스트가 정상 표시된다.
- 다음 10개 연구관심분야가 요청 순서대로 모두 표시된다: `Artificial Intelligence`, `Metaverse`, `Smart City`, `M&A, PMI`, `Interface design for e-business`, `Computer-mediated communication`, `IT management`, `Design thinking`, `CSCL (Computer Supported Collaborative Learning)`, `MOOC`.
- 논문 탭은 `학술대회`, `저널` 두 개만 표시되고 기존 5개 분류명은 노출되지 않는다.
- 기존 데이터는 값에 `journal`이 포함되면 저널, 나머지는 학술대회로 정규화되어 DB 마이그레이션 없이 보존된다.
- 기존 상세 경로(`/papers/international-journal` 등)에서도 올바른 새 탭이 활성화된다.
- 등록 대화상자의 입력 필드는 `논문 제목`, `저자`, `사이트 주소` 세 개뿐이다.
- 빈 제목 등록 시 검증 메시지가 표시되고, 사이트 주소는 HTTP/HTTPS 형식만 허용한다.
- 새 레코드에 필요한 연도·날짜·조회수 등 서버 필드는 UI에 노출하지 않고 시스템 값으로 보완한다.
- 편집 시에도 동일한 세 필드만 노출하며 기존 첨부파일·세부 메타데이터는 삭제하지 않는다.
- 두 페이지 모두 의도하지 않은 가로 스크롤, 콘텐츠 겹침, 잘림이 없다.
- TypeScript 검사, 프로덕션 빌드, 스키마 등록 payload 검증을 통과했다.
- 로컬 Vite 단독 미리보기에서는 백엔드 API가 연결되지 않아 목록 데이터가 비어 보이는 것이 정상이며, 배포 환경에서 기존 DB 목록을 다시 확인한다.

## Final result

passed
