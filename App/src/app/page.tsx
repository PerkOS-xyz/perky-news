import Link from 'next/link';
import { cookies } from 'next/headers';
import { getArticles } from '@/lib/articles';
import { LanguageCode } from '@/lib/i18n/translations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('perky-lang');
  const lang = (langCookie?.value as LanguageCode) || 'en';

  const allArticles = await getArticles(undefined, lang);
  const featured = allArticles.find(a => a.featured) || allArticles[0];
  const latest = allArticles.filter(a => a.slug !== featured?.slug).slice(0, 6);
  const popular = allArticles.slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-6 py-3 text-sm overflow-x-auto">
            {['x402', 'ERC-8004', 'AI Agents', 'Hackathons', 'OpenClaw', 'ElizaOS', 'DeFi'].map((cat) => (
              <Link key={cat} href={`/category/${cat.toLowerCase().replace(' ', '-')}`}
                className="text-gray-600 hover:text-[#EB1B69] whitespace-nowrap font-medium transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 lg:w-2/3">
            {featured && (
              <article className="mb-10">
                <Link href={`/articles/${featured.slug}`} className="block group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img src={featured.coverImage || '/perkos-banner.jpg'} alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  </div>
                  <h1 className="text-3xl font-bold text-[#0E0716] group-hover:text-[#EB1B69] transition-colors leading-tight">
                    {featured.title}
                  </h1>
                  <p className="text-gray-600 mt-3 text-lg leading-relaxed">{featured.excerpt}</p>
                </Link>
              </article>
            )}

            <section>
              <h2 className="text-lg font-bold text-[#0E0716] mb-6 pb-2 border-b border-gray-200">Latest News</h2>
              <div className="space-y-6">
                {latest.map((article) => (
                  <article key={article.slug} className="flex gap-4 group">
                    <Link href={`/articles/${article.slug}`} className="shrink-0">
                      <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden">
                        <img src={article.coverImage || '/perkos-logo.jpg'} alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/category/${article.category}`}>
                        <span className="text-xs font-semibold text-[#EB1B69] uppercase tracking-wide">
                          {article.category.replace('-', ' ')}
                        </span>
                      </Link>
                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="font-bold text-[#0E0716] group-hover:text-[#EB1B69] transition-colors mt-1 line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className="lg:w-1/3 lg:pl-8 lg:border-l border-gray-200">
            <section className="mb-8 text-center">
              <img src="/perky-mascot.jpg" alt="Perky" className="w-32 h-32 mx-auto rounded-full border-4 border-[#EB1B69] shadow-lg"/>
              <h3 className="font-bold text-xl text-[#0E0716] mt-4">Meet Perky</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Your friendly guide to the agent economy. Perky curates the latest news on AI agents, Web3 protocols, and the future of autonomous systems.
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EB1B69]/10 text-[#EB1B69]">🤖 AI-Powered</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FD8F50]/10 text-[#FD8F50]">⚡ Always Learning</span>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#EB1B69] mb-4">Most Popular</h2>
              {popular[0] && (
                <Link href={`/articles/${popular[0].slug}`} className="block mb-4 group">
                  <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3">
                    <img src={popular[0].coverImage || '/perkos-banner.jpg'} alt={popular[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  </div>
                  <h3 className="font-bold text-[#0E0716] group-hover:text-[#EB1B69] transition-colors text-sm">
                    {popular[0].title}
                  </h3>
                </Link>
              )}
              <div className="space-y-3">
                {popular.slice(1).map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}
                    className="block text-sm text-gray-700 hover:text-[#EB1B69] transition-colors">
                    {article.title}
                  </Link>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-[#EB1B69] to-[#FD8F50] rounded-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-sm opacity-90 mb-4">Get the latest agent economy news delivered to your inbox.</p>
              <input type="email" placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-white/20 placeholder-white/70 text-white text-sm border border-white/30 mb-3"/>
              <button className="w-full py-2 bg-white text-[#EB1B69] rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
