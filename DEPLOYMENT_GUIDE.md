# 🚀 Cloudflare Pages 배포 - 단계별 실행 가이드

## ✅ 배포 준비 완료 상태
- ✅ 프로젝트 빌드 완료 (`dist/public/` 디렉토리)
- ✅ GitHub 저장소에 푸시 완료
- ✅ wrangler.toml 설정 완료
- ✅ PostgreSQL 데이터베이스 연결 준비 완료

## 🌐 목표 URL
**https://dankook-graduate.pages.dev**

---

## 📋 배포 단계 (약 5-10분 소요)

### 1단계: Cloudflare 계정 생성 및 로그인

1. **Cloudflare 웹사이트 접속**
   - 🔗 https://dash.cloudflare.com/sign-up
   - 이메일과 비밀번호로 무료 계정 생성
   - 이메일 인증 완료

2. **로그인 후 대시보드 확인**
   - 🔗 https://dash.cloudflare.com/

---

### 2단계: Cloudflare Pages 프로젝트 생성

1. **Workers & Pages 메뉴 접속**
   - 좌측 사이드바에서 **"Workers & Pages"** 클릭
   - 또는 직접 링크: 🔗 https://dash.cloudflare.com/pages

2. **새 프로젝트 생성**
   - **"Create application"** 버튼 클릭
   - **"Pages"** 탭 선택
   - **"Connect to Git"** 버튼 클릭

3. **GitHub 연결 권한 부여**
   - "Connect GitHub account" 클릭
   - GitHub 로그인 및 권한 승인
   - Cloudflare Pages 앱 설치 승인

---

### 3단계: GitHub 저장소 선택

1. **저장소 검색 및 선택**
   - 저장소 목록에서 찾기 또는 검색창 사용
   - 저장소 이름: **`dangugdaehaggyo-deiteojisigseobiseugonghaggwa`**
   - 저장소 전체 경로: `thinkpa81/dangugdaehaggyo-deiteojisigseobiseugonghaggwa`
   
2. **저장소 선택 후 "Begin setup" 클릭**

---

### 4단계: 빌드 설정 구성

**Set up builds and deployments** 페이지에서 다음 정보를 입력:

#### 기본 설정
```
Project name: dankook-graduate
Production branch: main
```

#### 빌드 설정
```
Framework preset: None (드롭다운에서 선택)
Build command: npm run build
Build output directory: dist/public
Root directory: (비워둠 - 기본값 사용)
```

#### 환경 변수 (Environment variables)

**"Add environment variable" 버튼을 클릭하여 하나씩 추가:**

| Variable name | Value | Environment |
|--------------|-------|-------------|
| `NODE_VERSION` | `20` | Production |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Production |
| `NEON_DATABASE_URL` | `postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Production |
| `SESSION_SECRET` | `dankook-graduate-secret-2026-change-in-production` | Production |

**중요:** 각 변수마다 "Add environment variable" 버튼을 누르고, Environment는 반드시 **"Production"**을 선택하세요.

---

### 5단계: 배포 시작

1. **설정 확인**
   - 모든 설정 항목이 올바른지 다시 한 번 확인
   - 특히 `Build output directory: dist/public` 확인

2. **배포 시작**
   - **"Save and Deploy"** 버튼 클릭
   - 빌드 프로세스가 자동으로 시작됩니다

3. **빌드 진행 상황 확인**
   - 실시간 빌드 로그가 표시됩니다
   - 예상 소요 시간: 2-5분
   - 단계별 진행 상황:
     * ✓ Cloning repository
     * ✓ Installing dependencies (npm install)
     * ✓ Building application (npm run build)
     * ✓ Deploying to Cloudflare Pages

---

### 6단계: 배포 완료 확인

**배포 성공 시:**

1. **배포 완료 메시지**
   - ✅ "Success! Your site has been deployed!"
   - 배포 URL이 표시됩니다

2. **사이트 URL 확인**
   - Production URL: **https://dankook-graduate.pages.dev**
   - Preview URL도 함께 생성됩니다

3. **사이트 접속 테스트**
   - URL 클릭하여 웹사이트 확인
   - 프론트엔드(React)가 정상적으로 표시되는지 확인

---

## 🔄 자동 배포 설정

배포 완료 후, GitHub에 코드를 푸시하면 자동으로 재배포됩니다:

1. **main 브랜치에 푸시** → 자동으로 production 배포
2. **다른 브랜치에 푸시** → 자동으로 preview 배포

---

## ⚠️ 중요 제한사항

### Cloudflare Pages의 한계

이 프로젝트는 **Express 백엔드**가 있는 풀스택 애플리케이션입니다.

**Cloudflare Pages는 정적 사이트만 호스팅합니다:**
- ✅ **프론트엔드 (React)**: 정상 작동
- ❌ **백엔드 (Express API)**: 작동하지 않음
- ❌ **데이터베이스 연결**: 클라이언트 측에서 직접 불가능
- ❌ **세션 관리**: 서버 측 세션 불가능

### 현재 배포로 작동하는 기능
- ✅ 웹사이트 UI (React 컴포넌트)
- ✅ 정적 페이지 표시
- ✅ 클라이언트 측 라우팅

### 작동하지 않는 기능
- ❌ API 호출 (로그인, 데이터 조회/수정)
- ❌ 파일 업로드
- ❌ 사용자 인증
- ❌ 데이터베이스 작업

---

## 🛠️ 완전한 풀스택 배포 옵션

### 옵션 1: 백엔드를 별도 플랫폼에 배포

**프론트엔드:** Cloudflare Pages (현재 설정)
**백엔드:** 다음 중 선택

#### A. Railway (추천)
- 🔗 https://railway.app/
- 무료 티어: $5 크레딧/월
- PostgreSQL 연결 쉬움
- Node.js 서버 그대로 실행

**배포 방법:**
1. Railway 가입
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택
4. 환경 변수 설정 (DATABASE_URL, SESSION_SECRET)
5. 자동 배포 완료

#### B. Render
- 🔗 https://render.com/
- 무료 티어: 제한적이지만 사용 가능
- PostgreSQL 연결 지원

#### C. Fly.io
- 🔗 https://fly.io/
- 무료 티어 제공
- Docker 기반 배포

---

### 옵션 2: 전체를 Vercel에 배포 (가장 쉬움)

**Vercel은 풀스택 Next.js/React 앱을 위한 플랫폼이지만, Express도 지원합니다.**

🔗 https://vercel.com/

**장점:**
- ✅ 프론트엔드 + 백엔드 모두 배포 가능
- ✅ 자동 HTTPS
- ✅ 무료 티어
- ✅ GitHub 연동 자동 배포
- ✅ URL: `dankook-graduate.vercel.app`

**배포 방법:**
1. Vercel 가입 (GitHub 계정으로)
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정
5. Deploy 클릭

---

### 옵션 3: Cloudflare Workers로 백엔드 변환 (고급)

Express API를 Cloudflare Workers로 재작성해야 합니다.

**필요한 작업:**
- Express → Hono/itty-router 변환
- 세션 관리 재구현
- 파일 업로드 → R2 스토리지 사용
- 많은 코드 수정 필요

---

## 🔧 트러블슈팅

### 빌드 실패 시

#### 1. Node.js 버전 오류
```
해결: 환경 변수에 NODE_VERSION=20 추가 확인
```

#### 2. npm install 실패
```
해결: package.json과 package-lock.json이 최신인지 확인
```

#### 3. Build 명령 실패
```
해결: Build command가 정확히 "npm run build"인지 확인
```

#### 4. 빌드 출력 디렉토리 오류
```
해결: Build output directory가 "dist/public"인지 확인
```

---

## 📊 배포 후 관리

### 배포 내역 확인
- Cloudflare Pages 대시보드에서 "Deployments" 탭
- 각 배포의 상태, 로그, 미리보기 확인 가능

### 환경 변수 수정
- Settings → Environment variables
- 변경 후 "Redeploy" 필요

### 커스텀 도메인 추가
- Settings → Custom domains
- 본인 소유 도메인 연결 가능

---

## 📞 다음 단계

1. ✅ 위 단계대로 Cloudflare Pages 배포 진행
2. ⚠️ API가 작동하지 않는 것을 확인
3. 🚀 백엔드를 Railway/Render/Vercel 중 선택하여 추가 배포
4. 🔗 프론트엔드에서 백엔드 API URL 연결

---

## 📚 참고 자료

- [Cloudflare Pages 공식 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [GitHub Integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Build Configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)

---

**현재 상태:** 모든 준비 완료 ✅
**다음 작업:** Cloudflare 대시보드에서 위 단계대로 수동 설정 진행

위 가이드를 따라 진행하시면 https://dankook-graduate.pages.dev 에 배포됩니다!
