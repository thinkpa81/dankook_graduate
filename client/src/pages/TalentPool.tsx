import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

export default function TalentPool() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    major: "",
    interestedMajor: "",
    motivation: "",
    agreePrivacy: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreePrivacy) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="hero-gradient text-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-200 mb-2">Talent Pool Registration</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">인재풀 등록</h1>
            <p className="text-blue-100 max-w-2xl">
              진학에 관심 있는 분들의 정보를 등록해주세요. 
              입학 관련 정보를 받아보실 수 있습니다.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-2xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    등록이 완료되었습니다
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    인재풀 등록이 성공적으로 완료되었습니다.<br />
                    입학 관련 정보가 있을 경우 등록하신 이메일로 안내드리겠습니다.
                  </p>
                  <Button onClick={() => setSubmitted(false)} data-testid="button-register-again">
                    다시 등록하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">진학 관심 인재풀 등록</CardTitle>
                  <CardDescription>
                    아래 양식을 작성하여 인재풀에 등록해주세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">이름 *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="홍길동"
                            className="pl-10"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            data-testid="input-name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">연락처 *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            className="pl-10"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          className="pl-10"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="education">최종학력 *</Label>
                        <Select 
                          required
                          onValueChange={(value) => setFormData({ ...formData, education: value })}
                        >
                          <SelectTrigger data-testid="select-education">
                            <SelectValue placeholder="선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bachelor">학사 졸업(예정)</SelectItem>
                            <SelectItem value="master">석사 졸업(예정)</SelectItem>
                            <SelectItem value="doctor">박사 졸업(예정)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">학부 전공 *</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="major"
                            placeholder="컴퓨터공학"
                            className="pl-10"
                            required
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            data-testid="input-major"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestedMajor">관심 전공 *</Label>
                      <Select 
                        required
                        onValueChange={(value) => setFormData({ ...formData, interestedMajor: value })}
                      >
                        <SelectTrigger data-testid="select-interested-major">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="data-science">데이터사이언스</SelectItem>
                          <SelectItem value="metaverse">메타버스융합</SelectItem>
                          <SelectItem value="both">둘 다 관심있음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivation">지원 동기</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Textarea
                          id="motivation"
                          placeholder="지원 동기 및 연구 관심 분야를 작성해주세요."
                          className="pl-10 min-h-[120px]"
                          value={formData.motivation}
                          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                          data-testid="textarea-motivation"
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, agreePrivacy: checked as boolean })
                        }
                        data-testid="checkbox-privacy"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="privacy"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          개인정보 수집 및 이용 동의 (필수)
                        </label>
                        <p className="text-xs text-muted-foreground">
                          수집된 개인정보는 인재풀 관리 및 입학 안내 목적으로만 사용되며, 
                          목적 달성 후 지체없이 파기됩니다.
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full font-semibold"
                      size="lg"
                      data-testid="button-submit"
                    >
                      등록하기
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}