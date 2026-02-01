#!/usr/bin/env node
/**
 * Translate specific x402 articles using Anthropic API
 */

import admin from 'firebase-admin';
import Anthropic from '@anthropic-ai/sdk';
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

const anthropic = new Anthropic();

async function translateText(text, langName, context = '') {
  if (!text || text.trim() === '') return '';
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `Translate to ${langName}. Keep markdown formatting, technical terms (x402, ERC-8004, A2A, MCP, USDC, Base, HTTP, API, etc.), code blocks, and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation, no explanations.`
    }]
  });
  
  return response.content[0].text.trim();
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
      await new Promise(r => setTimeout(r, 200));
      
      if (excerptEn) {
        excerpt[langCode] = await translateText(excerptEn, langName, 'article excerpt/summary');
        await new Promise(r => setTimeout(r, 200));
      }
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about blockchain, AI agents, and x402 payment protocol');
      
      console.log(' ✓');
    } catch (err) {
      console.log(` ✗ (${err.message})`);
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
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n🎉 All articles translated!');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
