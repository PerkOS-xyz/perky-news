#!/usr/bin/env node
/**
 * Translate OpenClaw articles specifically
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

const OPENCLAW_SLUGS = [
  'what-is-openclaw-ai-assistant-that-actually-does-things',
  'how-to-set-up-openclaw-in-10-minutes',
  '5-things-you-didnt-know-ai-could-do-with-openclaw',
  'openclaw-vs-chatgpt-why-having-agent-changes-everything',
  'building-your-second-brain-with-openclaw'
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
        content: `Translate to ${langName}. Keep markdown formatting, technical terms (OpenClaw, Clawdbot, Claude, Telegram, API, etc.), and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation, no explanations.`
      }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenRouter: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function translateArticle(article) {
  const titleEn = typeof article.title === 'string' ? article.title : article.title?.en || '';
  const excerptEn = typeof article.excerpt === 'string' ? article.excerpt : article.excerpt?.en || '';
  const contentEn = typeof article.content === 'string' ? article.content : article.content?.en || '';
  
  console.log(`\n🌐 Translating: ${titleEn.substring(0, 50)}...`);
  
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
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about OpenClaw AI agent platform');
      
      console.log(' ✓');
    } catch (err) {
      console.log(` ✗ (${err.message})`);
      title[langCode] = titleEn;
      excerpt[langCode] = excerptEn;
      content[langCode] = contentEn;
    }
    
    await new Promise(r => setTimeout(r, 1500));
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
  
  console.log(`\n📚 Translating ${OPENCLAW_SLUGS.length} OpenClaw articles\n`);
  
  let count = 0;
  for (const slug of OPENCLAW_SLUGS) {
    const doc = await db.collection('articles').doc(slug).get();
    if (!doc.exists) {
      console.log(`⚠️  Skipping ${slug} - not found`);
      continue;
    }
    
    count++;
    const article = { slug, ...doc.data() };
    
    console.log(`\n[${count}/${OPENCLAW_SLUGS.length}] ${slug}`);
    
    const translated = await translateArticle(article);
    
    await db.collection('articles').doc(slug).update({
      title: translated.title,
      excerpt: translated.excerpt,
      content: translated.content,
      translatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Updated ${slug}`);
    
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log('\n🎉 All OpenClaw articles translated!');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
