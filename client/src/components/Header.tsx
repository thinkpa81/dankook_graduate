import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onLoginClick: () => void;
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
    ]
  },
  { title: "학과 내규", href: "/regulations" },
  { title: "인재풀 등록", href: "/talent-pool" },
];

export default function Header({ onLoginClick }: HeaderProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DK</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground font-medium">단국대학교 일반대학원</p>
              <p className="font-bold text-foreground text-lg leading-tight">데이터지식서비스공학과</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`font-medium px-4 ${location.startsWith(item.href) ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                      data-testid={`nav-${item.title}`}
                    >
                      {item.title}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.title} asChild>
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
              ) : (
                <Button 
                  key={item.title}
                  variant="ghost" 
                  asChild
                  className={`font-medium px-4 ${location === item.href ? 'text-primary bg-primary/5' : 'text-foreground'}`}
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
              size="sm" 
              onClick={onLoginClick}
              className="hidden sm:flex font-medium"
              data-testid="button-login"
            >
              <LogIn className="w-4 h-4 mr-2" />
              로그인
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onLoginClick}
              className="sm:hidden"
              data-testid="button-login-mobile"
            >
              <User className="w-5 h-5" />
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-8 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      <Link 
                        href={item.href} 
                        onClick={() => setMobileOpen(false)}
                        data-testid={`mobile-nav-${item.title}`}
                      >
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start font-medium text-lg ${location === item.href ? 'text-primary bg-primary/5' : ''}`}
                        >
                          {item.title}
                        </Button>
                      </Link>
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
                                className="w-full justify-start text-muted-foreground"
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}