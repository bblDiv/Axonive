"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" viewBox="0 0 256 256" fill="none">
                <circle cx="128" cy="128" r="90" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="16 16" opacity="0.4" />
                <path d="M 128,128 L 128,38 M 128,128 L 213,90 M 128,128 L 180,210 M 128,128 L 76,210 M 128,128 L 43,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                <path d="M 128,38 Q 170.5,64 213,90 M 213,90 Q 196.5,150 180,210 M 180,210 Q 128,210 76,210 M 76,210 Q 59.5,150 43,90 M 43,90 Q 85.5,64 128,38" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="8,8" opacity="0.5" />
                <circle cx="128" cy="128" r="32" fill="currentColor" />
                <circle cx="128" cy="38" r="20" fill="currentColor" />
                <circle cx="213" cy="90" r="20" fill="currentColor" />
                <circle cx="180" cy="210" r="20" fill="currentColor" />
                <circle cx="76" cy="210" r="20" fill="currentColor" />
                <circle cx="43" cy="90" r="20" fill="currentColor" />
              </svg>
            </div>
            <span className="text-2xl font-serif font-semibold text-navy-deep tracking-[-0.02em]">Axonive</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              How It Works
            </a>
            <Link
              href="/axonive"
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                isActive('/axonive')
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-pink-600 text-white hover:bg-pink-700 shadow-sm hover:shadow-md'
              }`}
            >
              Try Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-navy-deep">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
