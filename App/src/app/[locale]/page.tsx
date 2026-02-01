import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import { type Locale } from '@/i18n/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const lang = locale as Locale;

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
              <Link key={cat} href={`/${locale}/category/${cat.toLowerCase().replace(' ', '-')}`}
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
                <Link href={`/${locale}/articles/${featured.slug}`} className="block group">
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
                    <Link href={`/${locale}/articles/${article.slug}`} className="shrink-0">
                      <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden">
                        <img src={article.coverImage || '/perkos-logo.jpg'} alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/${locale}/articles/${article.slug}`}>
                        <span className="text-xs font-semibold text-[#EB1B69] uppercase tracking-wide">
                          {article.category.replace('-', ' ')}
                        </span>
                        <h3 className="font-semibold text-[#0E0716] group-hover:text-[#EB1B69] transition-colors line-clamp-2 mt-1">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                        <p className="text-xs text-gray-400 mt-2">{article.publishedAt}</p>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Popular */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-[#0E0716] mb-4 pb-2 border-b border-gray-200">Popular</h3>
              <div className="space-y-4">
                {popular.map((article, index) => (
                  <Link key={article.slug} href={`/${locale}/articles/${article.slug}`} className="flex gap-3 group">
                    <span className="text-2xl font-bold text-gray-300">{index + 1}</span>
                    <div>
                      <span className="text-xs text-[#EB1B69] uppercase">
                        {article.category.replace('-', ' ')}
                      </span>
                      <h4 className="text-sm font-medium text-[#0E0716] group-hover:text-[#EB1B69] transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{article.publishedAt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#EB1B69] to-[#FD8F50] rounded-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-white/90 text-sm mb-4">Get the latest agent economy news delivered to your inbox.</p>
              <Link 
                href={`/${locale}/subscribe`}
                className="block w-full bg-white text-[#EB1B69] font-semibold py-2 px-4 rounded-lg text-center hover:bg-white/90 transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
