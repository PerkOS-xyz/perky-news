#!/usr/bin/env node
/**
 * Translate the 5 DeFi articles
 */

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

const LANGUAGES = {
  es: 'Spanish',
  fr: 'French', 
  it: 'Italian',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)'
};

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

const SLUGS = [
  'ai-meets-defi-agents-revolutionizing-trading',
  'automated-yield-farming-ai-optimize-returns',
  'ai-powered-portfolio-management-crypto',
  'mev-protection-ai-agents-shield-transactions',
  'defi-risk-management-ai-tools-traders'
];

async function translateText(text, langName, context = '') {
  if (!text || text.trim() === '') return '';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://perky.news',
      'X-Title': 'Perky News Translator'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `Translate to ${langName}. Keep markdown formatting, technical terms (DeFi, AI, MEV, APY, TVL, etc.), and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation, no explanations.`
      }]
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function translateArticle(article) {
  const titleEn = typeof article.title === 'string' ? article.title : article.title?.en || '';
  const excerptEn = typeof article.excerpt === 'string' ? article.excerpt : article.excerpt?.en || '';
  const contentEn = typeof article.content === 'string' ? article.content : article.content?.en || '';
  
  console.log(`\n🌐 Translating: ${titleEn.substring(0, 60)}...`);
  
  const title = { en: titleEn };
  const excerpt = { en: excerptEn };
  const content = { en: contentEn };
  
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    process.stdout.write(`   → ${langName}...`);
    
    try {
      title[langCode] = await translateText(titleEn, langName, 'article title - keep it concise');
      await new Promise(r => setTimeout(r, 300));
      
      if (excerptEn) {
        excerpt[langCode] = await translateText(excerptEn, langName, 'article excerpt/summary');
        await new Promise(r => setTimeout(r, 300));
      }
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about DeFi and AI');
      
      console.log(' ✓');
    } catch (err) {
      console.log(` ✗ (${err.message})`);
      title[langCode] = titleEn;
      excerpt[langCode] = excerptEn;
      content[langCode] = contentEn;
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
  
  return { title, excerpt, content };
}

function initFirebase() {
  if (admin.apps.length) return;
  
  const paths = [
    process.env.FIREBASE_SA_PATH,
    process.env.HOME + '/.config/firebase/perky-news-sa.json',
    '/root/.config/firebase/perky-news-sa.json'
  ].filter(Boolean);
  
  for (const p of paths) {
    if (existsSync(p)) {
      const sa = JSON.parse(readFileSync(p, 'utf8'));
      admin.initializeApp({ credential: admin.credential.cert(sa) });
      console.log(`✓ Firebase initialized`);
      return;
    }
  }
  
  console.error('❌ Firebase service account not found');
  process.exit(1);
}

async function main() {
  initFirebase();
  const db = admin.firestore();
  
  console.log(`\n📚 Translating ${SLUGS.length} DeFi articles\n`);
  
  let count = 0;
  for (const slug of SLUGS) {
    count++;
    console.log(`\n[${count}/${SLUGS.length}] ${slug}`);
    
    const doc = await db.collection('articles').doc(slug).get();
    if (!doc.exists) {
      console.log(`   ⚠️  Not found, skipping`);
      continue;
    }
    
    const article = { slug, ...doc.data() };
    const translated = await translateArticle(article);
    
    await db.collection('articles').doc(slug).update({
      title: translated.title,
      excerpt: translated.excerpt,
      content: translated.content,
      translatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Updated ${slug}`);
    
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n🎉 All DeFi articles translated!');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
