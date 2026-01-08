import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, FileText, CheckCircle, Users, Calendar, Shield, Download, Lock, Pencil, Trash2, LogOut, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

interface TalentEntry {
  id: number;
  name: string;
  email: string;
  phone: string;
  education: string;
  major: string;
  interestedMajor: string;
  motivation: string;
  registeredAt: string;
  registeredTime: string;
}

const initialTalentData: TalentEntry[] = [
  { id: 1, name: "김철수", email: "kim@email.com", phone: "010-1234-5678", education: "학사 졸업(예정)", major: "컴퓨터공학", interestedMajor: "데이터사이언스", motivation: "데이터 분석 분야에 관심이 많습니다.", registeredAt: "2024.01.05", registeredTime: "14:32" },
  { id: 2, name: "이영희", email: "lee@email.com", phone: "010-2345-6789", education: "석사 졸업(예정)", major: "통계학", interestedMajor: "데이터사이언스", motivation: "통계 기반 머신러닝 연구를 하고 싶습니다.", registeredAt: "2024.01.03", registeredTime: "09:15" },
  { id: 3, name: "박지민", email: "park@email.com", phone: "010-3456-7890", education: "학사 졸업(예정)", major: "경영학", interestedMajor: "메타버스융합", motivation: "메타버스 비즈니스에 관심이 있습니다.", registeredAt: "2024.01.02", registeredTime: "16:48" },
];

export default function TalentPool() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [talentData, setTalentData] = useState<TalentEntry[]>(initialTalentData);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ id: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [editingEntry, setEditingEntry] = useState<TalentEntry | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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
    const now = new Date();
    const newEntry: TalentEntry = {
      id: talentData.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      education: formData.education === 'bachelor' ? '학사 졸업(예정)' : formData.education === 'master' ? '석사 졸업(예정)' : '박사 졸업(예정)',
      major: formData.major,
      interestedMajor: formData.interestedMajor === 'data-science' ? '데이터사이언스' : formData.interestedMajor === 'metaverse' ? '메타버스융합' : '둘 다',
      motivation: formData.motivation,
      registeredAt: now.toISOString().split('T')[0].replace(/-/g, '.'),
      registeredTime: now.toTimeString().slice(0, 5),
    };
    setTalentData([newEntry, ...talentData]);
    setSubmitted(true);
  };

  const handleAdminLogin = () => {
    if (adminCredentials.id === "thinkpa" && adminCredentials.password === "audghk99**") {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setLoginError("");
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminCredentials({ id: "", password: "" });
  };

  const handleEditEntry = (entry: TalentEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = () => {
    if (!editingEntry) return;
    setTalentData(talentData.map(e => e.id === editingEntry.id ? editingEntry : e));
    setEditingEntry(null);
  };

  const handleDeleteEntry = () => {
    if (deleteId) {
      setTalentData(talentData.filter(e => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  const downloadExcel = () => {
    let csvContent = "이름,이메일,연락처,학력,학부전공,관심전공,지원동기,등록일,등록시간\n";
    talentData.forEach(entry => {
      csvContent += `${entry.name},${entry.email},${entry.phone},${entry.education},${entry.major},${entry.interestedMajor},"${entry.motivation}",${entry.registeredAt},${entry.registeredTime}\n`;
    });
    
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `인재풀_목록_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.4)_0%,_transparent_60%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-cyan-400 font-semibold mb-2 text-base tracking-wide">TALENT POOL</p>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 text-white">인재풀 등록</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              진학에 관심 있는 분들의 정보를 등록해주세요. 
              입학 관련 정보를 받아보실 수 있습니다.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-14 flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 rounded-xl">
              <TabsTrigger value="register" className="rounded-lg font-bold text-base" data-testid="tab-register">
                <Users className="w-5 h-5 mr-2" />
                인재풀 등록
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="rounded-lg font-bold text-base" 
                data-testid="tab-admin"
                onClick={() => {
                  if (!isAdminLoggedIn) {
                    setShowAdminLogin(true);
                  }
                }}
              >
                <Shield className="w-5 h-5 mr-2" />
                관리자 전용
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-12 lg:p-16 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 mb-4">
                        등록이 완료되었습니다
                      </h2>
                      <p className="text-gray-600 mb-8 text-base">
                        인재풀 등록이 성공적으로 완료되었습니다.<br />
                        입학 관련 정보가 있을 경우 등록하신 이메일로 안내드리겠습니다.
                      </p>
                      <Button 
                        onClick={() => setSubmitted(false)} 
                        size="lg"
                        className="rounded-lg px-8 h-12 font-bold bg-gradient-to-r from-primary to-blue-600 text-base"
                        data-testid="button-register-again"
                      >
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
                  <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">진학 관심 인재풀 등록</CardTitle>
                          <CardDescription className="text-base">
                            아래 양식을 작성하여 인재풀에 등록해주세요.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold text-base">이름 *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                id="name"
                                placeholder="홍길동"
                                className="pl-11 h-12 rounded-lg text-base"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                data-testid="input-name"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="font-bold text-base">연락처 *</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="010-1234-5678"
                                className="pl-11 h-12 rounded-lg text-base"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                data-testid="input-phone"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-bold text-base">이메일 *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@email.com"
                              className="pl-11 h-12 rounded-lg text-base"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              data-testid="input-email"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="education" className="font-bold text-base">최종학력 *</Label>
                            <Select 
                              required
                              onValueChange={(value) => setFormData({ ...formData, education: value })}
                            >
                              <SelectTrigger className="h-12 rounded-lg text-base" data-testid="select-education">
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
                            <Label htmlFor="major" className="font-bold text-base">학부 전공 *</Label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                id="major"
                                placeholder="컴퓨터공학"
                                className="pl-11 h-12 rounded-lg text-base"
                                required
                                value={formData.major}
                                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                data-testid="input-major"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interestedMajor" className="font-bold text-base">관심 전공 *</Label>
                          <Select 
                            required
                            onValueChange={(value) => setFormData({ ...formData, interestedMajor: value })}
                          >
                            <SelectTrigger className="h-12 rounded-lg text-base" data-testid="select-interested-major">
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
                          <Label htmlFor="motivation" className="font-bold text-base">지원 동기</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Textarea
                              id="motivation"
                              placeholder="지원 동기 및 연구 관심 분야를 작성해주세요."
                              className="pl-11 min-h-[120px] rounded-lg pt-3 text-base"
                              value={formData.motivation}
                              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                              data-testid="textarea-motivation"
                            />
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <Checkbox
                            id="privacy"
                            checked={formData.agreePrivacy}
                            onCheckedChange={(checked) => 
                              setFormData({ ...formData, agreePrivacy: checked as boolean })
                            }
                            className="mt-0.5"
                            data-testid="checkbox-privacy"
                          />
                          <div className="grid gap-1 leading-none">
                            <label
                              htmlFor="privacy"
                              className="font-bold leading-none cursor-pointer text-base"
                            >
                              개인정보 수집 및 이용 동의 (필수)
                            </label>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              수집된 개인정보는 인재풀 관리 및 입학 안내 목적으로만 사용되며, 
                              목적 달성 후 지체없이 파기됩니다.
                            </p>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full font-bold rounded-lg h-14 bg-gradient-to-r from-primary to-blue-600 text-lg"
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
            </TabsContent>

            <TabsContent value="admin">
              {isAdminLoggedIn ? (
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="p-6 border-b bg-gray-50">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">인재풀 관리</CardTitle>
                          <CardDescription>
                            등록된 인재풀 목록 (총 {talentData.length}명)
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={downloadExcel}
                          className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-600"
                          data-testid="button-download-excel"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          엑셀 다운로드
                        </Button>
                        <Button 
                          onClick={handleLogout}
                          variant="outline"
                          className="rounded-lg"
                          data-testid="button-logout"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          로그아웃
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">이름</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">이메일</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">연락처</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">학력</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">관심전공</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">등록일시</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">관리</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {talentData.map((entry) => (
                            <tr key={entry.id} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                  </div>
                                  <span className="font-medium text-gray-900">{entry.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">{entry.email}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{entry.phone}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{entry.education}</td>
                              <td className="px-4 py-4">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                                  {entry.interestedMajor}
                                </Badge>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                <div className="flex flex-col">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {entry.registeredAt}
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {entry.registeredTime}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg"
                                    onClick={() => handleEditEntry(entry)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg text-destructive"
                                    onClick={() => setDeleteId(entry.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">관리자 로그인 필요</h3>
                    <p className="text-gray-500 mb-6 text-base">이 페이지는 관리자만 접근할 수 있습니다.</p>
                    <Button 
                      onClick={() => setShowAdminLogin(true)}
                      className="rounded-lg bg-gradient-to-r from-primary to-blue-600"
                    >
                      관리자 로그인
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              관리자 로그인
            </DialogTitle>
            <DialogDescription className="text-base">
              관리자 계정으로 로그인하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="admin-id" className="font-bold">아이디</Label>
              <Input
                id="admin-id"
                placeholder="아이디를 입력하세요"
                value={adminCredentials.id}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, id: e.target.value })}
                className="h-12 rounded-lg text-base"
                data-testid="input-admin-id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="font-bold">비밀번호</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                className="h-12 rounded-lg text-base"
                data-testid="input-admin-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-500">{loginError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAdminLogin(false)} className="flex-1 rounded-lg h-12 text-base">
                취소
              </Button>
              <Button onClick={handleAdminLogin} className="flex-1 rounded-lg h-12 font-bold bg-gradient-to-r from-primary to-blue-600 text-base" data-testid="button-admin-login">
                로그인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editingEntry !== null} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">인재풀 정보 수정</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="font-bold">이름</Label>
                <Input
                  value={editingEntry.name}
                  onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">이메일</Label>
                <Input
                  value={editingEntry.email}
                  onChange={(e) => setEditingEntry({ ...editingEntry, email: e.target.value })}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">연락처</Label>
                <Input
                  value={editingEntry.phone}
                  onChange={(e) => setEditingEntry({ ...editingEntry, phone: e.target.value })}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditingEntry(null)} className="flex-1 rounded-lg h-11">
                  취소
                </Button>
                <Button onClick={handleSaveEdit} className="flex-1 rounded-lg h-11 font-bold bg-gradient-to-r from-primary to-blue-600">
                  저장
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>인재풀 정보를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-destructive text-destructive-foreground rounded-lg">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}