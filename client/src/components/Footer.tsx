import { Link } from "wouter";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">DK</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">단국대학교 일반대학원</p>
                <p className="font-bold text-white text-lg">데이터지식서비스공학과</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              데이터 관리 및 분석 기술과 비즈니스 마인드를 기반으로 
              사회 전 분야에 융합 적용이 가능한 미래 인재를 양성합니다.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>경기도 용인시 수지구 죽전로 152 단국대학교</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>031-8005-2000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>grad@dankook.ac.kr</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors" data-testid="footer-link-about">
                  학과 소개
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-white transition-colors" data-testid="footer-link-notices">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/papers" className="hover:text-white transition-colors" data-testid="footer-link-papers">
                  논문
                </Link>
              </li>
              <li>
                <Link href="/regulations" className="hover:text-white transition-colors" data-testid="footer-link-regulations">
                  학과 내규
                </Link>
              </li>
              <li>
                <Link href="/talent-pool" className="hover:text-white transition-colors" data-testid="footer-link-talent">
                  인재풀 등록
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">관련 사이트</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.dankook.ac.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                  data-testid="footer-link-dankook"
                >
                  단국대학교 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://grad.dankook.ac.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                  data-testid="footer-link-grad"
                >
                  일반대학원 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors" data-testid="footer-link-privacy">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2024 단국대학교 일반대학원 데이터지식서비스공학과. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors" data-testid="footer-privacy">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}