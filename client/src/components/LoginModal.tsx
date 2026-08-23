import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { notifyAuthChanged } from "@/hooks/use-session";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setLoginData({ username: "", password: "" });
      setError("");
      setShowPassword(false);
    }
    onOpenChange(nextOpen);
  };

  const handleLogin = async () => {
    setError("");
    if (!loginData.username.trim() || !loginData.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const user = await api.users.login(loginData.username.trim(), loginData.password);
      if (user.role !== "ADMIN") {
        await api.logout();
        setError("관리자 권한이 있는 계정만 로그인할 수 있습니다.");
        return;
      }
      notifyAuthChanged();
      setLoginData({ username: "", password: "" });
      setShowPassword(false);
      onOpenChange(false);
    } catch {
      setError("아이디 또는 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <LockKeyhole className="h-5 w-5 text-[#2156D9]" aria-hidden="true" />
            관리자 로그인
          </DialogTitle>
          <DialogDescription className="text-base">
            홈페이지 콘텐츠 관리 권한이 있는 계정으로 로그인하세요.
          </DialogDescription>
        </DialogHeader>

        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleLogin();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="admin-username" className="font-bold">아이디</Label>
            <Input
              id="admin-username"
              autoComplete="username"
              placeholder="관리자 아이디"
              value={loginData.username}
              onChange={(event) => setLoginData({ ...loginData, username: event.target.value })}
              className="h-11 rounded-lg text-base"
              data-testid="input-login-username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="font-bold">비밀번호</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="비밀번호"
                value={loginData.password}
                onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                className="h-11 rounded-lg pr-11 text-base"
                data-testid="input-login-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-[#2156D9] text-base font-bold hover:bg-[#1848bc]"
            data-testid="button-login-submit"
          >
            {loading ? "확인 중..." : "로그인"}
          </Button>
          <p className="text-center text-xs leading-relaxed text-slate-500">
            일반 방문자 정보는 수집하지 않으며, 회원가입 기능을 제공하지 않습니다.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
