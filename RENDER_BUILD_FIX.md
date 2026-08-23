# 🔧 Render 배포 빌드 명령 수정 필요

> **보존된 과거 참고문서:** 현재는 `render.yaml`과 `RENDER_DEPLOY.md`를 우선합니다. `package-lock.json`을 삭제하거나 작업 디렉터리를 재귀 삭제하지 않습니다.

## 문제
esbuild 버전 충돌로 인해 빌드가 실패합니다.

## 해결 방법

### Render Dashboard에서 Build Command 수정:

1. **Render Dashboard → dankook_graduate 서비스 클릭**

2. **Settings 탭 → Build & Deploy**

3. **Build Command를 다음으로 변경:**

```bash
npm ci --legacy-peer-deps && npm run build
```

4. **Save Changes 클릭**

5. **Manual Deploy → Deploy latest commit 클릭**

---

## 설명

- `npm ci --legacy-peer-deps`: 커밋된 lockfile과 동일한 의존성 재구성
- `npm run build`: 프로젝트 빌드

이렇게 하면 esbuild 버전 충돌이 해결됩니다.
