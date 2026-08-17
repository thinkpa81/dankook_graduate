# Design QA — 내부 페이지 배경 이미지

- Reference source: 사용자가 2026-08-18에 최종 첨부한 이미지 5장
- Implementation: `/about`, `/notices`, `/regulations`, `/papers`, `/talent-pool`
- Browser viewport: 1363 × 936 CSS pixels
- Primary state: 로그아웃 상태의 각 내부 페이지 첫 화면

## Asset mapping

| 페이지 | 적용 파일 | 원본 크기 | 표시 결과 |
|---|---|---:|---|
| 학과 소개 | `page-hero-about.jpg` | 2047 × 218 | 정상 |
| 공지사항 | `page-hero-notices.jpg` | 2047 × 694 | 정상 |
| 학과 내규 | `page-hero-regulations.jpg` | 2048 × 612 | 정상 |
| 논문 | `page-hero-papers.jpg` | 2048 × 223 | 정상 |
| 인재풀 등록 | `page-hero-talent-pool.jpg` | 2048 × 247 | 정상 |

## Visual comparison

- 다섯 원본 이미지와 각 페이지의 구현 화면을 같은 순서로 대조했다.
- 모든 이미지가 요청한 페이지에 정확히 연결되었고, 웹 전송에 최적화한 JPEG로 변환한 뒤 원본 비율을 유지한 `object-fit: cover` 방식으로 표시된다.
- 페이지별 피사체 위치에 맞춰 `object-position`을 조정했다.
- 짙은 Navy 단색 오버레이로 제목과 설명의 대비를 확보했다.
- 제목 애니메이션 완료 후 불투명도는 모두 1이었다.
- P0 결함: 없음.
- P1 결함: 없음.
- P2 결함: 없음.

## Layout and interaction checks

- 데스크톱 히어로 높이는 공통 300px이며, 소개 페이지의 긴 설명은 콘텐츠 높이에 따라 314.5px로 자연스럽게 확장된다.
- 다섯 페이지 모두 이미지가 완전히 로드되었고 잘못된 이미지 경로가 없었다.
- 다섯 페이지 모두 의도하지 않은 가로 스크롤이 없었다.
- 페이지별 기존 본문, 게시판, 논문, 내규, 인재풀 등록 기능 코드는 변경하지 않았다.
- 로컬 UI 전용 미리보기에서 API 요청은 서버 없이 실행되어 예상된 JSON 파싱 오류가 발생했다. 이는 배경 이미지 구현과 무관하며, 배포 후 실제 Express API가 연결된 환경에서 재검증한다.
- Chrome 확장 프로그램에서 발생한 진단 오류는 애플리케이션 오류에서 제외했다.

## Final result

passed
