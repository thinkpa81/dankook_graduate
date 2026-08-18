import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, LogIn, Menu, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import dkuLogo from "@assets/image_1767877726952.png";

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick?: () => void;
}

const navItems = [
  { title: "학과 소개", href: "/about" },
  { title: "공지사항", href: "/notices" },
  {
    title: "논문",
    href: "/papers",
    children: [
      { title: "학술대회", href: "/papers/conference" },
      { title: "저널", href: "/papers/journal" },
    ],
  },
  { title: "학과 내규", href: "/regulations" },
  { title: "인재풀 등록", href: "/talent-pool" },
  {
    title: "자료",
    href: "https://drive.google.com/drive/folders/1WoLoXcT7wRbpyxldRxXyyMKYTuZR0k4L?usp=drive_link",
    external: true,
  },
];

export default function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignupClick = () => (onSignupClick ? onSignupClick() : onLoginClick());

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,35,64,0.05)]">
      <div className="hidden border-b border-slate-200 bg-slate-50 md:block">
        <div className="mx-auto flex h-8 max-w-[1200px] items-center justify-end gap-5 px-8 text-xs font-semibold text-slate-600 lg:px-10">
          <button type="button" onClick={handleSignupClick} className="transition-colors hover:text-[#2156D9]" data-testid="button-signup">회원가입</button>
          <button type="button" onClick={onLoginClick} className="transition-colors hover:text-[#2156D9]" data-testid="button-login">로그인</button>
          <a href="/#site-menu" className="transition-colors hover:text-[#2156D9]">사이트맵</a>
        </div>
      </div>

      <div className="mx-auto flex h-[78px] max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:h-[84px] lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3 lg:gap-4" data-testid="link-home">
          <img src={dkuLogo} alt="단국대학교" className="h-9 w-auto shrink-0 object-contain sm:h-10" />
          <span className="hidden h-9 w-px bg-slate-300 sm:block" aria-hidden="true" />
          <span className="hidden min-w-0 sm:block">
            <span className="block text-[11px] font-bold tracking-[0.13em] text-[#2156D9]">일반대학원</span>
            <span className="mt-0.5 block whitespace-nowrap text-[15px] font-extrabold tracking-[-0.02em] text-slate-900 lg:text-base">데이터지식서비스공학과</span>
          </span>
        </Link>

        <nav className="hidden items-stretch self-stretch xl:flex" aria-label="주요 메뉴">
          {navItems.map((item) => {
            const active = item.children ? location.startsWith(item.href) : location === item.href;
            const baseClass = `relative flex h-full items-center border-b-[3px] px-4 pt-[3px] text-[15px] font-bold transition-colors ${active ? "border-[#2156D9] text-[#2156D9]" : "border-transparent text-slate-700 hover:border-slate-300 hover:text-[#2156D9]"}`;

            if (item.children) {
              return (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={baseClass} data-testid={`nav-${item.title}`}>
                      {item.title}<ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52 rounded-md border-slate-200 p-2 shadow-xl">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.title} asChild className="rounded-sm py-2.5">
                        <Link href={child.href} className="cursor-pointer font-medium" data-testid={`nav-${child.title}`}>{child.title}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (item.external) {
              return <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={baseClass} data-testid={`nav-${item.title}`}>{item.title}</a>;
            }

            return <Link key={item.title} href={item.href} className={baseClass} data-testid={`nav-${item.title}`}>{item.title}</Link>;
          })}
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="xl:hidden">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-md border-slate-300" data-testid="button-menu" aria-label="전체 메뉴 열기">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-6">
            <div className="mt-3 border-b border-slate-200 pb-6">
              <img src={dkuLogo} alt="단국대학교" className="h-9 w-auto" />
              <p className="mt-3 text-sm font-extrabold text-slate-800">일반대학원 데이터지식서비스공학과</p>
            </div>

            <nav className="mt-5 flex flex-col" aria-label="모바일 주요 메뉴">
              {navItems.map((item) => (
                <div key={item.title} className="border-b border-slate-100 py-1">
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="block px-2 py-3 text-base font-bold text-slate-800" data-testid={`mobile-nav-${item.title}`}>{item.title}</a>
                  ) : (
                    <Link href={item.href} onClick={() => setMobileOpen(false)} className={`block px-2 py-3 text-base font-bold ${location === item.href ? "text-[#2156D9]" : "text-slate-800"}`} data-testid={`mobile-nav-${item.title}`}>{item.title}</Link>
                  )}
                  {item.children && (
                    <div className="mb-2 grid grid-cols-2 gap-1 rounded-md bg-slate-50 p-2">
                      {item.children.map((child) => (
                        <Link key={child.title} href={child.href} onClick={() => setMobileOpen(false)} className="rounded-sm px-2 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-[#2156D9]" data-testid={`mobile-nav-${child.title}`}>{child.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11 rounded-md font-bold" onClick={() => { setMobileOpen(false); handleSignupClick(); }}>
                <UserPlus className="mr-2 h-4 w-4" />회원가입
              </Button>
              <Button className="h-11 rounded-md bg-[#2156D9] font-bold hover:bg-[#1848bc]" onClick={() => { setMobileOpen(false); onLoginClick(); }}>
                <LogIn className="mr-2 h-4 w-4" />로그인
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
