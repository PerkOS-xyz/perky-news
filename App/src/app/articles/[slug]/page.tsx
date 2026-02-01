import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getArticleBySlug, getArticles, categoryLabels } from '@/lib/articles';
import { LanguageCode } from '@/lib/i18n/translations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('perky-lang');
  const lang = (langCookie?.value as LanguageCode) || 'en';
  const article = await getArticleBySlug(slug, lang);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E0716] to-[#1a1a2e] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <Link href="/" className="text-white/70 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Link href={`/category/${article.category}`}>
              <span className="text-xs font-semibold text-[#EB1B69] uppercase tracking-wide bg-white/10 px-3 py-1 rounded-full">
                {categoryLabels[article.category] || article.category}
              </span>
            </Link>
            <span className="text-white/50 text-sm">{article.publishedAt}</span>
            {article.readingTime && (
              <span className="text-white/50 text-sm">• {article.readingTime} min read</span>
            )}
          </div>
          <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>
          <p className="text-white/80 mt-4 text-lg">{article.excerpt}</p>
          
          {/* Author */}
          <div className="flex items-center gap-3 mt-6">
            <img 
              src={article.authorAvatar || '/perky-mascot.jpg'} 
              alt={article.author}
              className="w-12 h-12 rounded-full border-2 border-[#EB1B69]"
            />
            <div>
              <p className="font-semibold">{article.author}</p>
              {article.authorEmail && (
                <p className="text-white/60 text-sm">{article.authorEmail}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="container mx-auto max-w-4xl px-4 -mt-6">
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <div 
          className="prose prose-lg max-w-none prose-headings:text-[#0E0716] prose-a:text-[#EB1B69] prose-strong:text-[#0E0716]"
          dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
        />

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-lg mb-4">Sources</h3>
            <ul className="space-y-2">
              {article.sources.map((source, i) => (
                <li key={i}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EB1B69] hover:underline"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio */}
        {article.authorBio && (
          <div className="mt-12 p-6 bg-gradient-to-r from-[#EB1B69]/10 to-[#FD8F50]/10 rounded-lg">
            <div className="flex items-start gap-4">
              <img 
                src={article.authorAvatar || '/perky-mascot.jpg'} 
                alt={article.author}
                className="w-16 h-16 rounded-full border-2 border-[#EB1B69]"
              />
              <div>
                <h4 className="font-bold text-lg">About {article.author}</h4>
                <p className="text-gray-600 mt-2">{article.authorBio}</p>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function formatContent(content: string): string {
  let html = content;
  
  // Code blocks first (protect from other replacements)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-[#EB1B69] px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Tables
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
    const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">${h.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="border border-gray-300 px-4 py-2">${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table class="w-full border-collapse my-6"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });
  
  // Headings (FIXED: added $1 capture)
  html = html.replace(/^### (.*)$/gm, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');
  
  // Bold and italic (FIXED: added $1 capture)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Links (FIXED: added $1 and $2 captures)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#EB1B69] hover:underline">$1</a>');
  
  // Numbered lists
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  
  // Bullet lists (FIXED: added $1 capture)
  html = html.replace(/^[-*]\s+(.*)$/gm, '<li class="ml-4">$1</li>');
  
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-200">');
  
  // Wrap li in ul/ol
  const lines = html.split('\n');
  let inList = false;
  let listType = 'ul';
  const processed: string[] = [];
  
  for (const line of lines) {
    const isListItem = line.includes('<li');
    const isNumbered = line.includes('list-decimal');
    
    if (isListItem) {
      if (!inList) {
        listType = isNumbered ? 'ol' : 'ul';
        const listClass = isNumbered ? 'list-decimal' : 'list-disc';
        processed.push(`<${listType} class="${listClass} my-4 pl-6 space-y-1">`);
        inList = true;
      }
      processed.push(line.replace(' list-decimal', ''));
    } else {
      if (inList) {
        processed.push(`</${listType}>`);
        inList = false;
      }
      processed.push(line);
    }
  }
  if (inList) processed.push(`</${listType}>`);
  
  html = processed.join('\n');
  
  // Paragraphs (wrap non-tagged text)
  html = html.split('\n\n').map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return trimmed;
    return `<p class="my-4">${trimmed}</p>`;
  }).join('\n');
  
  return html;
}
