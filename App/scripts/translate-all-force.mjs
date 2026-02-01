#!/usr/bin/env node
/**
 * Force translate ALL articles (ignores existing translations)
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
        content: `Translate to ${langName}. Keep markdown formatting, technical terms (x402, ERC-8004, A2A, MCP, etc.), and proper nouns unchanged.
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
  // Get English content (handle both string and object formats)
  const titleEn = typeof article.title === 'string' ? article.title : article.title?.en || '';
  const excerptEn = typeof article.excerpt === 'string' ? article.excerpt : article.excerpt?.en || '';
  const contentEn = typeof article.content === 'string' ? article.content : article.content?.en || '';
  
  console.error(`\n🌐 Translating: ${titleEn.substring(0, 60)}...`);
  
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
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about blockchain and AI agents');
      
      console.error(' ✓');
    } catch (err) {
      console.error(` ✗ (${err.message})`);
      // Keep English as fallback
      title[langCode] = titleEn;
      excerpt[langCode] = excerptEn;
      content[langCode] = contentEn;
    }
    
    // Rate limit protection
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
      console.error(`✓ Firebase initialized from ${p}`);
      return;
    }
  }
  
  console.error('❌ Firebase service account not found');
  process.exit(1);
}

async function main() {
  initFirebase();
  const db = admin.firestore();
  
  const snapshot = await db.collection('articles').get();
  console.error(`\n📚 Found ${snapshot.size} articles to translate\n`);
  
  let count = 0;
  for (const doc of snapshot.docs) {
    const article = { slug: doc.id, ...doc.data() };
    count++;
    
    console.error(`\n[${count}/${snapshot.size}] ${doc.id}`);
    
    const translated = await translateArticle(article);
    
    await db.collection('articles').doc(doc.id).update({
      title: translated.title,
      excerpt: translated.excerpt,
      content: translated.content,
      translatedAt: new Date().toISOString()
    });
    
    console.error(`✅ Updated ${doc.id}`);
    
    // Pause between articles
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.error('\n🎉 All articles translated!');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
