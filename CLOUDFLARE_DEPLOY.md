# Cloudflare Pages 배포 가이드

## 🚀 배포 URL
https://dankook-graduate.pages.dev

## 📋 배포 단계

### 1단계: Cloudflare 계정 및 Pages 프로젝트 생성

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com/ 로그인 (계정이 없다면 무료 가입)

2. **Pages 프로젝트 생성**
   - 좌측 메뉴에서 "Workers & Pages" 클릭
   - "Create application" 버튼 클릭
   - "Pages" 탭 선택
   - "Connect to Git" 클릭

3. **GitHub 저장소 연결**
   - GitHub 계정 연결
   - 저장소 선택: `thinkpa81/dangugdaehaggyo-deiteojisigseobiseugonghaggwa`
   - "Begin setup" 클릭

### 2단계: 빌드 설정

프로젝트 이름과 빌드 설정을 입력합니다:

```
Project name: dankook-graduate
Production branch: main
Build command: npm run build
Build output directory: dist/public
Root directory: (비워둠)
```

### 3단계: 환경 변수 설정

"Environment variables" 섹션에서 다음을 추가:

**중요: Production 환경에 추가해야 합니다**

```
DATABASE_URL = postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

NEON_DATABASE_URL = postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

SESSION_SECRET = your-secret-key-change-this-in-production

NODE_VERSION = 20
```

### 4단계: 배포 시작

- "Save and Deploy" 버튼 클릭
- 빌드 및 배포가 자동으로 진행됩니다 (약 2-5분 소요)

### 5단계: 배포 완료 확인

배포가 완료되면:
- URL: https://dankook-graduate.pages.dev
- 자동으로 SSL 인증서가 적용됩니다
- GitHub에 푸시할 때마다 자동 배포됩니다

## ⚠️ 중요 참고사항

**이 프로젝트는 Express 백엔드가 포함된 풀스택 애플리케이션입니다.**

Cloudflare Pages는 기본적으로 정적 사이트 호스팅 서비스이므로:
- **프론트엔드(React)만 배포됩니다**
- **백엔드 API는 Cloudflare Workers로 별도 변환이 필요합니다**

### 완전한 풀스택 배포를 위한 옵션:

1. **Cloudflare Workers 사용** (복잡함)
   - Express API를 Workers로 마이그레이션
   - `functions/` 디렉토리에 API 엔드포인트 생성
   - 많은 코드 수정 필요

2. **다른 플랫폼 사용** (추천)
   - **Vercel**: 풀스택 앱에 최적화, 자동 배포
   - **Railway/Render**: Node.js 서버 그대로 실행 가능

## 🔧 트러블슈팅

### 빌드 실패 시
- Node.js 버전 확인 (환경 변수에 `NODE_VERSION=20` 설정)
- 환경 변수가 올바르게 설정되었는지 확인
- 빌드 로그에서 오류 메시지 확인

### API 호출 실패 시
- 현재 설정은 프론트엔드만 배포되므로 API가 작동하지 않습니다
- 백엔드는 별도 호스팅이 필요합니다

## 📚 추가 리소스

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
