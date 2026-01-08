import { useState, useEffect } from "react";
import { LogIn, UserPlus, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addUser, findUserByUsername, validateUser } from "@/lib/dataStore";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export default function LoginModal({ open, onOpenChange, defaultTab = "login" }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "", confirmPassword: "", name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleLogin = () => {
    setError("");
    if (!loginData.username || !loginData.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    const user = validateUser(loginData.username, loginData.password);
    if (user) {
      setSuccess(`${user.name}님, 환영합니다!`);
      setTimeout(() => {
        onOpenChange(false);
        setLoginData({ username: "", password: "" });
        setSuccess("");
      }, 1500);
    } else {
      const existingUser = findUserByUsername(loginData.username);
      if (!existingUser) {
        setError("등록되지 않은 사용자입니다. 회원가입을 먼저 진행해주세요.");
        setActiveTab("signup");
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    }
  };

  const handleSignup = () => {
    setError("");
    if (!signupData.username || !signupData.password || !signupData.name || !signupData.email) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (signupData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    const existingUser = findUserByUsername(signupData.username);
    if (existingUser) {
      setError("이미 사용 중인 아이디입니다.");
      return;
    }
    
    addUser({
      username: signupData.username,
      password: signupData.password,
      name: signupData.name,
      email: signupData.email,
    });
    
    setSuccess("회원가입이 완료되었습니다! 로그인해주세요.");
    setTimeout(() => {
      setActiveTab("login");
      setSignupData({ username: "", password: "", confirmPassword: "", name: "", email: "" });
      setSuccess("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            회원 서비스
          </DialogTitle>
          <DialogDescription className="text-base">
            로그인 또는 회원가입을 진행해주세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "login" | "signup"); setError(""); setSuccess(""); }} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 h-12 rounded-lg">
            <TabsTrigger value="login" className="rounded-lg font-bold text-base">
              <LogIn className="w-4 h-4 mr-2" />
              로그인
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg font-bold text-base">
              <UserPlus className="w-4 h-4 mr-2" />
              회원가입
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-bold">아이디</Label>
              <Input
                placeholder="아이디를 입력하세요"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-login-username"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">비밀번호</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="h-11 rounded-lg pr-10 text-base"
                  data-testid="input-login-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <Button 
              onClick={handleLogin} 
              className="w-full rounded-lg h-12 font-bold bg-gradient-to-r from-primary to-blue-600 text-base"
              data-testid="button-login-submit"
            >
              로그인
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-bold">이름 *</Label>
              <Input
                placeholder="이름을 입력하세요"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-signup-name"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">이메일 *</Label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-signup-email"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">아이디 *</Label>
              <Input
                placeholder="사용할 아이디를 입력하세요"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-signup-username"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">비밀번호 * (6자 이상)</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-signup-password"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">비밀번호 확인 *</Label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                className="h-11 rounded-lg text-base"
                data-testid="input-signup-confirm"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <Button 
              onClick={handleSignup} 
              className="w-full rounded-lg h-12 font-bold bg-gradient-to-r from-primary to-blue-600 text-base"
              data-testid="button-signup-submit"
            >
              회원가입
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}