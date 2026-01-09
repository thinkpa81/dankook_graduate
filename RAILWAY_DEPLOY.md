# 🚂 Railway 영구 배포 가이드

## 🎯 목표
**단국대학교 대학원 데이터지식서비스공학과 웹사이트를 영구적으로 배포**

Railway는 무료 티어를 제공하며, 풀스택 Node.js 앱을 간단하게 배포할 수 있습니다.

---

## ✅ 배포 준비 완료 상태

- ✅ `railway.json` - Railway 설정 파일
- ✅ `Procfile` - 시작 명령 정의
- ✅ `.env.example` - 환경 변수 템플릿
- ✅ PostgreSQL 데이터베이스 준비 완료
- ✅ Production 빌드 완료

---

## 🚀 Railway 배포 단계 (5-10분 소요)

### 1단계: Railway 계정 생성

1. **Railway 웹사이트 접속**
   - 🔗 https://railway.app/
   - "Start a New Project" 또는 "Login" 클릭

2. **GitHub로 로그인 (추천)**
   - "Login with GitHub" 클릭
   - Railway 앱 권한 승인
   - 자동으로 저장소 연결 가능

---

### 2단계: 새 프로젝트 생성

1. **Dashboard 접속**
   - 🔗 https://railway.app/dashboard

2. **New Project 클릭**
   - "Deploy from GitHub repo" 선택
   - 저장소 검색: `dangugdaehaggyo-deiteojisigseobiseugonghaggwa`
   - 저장소 선택 및 "Deploy Now" 클릭

3. **자동 감지**
   - Railway가 Node.js 프로젝트를 자동 감지합니다
   - `package.json`을 읽고 자동으로 빌드 설정

---

### 3단계: 환경 변수 설정

프로젝트 대시보드에서:

1. **Variables 탭 클릭**

2. **다음 환경 변수 추가:**

```bash
NODE_ENV=production

DATABASE_URL=postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

NEON_DATABASE_URL=postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

SESSION_SECRET=dankook-graduate-railway-2026-secure-secret-key

PORT=5000
```

**중요:** 각 변수를 개별적으로 추가하세요.

---

### 4단계: 배포 시작

1. **자동 배포 시작**
   - 환경 변수 설정 후 자동으로 배포가 시작됩니다
   - 또는 "Deploy" 버튼 클릭

2. **배포 진행 확인**
   - "Deployments" 탭에서 실시간 로그 확인
   - 예상 소요 시간: 2-5분
   
3. **배포 단계:**
   ```
   ✓ Building...
     - npm install
     - npm run build
   ✓ Deploying...
   ✓ Running...
     - npm run start
   ```

---

### 5단계: 도메인 확인 및 설정

1. **공개 URL 생성**
   - "Settings" 탭 클릭
   - "Networking" 섹션 찾기
   - "Generate Domain" 클릭

2. **도메인 확인**
   - 자동 생성된 URL 확인
   - 형식: `https://your-project-name.up.railway.app`
   - 또는: `https://dankook-graduate.up.railway.app`

3. **커스텀 도메인 (선택사항)**
   - "Custom Domain" 추가 가능
   - 본인 소유 도메인 연결 가능

---

### 6단계: 배포 완료 확인

1. **사이트 접속**
   - 생성된 URL로 접속
   - 웹사이트가 정상적으로 로드되는지 확인

2. **기능 테스트**
   - ✅ 프론트엔드 표시
   - ✅ API 호출 (로그인, 데이터 조회)
   - ✅ 데이터베이스 연결
   - ✅ 파일 업로드
   - ✅ 세션 관리

---

## 🔄 자동 재배포

**GitHub에 코드를 푸시하면 자동으로 재배포됩니다:**

1. 로컬에서 코드 수정
2. `git add .`
3. `git commit -m "Update"`
4. `git push origin main`
5. Railway가 자동으로 감지하고 재배포

---

## 💰 무료 티어 정보

Railway 무료 티어:
- ✅ **$5 크레딧/월** (사용량 기반)
- ✅ **500시간 실행 시간**
- ✅ **무제한 프로젝트**
- ✅ **자동 HTTPS**
- ✅ **커스텀 도메인**

**예상 사용량:**
- 소규모 웹사이트: $0-3/월
- 중간 트래픽: $3-5/월

---

## 🔧 트러블슈팅

### 배포 실패 시

#### 1. Build 실패
```bash
해결: package.json의 scripts 확인
- "build": "tsx script/build.ts" ✅
- "start": "NODE_ENV=production node dist/index.cjs" ✅
```

#### 2. 서버 시작 실패
```bash
해결: 환경 변수 확인
- DATABASE_URL이 올바른지 확인
- PORT 변수 설정 확인 (Railway는 자동으로 PORT 할당)
```

#### 3. 데이터베이스 연결 실패
```bash
해결: PostgreSQL URL 확인
- SSL 모드: ?sslmode=require
- 네트워크 접근 허용 확인
```

#### 4. 포트 바인딩 오류
```bash
해결: server/index.ts 확인
- process.env.PORT || 5000 사용 확인
- Railway가 PORT 환경 변수를 자동으로 설정
```

---

## 📊 배포 후 관리

### 로그 확인
- Railway Dashboard → Deployments → View Logs
- 실시간 서버 로그 확인 가능

### 환경 변수 수정
- Variables 탭에서 언제든 수정 가능
- 수정 후 자동으로 재배포됨

### 데이터베이스 백업
- PostgreSQL (Neon)은 별도 관리
- Neon 대시보드에서 백업 설정 가능

### 모니터링
- Railway Dashboard에서 CPU, 메모리 사용량 확인
- Metrics 탭에서 상세 분석

---

## 🎯 대안: Railway CLI로 배포

터미널에서 직접 배포하려면:

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
railway init

# 환경 변수 설정
railway variables set DATABASE_URL="postgresql://..."
railway variables set SESSION_SECRET="your-secret"

# 배포
railway up

# 도메인 확인
railway domain
```

---

## 🌐 최종 결과

배포 완료 후:

- ✅ **영구 URL**: `https://your-project.up.railway.app`
- ✅ **자동 HTTPS**: SSL 인증서 자동 적용
- ✅ **자동 배포**: GitHub push 시 자동 재배포
- ✅ **풀스택 작동**: 프론트엔드 + 백엔드 모두 작동
- ✅ **데이터베이스 연결**: PostgreSQL (Neon) 연결됨
- ✅ **영구 호스팅**: 24/7 운영

---

## 📞 다음 단계

1. ✅ 위 단계대로 Railway에 배포
2. 🔗 생성된 URL로 웹사이트 접속
3. 🧪 모든 기능 테스트 (로그인, 데이터 CRUD)
4. 📱 커스텀 도메인 연결 (선택사항)
5. 📊 사용량 모니터링

---

## 📚 참고 자료

- [Railway 공식 문서](https://docs.railway.app/)
- [Railway Node.js 가이드](https://docs.railway.app/guides/nodejs)
- [Railway 환경 변수](https://docs.railway.app/develop/variables)
- [Railway CLI](https://docs.railway.app/develop/cli)

---

**준비 완료! 위 가이드를 따라 진행하면 영구적으로 배포됩니다! 🚀**
