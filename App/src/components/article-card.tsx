'use client';

import Link from 'next/link';
import { type Article, categoryLabels, type Category } from '@/lib/articles';
import { useLanguage } from '@/lib/i18n';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const categoryClasses: Record<Category, string> = {
  'x402': 'cat-x402',
  'erc-8004': 'cat-erc-8004',
  'ai-agents': 'cat-ai-agents',
  'openclaw': 'cat-openclaw',
  'eliza': 'cat-eliza',
  'defi': 'cat-defi',
  'general': 'cat-general',
  'hackathons': 'cat-hackathons',
};

const categoryIcons: Record<Category, string> = {
  'x402': '💰',
  'erc-8004': '🔐',
  'ai-agents': '🤖',
  'openclaw': '🦊',
  'eliza': '💜',
  'defi': '📈',
  'general': '📰',
  'hackathons': '🏆',
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { language } = useLanguage();
  const articleUrl = `/${language}/articles/${article.slug}`;

  if (featured) {
    return (
      <Link href={articleUrl} className="group block">
        <article className="relative rounded-3xl overflow-hidden bg-[#1B1833]/50 border border-[#2d2548] hover:border-[#EB1B69]/30 transition-all duration-500 hover-lift">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Image */}
            <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EB1B69]/20 via-[#EF5B57]/10 to-[#FD8F50]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-40 transform group-hover:scale-110 transition-transform duration-500">
                  {categoryIcons[article.category]}
                </span>
              </div>
              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <span className="badge-featured">Featured</span>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3 p-8 flex flex-col justify-center">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`tag px-3 py-1 rounded-full ${categoryClasses[article.category]}`}>
                  {categoryLabels[article.category]}
                </span>
                <span className="text-xs text-[#666]">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>

              {/* Title */}
              <h3 
                className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#EB1B69] transition-colors"
                style={{ fontFamily: 'var(--font-sora), system-ui, sans-serif' }}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-[#a3a3a3] mb-6 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666]">By {article.author}</span>
                <span className="flex items-center gap-2 text-sm font-medium text-[#EB1B69] group-hover:gap-3 transition-all">
                  Read article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={articleUrl} className="group block h-full">
      <article className="h-full rounded-2xl overflow-hidden bg-[#1B1833]/50 border border-[#2d2548] hover:border-[#EB1B69]/30 transition-all duration-300 hover-lift flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EB1B69]/20 via-[#EF5B57]/10 to-[#FD8F50]/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-40 transform group-hover:scale-110 transition-transform duration-500">
              {categoryIcons[article.category]}
            </span>
          </div>
          {article.featured && (
            <div className="absolute top-3 left-3">
              <span className="badge-featured">Featured</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`tag px-2.5 py-1 rounded-full text-[10px] ${categoryClasses[article.category]}`}>
              {categoryLabels[article.category]}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-[#EB1B69] transition-colors"
            style={{ fontFamily: 'var(--font-sora), system-ui, sans-serif' }}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-[#a3a3a3] text-sm mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2d2548]/50">
            <span className="text-xs text-[#666]">{article.author}</span>
            <span className="text-xs text-[#666]">
              {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
