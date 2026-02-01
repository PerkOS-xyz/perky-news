#!/usr/bin/env node
/**
 * Translate x402 articles using fetch to OpenRouter API
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

const ARTICLE_SLUGS = [
  'x402-tutorial-add-payments-api-15-minutes',
  'micropayments-finally-here-x402-changes-everything',
  'x402-ai-agents-bots-pay-for-services',
  'economics-x402-pricing-strategies-api-developers'
];

// Try multiple API options
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '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';

async function translateText(text, langName, context = '') {
  if (!text || text.trim() === '') return '';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://perky.news',
      'X-Title': 'Perky News Translator'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      max_tokens: 16384,
      messages: [{
        role: 'user',
        content: `Translate to ${langName}. Keep markdown formatting, technical terms (x402, ERC-8004, A2A, MCP, USDC, Base, HTTP, API, etc.), code blocks, and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation, no explanations.`
      }]
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter: ${response.status} - ${err.substring(0, 100)}`);
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
      await new Promise(r => setTimeout(r, 500));
      
      if (excerptEn) {
        excerpt[langCode] = await translateText(excerptEn, langName, 'article excerpt/summary');
        await new Promise(r => setTimeout(r, 500));
      }
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about blockchain, AI agents, and x402 payment protocol');
      
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
      console.log(`✓ Firebase initialized from ${p}`);
      return;
    }
  }
  
  console.error('❌ Firebase service account not found');
  process.exit(1);
}

async function main() {
  initFirebase();
  const db = admin.firestore();
  
  console.log(`\n📚 Translating ${ARTICLE_SLUGS.length} x402 articles\n`);
  
  let count = 0;
  for (const slug of ARTICLE_SLUGS) {
    count++;
    console.log(`\n[${count}/${ARTICLE_SLUGS.length}] ${slug}`);
    
    const doc = await db.collection('articles').doc(slug).get();
    if (!doc.exists) {
      console.log(`   ⚠️ Article not found, skipping`);
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
  
  console.log('\n🎉 All articles translated!');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
