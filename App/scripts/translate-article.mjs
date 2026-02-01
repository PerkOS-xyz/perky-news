#!/usr/bin/env node
/**
 * Translate Article Content via OpenRouter
 * 
 * Usage:
 *   node translate-article.mjs --all              Translate ALL articles in Firebase
 *   node translate-article.mjs --slug <slug>      Translate specific article
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
        content: `Translate to ${langName}. Keep markdown formatting, technical terms (x402, ERC-8004, A2A, etc.), and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation, no explanations.`
      }]
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} - ${err}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function translateArticle(article) {
  const titleEn = typeof article.title === 'string' ? article.title : article.title?.en || '';
  const excerptEn = typeof article.excerpt === 'string' ? article.excerpt : article.excerpt?.en || '';
  const contentEn = typeof article.content === 'string' ? article.content : article.content?.en || '';
  
  console.error(`\n🌐 Translating: ${titleEn}`);
  
  const title = { en: titleEn };
  const excerpt = { en: excerptEn };
  const content = { en: contentEn };
  
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    process.stdout.write(`   → ${langName}...`);
    
    try {
      title[langCode] = await translateText(titleEn, langName, 'article title');
      await new Promise(r => setTimeout(r, 200));
      
      excerpt[langCode] = await translateText(excerptEn, langName, 'article excerpt');
      await new Promise(r => setTimeout(r, 200));
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about blockchain/AI');
      
      console.error(' ✓');
    } catch (err) {
      console.error(` ✗ (${err.message})`);
      title[langCode] = titleEn;
      excerpt[langCode] = excerptEn;
      content[langCode] = contentEn;
    }
    
    await new Promise(r => setTimeout(r, 500));
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
      return;
    }
  }
  
  console.error('❌ Firebase service account not found');
  process.exit(1);
}

async function translateAllArticles() {
  initFirebase();
  const db = admin.firestore();
  
  const snapshot = await db.collection('articles').get();
  console.error(`\n📚 Found ${snapshot.size} articles to translate\n`);
  
  for (const doc of snapshot.docs) {
    const article = { slug: doc.id, ...doc.data() };
    
    // Skip if already translated
    if (typeof article.title === 'object' && article.title.es) {
      console.error(`⏭️  Skipping ${doc.id} (already translated)`);
      continue;
    }
    
    const translated = await translateArticle(article);
    
    await db.collection('articles').doc(doc.id).update({
      title: translated.title,
      excerpt: translated.excerpt,
      content: translated.content,
      translatedAt: new Date().toISOString()
    });
    
    console.error(`✅ Updated ${doc.id}\n`);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.error('\n🎉 All articles translated!');
}

async function translateOne(slug) {
  initFirebase();
  const db = admin.firestore();
  
  const doc = await db.collection('articles').doc(slug).get();
  if (!doc.exists) {
    console.error(`❌ Article not found: ${slug}`);
    process.exit(1);
  }
  
  const article = { slug: doc.id, ...doc.data() };
  const translated = await translateArticle(article);
  
  await db.collection('articles').doc(slug).update({
    title: translated.title,
    excerpt: translated.excerpt,
    content: translated.content,
    translatedAt: new Date().toISOString()
  });
  
  console.error(`\n✅ Updated ${slug}`);
}

// Main
const args = process.argv.slice(2);

if (args[0] === '--all') {
  translateAllArticles().catch(e => { console.error('❌', e.message); process.exit(1); });
} else if (args[0] === '--slug' && args[1]) {
  translateOne(args[1]).catch(e => { console.error('❌', e.message); process.exit(1); });
} else {
  console.error(`
🌐 Translate Articles - Perky News (OpenRouter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  node translate-article.mjs --all              Translate all articles
  node translate-article.mjs --slug <slug>      Translate one article
`);
}
