import { Link } from "wouter";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import dkuLogo from "@assets/image_1767876361912.png";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-14 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src={dkuLogo} alt="단국대학교" className="h-12 w-auto brightness-0 invert" />
              <div className="border-l border-slate-700 pl-4">
                <p className="text-sm text-slate-400">일반대학원</p>
                <p className="font-bold text-white text-lg">데이터지식서비스공학과</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
              데이터 관리 및 분석 기술과 비즈니스 마인드를 기반으로 
              사회 전 분야에 융합 적용이 가능한 미래 인재를 양성합니다.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="pt-1">경기도 용인시 수지구 죽전로 152 단국대학교</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>031-8005-2000</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>grad@dankook.ac.kr</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-lg">바로가기</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-2 group" data-testid="footer-link-about">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  학과 소개
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-white transition-colors flex items-center gap-2 group" data-testid="footer-link-notices">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/papers" className="hover:text-white transition-colors flex items-center gap-2 group" data-testid="footer-link-papers">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  논문
                </Link>
              </li>
              <li>
                <Link href="/regulations" className="hover:text-white transition-colors flex items-center gap-2 group" data-testid="footer-link-regulations">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  학과 내규
                </Link>
              </li>
              <li>
                <Link href="/talent-pool" className="hover:text-white transition-colors flex items-center gap-2 group" data-testid="footer-link-talent">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  인재풀 등록
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-lg">관련 사이트</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://www.dankook.ac.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
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
                  className="hover:text-white transition-colors flex items-center gap-2"
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

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
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