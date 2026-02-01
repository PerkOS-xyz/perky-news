// Client SDK approach for Netlify compatibility
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { LanguageCode } from './i18n/translations';

export type Category = 'x402' | 'erc-8004' | 'ai-agents' | 'openclaw' | 'eliza' | 'defi' | 'hackathons' | 'general';

type MultiLangContent = { en: string; es?: string; fr?: string; it?: string; de?: string; ja?: string; ko?: string; zh?: string; };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: Category;
  tags: string[];
  author: string;
  authorEmail?: string;
  authorBio?: string;
  authorAvatar?: string;
  publishedAt: string;
  featured: boolean;
  sources?: { name: string; url: string }[];
  readingTime?: number;
}

interface ArticleRaw {
  slug: string;
  title: MultiLangContent | string;
  excerpt: MultiLangContent | string;
  content: MultiLangContent | string;
  coverImage?: string;
  category: Category;
  tags: string[];
  author: string;
  authorEmail?: string;
  authorBio?: string;
  authorAvatar?: string;
  publishedAt: string;
  featured: boolean;
  sources?: { name: string; url: string }[];
  readingTime?: number;
}

export const categoryLabels: Record<Category, string> = {
  'x402': 'x402 Protocol',
  'erc-8004': 'ERC-8004',
  'ai-agents': 'AI Agents',
  'openclaw': 'OpenClaw',
  'eliza': 'ElizaOS',
  'defi': 'DeFi',
  'hackathons': 'Hackathons',
  'general': 'General',
};

export const categoryColors: Record<Category, string> = {
  'x402': 'bg-purple-100 text-purple-800',
  'erc-8004': 'bg-blue-100 text-blue-800',
  'ai-agents': 'bg-green-100 text-green-800',
  'openclaw': 'bg-orange-100 text-orange-800',
  'eliza': 'bg-pink-100 text-pink-800',
  'defi': 'bg-yellow-100 text-yellow-800',
  'hackathons': 'bg-cyan-100 text-cyan-800',
  'general': 'bg-gray-100 text-gray-800',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

function getLocalizedField(field: MultiLangContent | string | undefined, lang: LanguageCode): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.en || '';
}

function localizeArticle(raw: ArticleRaw, lang: LanguageCode): Article {
  return {
    slug: raw.slug,
    title: getLocalizedField(raw.title, lang),
    excerpt: getLocalizedField(raw.excerpt, lang),
    content: getLocalizedField(raw.content, lang),
    coverImage: raw.coverImage,
    category: raw.category,
    tags: raw.tags || [],
    author: raw.author,
    authorEmail: raw.authorEmail,
    authorBio: raw.authorBio,
    authorAvatar: raw.authorAvatar,
    publishedAt: raw.publishedAt,
    featured: raw.featured,
    sources: raw.sources,
    readingTime: raw.readingTime,
  };
}

export async function getArticles(category?: Category, lang: LanguageCode = 'en'): Promise<Article[]> {
  try {
    const db = getDb();
    let q;
    if (category) {
      q = query(collection(db, 'articles'), where('category', '==', category), where('status', '==', 'published'), orderBy('publishedAt', 'desc'));
    } else {
      q = query(collection(db, 'articles'), where('status', '==', 'published'), orderBy('publishedAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => localizeArticle({ slug: d.id, ...d.data() } as ArticleRaw, lang));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string, lang: LanguageCode = 'en'): Promise<Article | undefined> {
  try {
    const db = getDb();
    const docSnap = await getDoc(doc(db, 'articles', slug));
    if (docSnap.exists()) {
      return localizeArticle({ slug: docSnap.id, ...docSnap.data() } as ArticleRaw, lang);
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching article:', error);
    return undefined;
  }
}

export async function getFeaturedArticles(lang: LanguageCode = 'en'): Promise<Article[]> {
  try {
    const db = getDb();
    const q = query(collection(db, 'articles'), where('status', '==', 'published'), where('featured', '==', true), orderBy('publishedAt', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => localizeArticle({ slug: d.id, ...d.data() } as ArticleRaw, lang));
  } catch (error) {
    console.error('Error fetching featured:', error);
    return [];
  }
}

export function getAllCategories(): Category[] {
  return ['x402', 'erc-8004', 'ai-agents', 'openclaw', 'eliza', 'defi', 'hackathons', 'general'];
}
