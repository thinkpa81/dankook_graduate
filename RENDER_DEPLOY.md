# 🆓 Render 무료 배포 가이드

## 🎯 완전 무료 영구 호스팅!

Render는 **신용카드 없이** 완전 무료로 웹사이트를 영구적으로 호스팅할 수 있습니다.

---

## ✅ 준비 완료 상태

- ✅ `render.yaml` - Render 설정 파일
- ✅ GitHub 저장소 준비 완료
- ✅ PostgreSQL 데이터베이스 (Neon)
- ✅ Production 빌드 설정 완료

---

## 💰 Render 무료 티어

### 완전 무료로 제공되는 것:
- ✅ **무료 웹 서비스** (750시간/월 = 약 31일)
- ✅ **신용카드 불필요**
- ✅ **자동 HTTPS** (SSL 인증서)
- ✅ **자동 배포** (GitHub push 시)
- ✅ **커스텀 도메인** 지원
- ✅ **무제한 대역폭**

### 제한사항:
- ⚠️ **15분 미사용 시 슬립 모드**
  - 첫 접속 시 10-30초 지연 (콜드 스타트)
  - 이후 정상 속도
- ⚠️ **빌드 시간 제한** (15분)
- ⚠️ **메모리 제한** (512MB)

**소규모 웹사이트에는 충분합니다!**

---

## 🚀 Render 배포 단계 (5-10분)

### 1단계: Render 계정 생성

1. **Render 웹사이트 접속**
   - 🔗 https://render.com/

2. **회원가입 (무료)**
   - **"Get Started for Free"** 클릭
   - **"Sign up with GitHub"** 선택 (추천)
   - GitHub 계정으로 로그인 및 권한 승인
   
3. **대시보드 접속**
   - 🔗 https://dashboard.render.com/

---

### 2단계: 새 Web Service 생성

1. **New 버튼 클릭**
   - 대시보드 우측 상단 **"New +"** 버튼
   - **"Web Service"** 선택

2. **GitHub 저장소 연결**
   - "Connect a repository" 섹션
   - 저장소 검색: `dankook_graduate` 또는 `dangugdaehaggyo-deiteojisigseobiseugonghaggwa`
   - **"Connect"** 버튼 클릭

---

### 3단계: 서비스 설정

**기본 정보 입력:**

```
Name: dankook-graduate
Region: Singapore (가장 가까운 지역)
Branch: main
Runtime: Node
```

**빌드 & 시작 설정:**

```
Build Command: npm install && npm run build
Start Command: npm run start
```

**인스턴스 타입:**
```
Instance Type: Free (무료 선택)
```

---

### 4단계: 환경 변수 설정

"Environment Variables" 섹션에서 **"Add Environment Variable"** 클릭하여 추가:

#### 필수 환경 변수:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `NEON_DATABASE_URL` | `postgresql://neondb_owner:npg_9zYRHW3dyVlX@ep-calm-scene-a1aaqtdy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `SESSION_SECRET` | `dankook-render-secure-secret-2026` |

**중요:** 
- 각 변수를 하나씩 추가하세요
- 값에 따옴표는 넣지 마세요
- DATABASE_URL 전체를 복사/붙여넣기 하세요

---

### 5단계: 배포 시작

1. **Create Web Service 클릭**
   - 페이지 하단의 **"Create Web Service"** 버튼 클릭

2. **자동 빌드 및 배포 시작**
   - 실시간 로그가 표시됩니다
   - 예상 소요 시간: 3-7분
   
3. **배포 진행 단계:**
   ```
   ✓ Building...
     - npm install (의존성 설치)
     - npm run build (프로젝트 빌드)
   ✓ Deploying...
   ✓ Live!
     - npm run start (서버 시작)
   ```

---

### 6단계: 배포 완료 확인

1. **서비스 URL 확인**
   - 배포 완료 후 상단에 URL 표시
   - 형식: `https://dankook-graduate.onrender.com`
   - 또는: `https://your-service-name-xxxx.onrender.com`

2. **사이트 접속**
   - URL 클릭하여 웹사이트 확인
   - 첫 접속은 10-30초 소요 (콜드 스타트)
   - 이후 정상 속도

3. **기능 테스트**
   - ✅ 프론트엔드 로딩
   - ✅ API 호출 (로그인, 데이터)
   - ✅ 데이터베이스 연결
   - ✅ 모든 기능 작동

---

## 🔄 자동 재배포

**GitHub에 코드를 푸시하면 자동으로 재배포됩니다:**

```bash
# 로컬에서 코드 수정
git add .
git commit -m "Update website"
git push origin main

# Render가 자동으로 감지하고 재배포 시작
# 3-5분 후 자동 업데이트 완료
```

---

## ⚡ 슬립 모드 대처 방법

### 슬립 모드란?
- 15분간 접속이 없으면 서버가 슬립 상태로 전환
- 다음 접속 시 10-30초 대기 (서버 웨이크업)
- 이후 정상 속도로 작동

### 슬립 모드 방지 (선택사항)

#### 방법 1: UptimeRobot (무료)
1. 🔗 https://uptimerobot.com/ 가입
2. "Add New Monitor" 클릭
3. 웹사이트 URL 입력
4. 5분마다 자동으로 핑 → 슬립 방지

#### 방법 2: Cron-job.org (무료)
1. 🔗 https://cron-job.org/ 가입
2. 새 크론잡 생성
3. URL: 웹사이트 주소
4. 간격: 10분마다 실행

---

## 🔧 트러블슈팅

### 빌드 실패 시

#### 오류: "npm install failed"
```bash
해결: package.json과 package-lock.json 확인
- Node.js 버전 호환성 체크
- Render는 Node.js 20 지원
```

#### 오류: "Build command failed"
```bash
해결: Build Command 확인
- 정확히 "npm install && npm run build" 인지 확인
```

### 서버 시작 실패 시

#### 오류: "Application failed to respond"
```bash
해결: Start Command 확인
- "npm run start" 확인
- PORT 환경 변수 확인 (Render가 자동 설정)
```

#### 오류: "Database connection failed"
```bash
해결: 환경 변수 확인
- DATABASE_URL이 정확한지 확인
- ?sslmode=require 포함 확인
```

### 슬로우 성능

#### 첫 접속이 느려요
```bash
원인: 슬립 모드에서 웨이크업 중
해결: 정상입니다. 10-30초 대기하면 정상 속도
```

#### 전체적으로 느려요
```bash
해결: 
1. 빌드 최적화 확인
2. 데이터베이스 쿼리 최적화
3. 이미지/파일 크기 최적화
```

---

## 📊 배포 후 관리

### 로그 확인
- Dashboard → 서비스 선택 → "Logs" 탭
- 실시간 서버 로그 확인
- 오류 메시지 확인

### 환경 변수 수정
- Dashboard → 서비스 선택 → "Environment" 탭
- 변수 추가/수정/삭제
- 변경 후 자동 재배포

### 배포 내역
- Dashboard → 서비스 선택 → "Events" 탭
- 모든 배포 기록 확인
- 이전 버전으로 롤백 가능

### 커스텀 도메인 연결
- Dashboard → 서비스 선택 → "Settings" → "Custom Domain"
- 본인 소유 도메인 연결 가능 (무료)

---

## 🌐 최종 결과

배포 완료 후:

- ✅ **영구 URL**: `https://dankook-graduate.onrender.com`
- ✅ **자동 HTTPS**: SSL 인증서 자동 적용
- ✅ **자동 배포**: GitHub push 시 자동 업데이트
- ✅ **완전 무료**: 신용카드 불필요
- ✅ **24/7 운영**: 항상 접속 가능 (슬립 모드 제외)
- ✅ **풀스택 작동**: 프론트엔드 + 백엔드 모두 작동

---

## 💡 팁

### 슬립 모드 최소화
- UptimeRobot으로 5분마다 핑
- 또는 Cron-job으로 10분마다 접속

### 성능 최적화
- 이미지 압축 및 최적화
- 불필요한 의존성 제거
- 데이터베이스 쿼리 최적화

### 모니터링
- Render 대시보드에서 메트릭 확인
- 로그로 오류 추적
- UptimeRobot으로 다운타임 모니터링

---

## 🆚 무료 플랫폼 비교

| 플랫폼 | 무료 티어 | 슬립 모드 | 신용카드 | 추천도 |
|--------|-----------|-----------|----------|--------|
| **Render** | ✅ | ⚠️ 15분 | ❌ 불필요 | ⭐⭐⭐⭐⭐ |
| Railway | ❌ ($5) | ❌ | ✅ 필수 | ⭐⭐ |
| Vercel | ✅ | ❌ | ❌ 불필요 | ⭐⭐⭐ |
| Fly.io | ✅ | ❌ | ✅ 필수 | ⭐⭐⭐⭐ |

**Render가 완전 무료로 풀스택 앱 호스팅에 최적입니다!**

---

## 📞 지원

### Render 지원
- 문서: https://render.com/docs
- 커뮤니티: https://community.render.com/
- 이메일: support@render.com

### 프로젝트 관련
- GitHub: https://github.com/thinkpa81/dankook_graduate

---

## 🎉 다음 단계

1. ✅ **Render 가입** → https://render.com/
2. ✅ **GitHub 저장소 연결**
3. ✅ **환경 변수 설정**
4. ✅ **배포 완료!**
5. 🎊 **웹사이트 사용 시작**

---

**완전 무료로 영구 호스팅! 지금 바로 시작하세요! 🚀**
