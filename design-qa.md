# Design QA — 학과 소개 지도교수 프로필

- Reference source: 사용자 제공 지도교수 카드 이미지와 `portrait_transparent(1).png`
- Implementation: `/about` 페이지의 `ADVISOR / 지도교수` 영역
- Browser viewport: 1363 × 936 CSS pixels
- Primary state: 로그아웃 상태의 학과 소개 페이지

## Visual comparison

- 참고 화면과 로컬 구현 화면을 한 화면 검수 입력에서 직접 비교했다.
- 참고 화면의 중앙 정렬 섹션 제목, 흰색 카드, 옅은 회색 배경, 파란색 강조색과 CTA 구조를 유지했다.
- 사용자의 배치 요청에 맞춰 기본 아이콘을 실제 교수 사진으로 교체하고, 데스크톱 카드를 사진 왼쪽·교수 정보 오른쪽의 2열 구조로 확장했다.
- 제공된 사진은 자르거나 왜곡하지 않고 원본 비율의 `object-contain`으로 표시했다.
- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

## Content and interaction checks

- 교수명 `서응교 교수`와 역할 `지도교수`가 정상 표시된다.
- 연구관심분야 `Artificial Intelligence`, `Metaverse`, `Smart City 등`이 요청 순서대로 표시된다.
- 이메일 주소는 `mailto:eungkyosuh@dankook.ac.kr` 링크로 연결된다.
- 사진 대체 텍스트는 `서응교 지도교수`로 제공된다.
- 사진은 210 × 196px 원본으로 완전히 로드되었고 잘못된 경로가 없다.
- 카드 너비 1024px, 높이 401px에서 정보가 잘리거나 겹치지 않으며 의도하지 않은 가로 스크롤이 없다.
- `md:grid-cols-[260px_minmax(0,1fr)]` 반응형 규칙을 적용해 모바일에서는 1열, 데스크톱에서는 2열로 전환된다.
- 애플리케이션 오류·경고는 없었다. Chrome 확장 프로그램의 진단 오류는 애플리케이션 오류에서 제외했다.

## Final result

passed
