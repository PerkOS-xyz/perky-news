import { db } from './firebase/config';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';

export type Category = 'x402' | 'erc-8004' | 'ai-agents' | 'openclaw' | 'eliza' | 'defi' | 'hackathons' | 'general';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: Category;
  tags: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
  sources?: { name: string; url: string }[];
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

// Fetch all articles from Firebase
export async function getArticles(category?: Category): Promise<Article[]> {
  try {
    let q;
    if (category) {
      q = query(
        collection(db, 'articles'),
        where('category', '==', category),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'articles'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      slug: d.id,
      ...d.data()
    } as Article));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        slug: docSnap.id,
        ...docSnap.data()
      } as Article;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching article:', error);
    return undefined;
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const q = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      slug: d.id,
      ...d.data()
    } as Article));
  } catch (error) {
    console.error('Error fetching featured:', error);
    return [];
  }
}

export function getAllCategories(): Category[] {
  return ['x402', 'erc-8004', 'ai-agents', 'openclaw', 'eliza', 'defi', 'hackathons', 'general'];
}
