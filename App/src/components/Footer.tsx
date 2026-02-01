import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0E0716] text-white py-8 mt-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/perky-mascot.jpg" 
              alt="Perky" 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm">
              © 2026 <span className="text-[#EB1B69]">Perky News</span>. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/subscribe" className="hover:text-white">Subscribe</Link>
            <span>Part of the PerkOS ecosystem</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
