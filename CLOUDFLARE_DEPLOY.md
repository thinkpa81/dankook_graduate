# Cloudflare Pages 배포 가이드

## 🚀 배포 URL
https://dankook-graduate.pages.dev

## 📋 배포 방법

### 방법 1: GitHub Actions 자동 배포 (추천)

GitHub에 푸시할 때마다 자동으로 Cloudflare Pages에 배포됩니다.

#### 1단계: Cloudflare API 토큰 생성

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com/profile/api-tokens

2. **API Token 생성**
   - "Create Token" 클릭
   - "Edit Cloudflare Workers" 템플릿 사용 (또는 Custom Token)
   - 권한 설정:
     - Account > Cloudflare Pages > Edit
   - "Continue to summary" → "Create Token"
   - 토큰을 복사해두세요 (다시 볼 수 없습니다!)

3. **Account ID 확인**
   - Cloudflare 대시보드에서 Workers & Pages 페이지로 이동
   - 우측에서 Account ID 확인 및 복사

#### 2단계: GitHub Secrets 설정

GitHub 저장소 페이지에서:
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭하여 다음 4개 추가:

```
CLOUDFLARE_API_TOKEN = (1단계에서 생성한 API 토큰)
CLOUDFLARE_ACCOUNT_ID = (1단계에서 확인한 Account ID)
DATABASE_URL = <배포 플랫폼에 비밀 변수로 저장한 새 연결 문자열>
NEON_DATABASE_URL = <배포 플랫폼에 비밀 변수로 저장한 새 연결 문자열>
SESSION_SECRET = your-secure-random-secret-key-here
```

#### 3단계: 첫 배포 실행

GitHub Secrets 설정 후:
1. 코드를 main 브랜치에 푸시
2. GitHub Actions가 자동으로 실행됩니다
3. **Actions** 탭에서 배포 진행상황 확인
4. 완료되면 https://dankook-graduate.pages.dev 에서 확인

---

### 방법 2: Cloudflare 대시보드에서 수동 배포

#### 1단계: Cloudflare Pages 프로젝트 생성

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com/ 로그인

2. **Pages 프로젝트 생성**
   - 좌측 메뉴에서 "Workers & Pages" 클릭
   - "Create application" 버튼 클릭
   - "Pages" 탭 선택
   - "Connect to Git" 클릭

3. **GitHub 저장소 연결**
   - GitHub 계정 연결
   - 저장소 선택: `thinkpa81/dangugdaehaggyo-deiteojisigseobiseugonghaggwa`
   - "Begin setup" 클릭

#### 2단계: 빌드 설정

프로젝트 이름과 빌드 설정을 입력합니다:

```
Project name: dankook-graduate
Production branch: main
Build command: npm run build
Build output directory: dist/public
Root directory: (비워둠)
```

#### 3단계: 환경 변수 설정

"Environment variables" 섹션에서 다음을 추가:

**Production 환경에 추가:**

```
DATABASE_URL = <배포 플랫폼에 비밀 변수로 저장한 새 연결 문자열>

NEON_DATABASE_URL = <배포 플랫폼에 비밀 변수로 저장한 새 연결 문자열>

SESSION_SECRET = your-secure-random-secret-key-here

NODE_VERSION = 20
```

#### 4단계: 배포 시작

- "Save and Deploy" 버튼 클릭
- 빌드 및 배포가 자동으로 진행됩니다 (약 2-5분 소요)

#### 5단계: 배포 완료 확인

배포가 완료되면:
- URL: https://dankook-graduate.pages.dev
- 자동으로 SSL 인증서가 적용됩니다
- GitHub에 푸시할 때마다 자동 배포됩니다

---

## ⚠️ 중요 참고사항

**이 프로젝트는 Express 백엔드가 포함된 풀스택 애플리케이션입니다.**

### Cloudflare Pages의 제한사항

Cloudflare Pages는 기본적으로 정적 사이트 호스팅 서비스입니다:
- ✅ **프론트엔드(React)는 정상 배포됩니다**
- ❌ **백엔드 API는 작동하지 않습니다**

### 해결 방법

#### 옵션 1: 백엔드를 Cloudflare Workers로 변환 (복잡함)
- Express API를 Workers 형식으로 재작성
- `functions/` 디렉토리에 API 엔드포인트 생성
- Hono나 itty-router 같은 경량 프레임워크 사용
- 많은 코드 수정이 필요합니다

#### 옵션 2: 백엔드를 별도 플랫폼에 배포 (권장)
- **Railway**: https://railway.app (무료 티어)
- **Render**: https://render.com (무료 티어)
- **Fly.io**: https://fly.io (무료 티어)

프론트엔드는 Cloudflare Pages, 백엔드는 위 플랫폼에 배포하고 API URL을 연결합니다.

#### 옵션 3: 전체를 다른 플랫폼으로 배포 (가장 쉬움)
- **Vercel**: 풀스택 앱에 최적화, 자동 배포
  - URL: `dankook-graduate.vercel.app`
- **Railway/Render**: Node.js 서버 그대로 실행 가능

---

## 🔧 트러블슈팅

### 빌드 실패 시
- Node.js 버전 확인 (환경 변수에 `NODE_VERSION=20` 설정)
- 환경 변수가 올바르게 설정되었는지 확인
- 빌드 로그에서 오류 메시지 확인
- GitHub Actions 로그 확인 (Actions 탭)

### API 호출 실패 시
- Cloudflare Pages는 정적 파일만 제공합니다
- 백엔드 API는 별도 호스팅이 필요합니다
- CORS 설정 확인 (프론트엔드와 백엔드가 다른 도메인일 경우)

### GitHub Actions 실패 시
- Secrets가 올바르게 설정되었는지 확인
- CLOUDFLARE_API_TOKEN 권한 확인
- CLOUDFLARE_ACCOUNT_ID가 정확한지 확인

---

## 📚 추가 리소스

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

## 🎯 현재 상태

- ✅ GitHub Actions 워크플로우 설정 완료
- ✅ Cloudflare Pages 배포 설정 완료
- ✅ 프론트엔드 빌드 설정 완료
- ⏳ GitHub Secrets 설정 필요
- ⏳ Cloudflare API 토큰 생성 필요

다음 단계: GitHub Secrets를 설정하고 코드를 푸시하면 자동으로 배포됩니다!
