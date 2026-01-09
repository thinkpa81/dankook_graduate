import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ChevronDown, LogIn, UserPlus } from "lucide-react";
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
      { title: "국내 학술대회", href: "/papers/domestic-conference" },
      { title: "해외 학술대회", href: "/papers/international-conference" },
      { title: "국내 저널", href: "/papers/domestic-journal" },
      { title: "해외 저널", href: "/papers/international-journal" },
      { title: "본 저널", href: "/papers/main-journal" },
      { title: "논문리뷰", href: "/papers/paper-review" },
    ]
  },
  { title: "학과 내규", href: "/regulations" },
  { title: "인재풀 등록", href: "/talent-pool" },
  { title: "자료", href: "https://drive.google.com/drive/folders/1WoLoXcT7wRbpyxldRxXyyMKYTuZR0k4L?usp=drive_link", external: true },
];

export default function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    } else {
      onLoginClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4" data-testid="link-home">
            <img 
              src={dkuLogo} 
              alt="단국대학교" 
              className="h-10 lg:h-11 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-xs text-primary font-semibold tracking-wide">일반대학원</p>
                <p className="font-bold text-gray-900 text-base lg:text-lg leading-tight">데이터지식서비스공학과</p>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-base ${location.startsWith(item.href) ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                      data-testid={`nav-${item.title}`}
                    >
                      {item.title}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 rounded-xl shadow-lg border border-gray-100">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.title} asChild className="rounded-lg">
                        <Link 
                          href={child.href} 
                          className="cursor-pointer"
                          data-testid={`nav-${child.title}`}
                        >
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (item as any).external ? (
                <Button 
                  key={item.title}
                  variant="ghost" 
                  asChild
                  className="font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-base text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <a href={item.href} target="_blank" rel="noopener noreferrer" data-testid={`nav-${item.title}`}>
                    {item.title}
                  </a>
                </Button>
              ) : (
                <Button 
                  key={item.title}
                  variant="ghost" 
                  asChild
                  className={`font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-base ${location === item.href ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                >
                  <Link href={item.href} data-testid={`nav-${item.title}`}>
                    {item.title}
                  </Link>
                </Button>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={handleSignupClick}
              className="hidden sm:flex font-semibold px-5 rounded-lg h-10 text-base"
              data-testid="button-signup"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              가입하기
            </Button>
            <Button 
              onClick={onLoginClick}
              className="hidden sm:flex font-semibold px-6 rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 h-10 text-base"
              data-testid="button-login"
            >
              <LogIn className="w-4 h-4 mr-2" />
              로그인
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-lg" data-testid="button-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center gap-3 mb-8 mt-4">
                  <img src={dkuLogo} alt="단국대학교" className="h-9 w-auto" />
                </div>
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {(item as any).external ? (
                        <a 
                          href={item.href} 
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          data-testid={`mobile-nav-${item.title}`}
                        >
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start font-semibold text-lg rounded-xl"
                          >
                            {item.title}
                          </Button>
                        </a>
                      ) : (
                        <Link 
                          href={item.href} 
                          onClick={() => setMobileOpen(false)}
                          data-testid={`mobile-nav-${item.title}`}
                        >
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start font-semibold text-lg rounded-xl ${location === item.href ? 'text-primary bg-primary/5' : ''}`}
                          >
                            {item.title}
                          </Button>
                        </Link>
                      )}
                      {item.children && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {item.children.map((child) => (
                            <Link 
                              key={child.title} 
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              data-testid={`mobile-nav-${child.title}`}
                            >
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-start text-muted-foreground rounded-lg"
                              >
                                {child.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignupClick();
                    }}
                    className="w-full font-semibold rounded-lg h-11 text-base"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    가입하기
                  </Button>
                  <Button 
                    onClick={() => {
                      setMobileOpen(false);
                      onLoginClick();
                    }}
                    className="w-full font-semibold rounded-lg bg-gradient-to-r from-primary to-blue-600 h-11 text-base"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    로그인
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}