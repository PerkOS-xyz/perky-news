'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/perkos-logo.jpg" 
              alt="PerkOS" 
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <span className="text-xl font-bold text-[#0E0716]">
                Perky <span className="text-[#EB1B69]">News</span>
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#EB1B69]">
              News
            </Link>
            <Link href="/articles" className="text-sm font-medium text-gray-600 hover:text-[#EB1B69]">
              Articles
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-[#EB1B69]">
              About
            </Link>
          </nav>

          {/* Subscribe Button */}
          <Link 
            href="/subscribe"
            className="px-4 py-2 bg-[#EB1B69] text-white text-sm font-semibold rounded-lg hover:bg-[#d01860] transition-colors"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}
