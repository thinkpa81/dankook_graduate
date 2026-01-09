# 🔧 Render 배포 빌드 명령 수정 필요

## 문제
esbuild 버전 충돌로 인해 빌드가 실패합니다.

## 해결 방법

### Render Dashboard에서 Build Command 수정:

1. **Render Dashboard → dankook_graduate 서비스 클릭**

2. **Settings 탭 → Build & Deploy**

3. **Build Command를 다음으로 변경:**

```bash
rm -rf node_modules package-lock.json && npm install && npm run build
```

또는

```bash
npm ci --legacy-peer-deps && npm run build
```

4. **Save Changes 클릭**

5. **Manual Deploy → Deploy latest commit 클릭**

---

## 설명

- `rm -rf node_modules package-lock.json`: 기존 캐시 삭제
- `npm install`: 의존성 재설치
- `npm run build`: 프로젝트 빌드

이렇게 하면 esbuild 버전 충돌이 해결됩니다.
