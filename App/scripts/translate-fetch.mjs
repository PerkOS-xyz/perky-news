#!/usr/bin/env node
/**
 * Translate new articles using direct Anthropic API calls
 */

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not set in environment');
  process.exit(1);
}

const LANGUAGES = {
  es: 'Spanish',
  fr: 'French', 
  it: 'Italian',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)'
};

const NEW_ARTICLE_SLUGS = [
  'what-are-ai-agents-beginners-guide',
  'agent-economy-transform-work-2030',
  'ai-agents-vs-chatbots-key-differences',
  'how-to-choose-first-ai-agent-platform',
  'future-personal-ai-digital-twin'
];

async function translateText(text, langName, context = '') {
  if (!text || text.trim() === '') return '';
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `Translate to ${langName}. Keep markdown formatting, technical terms (AI agents, LLM, API, etc.), and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation, no explanations.`
      }]
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API: ${response.status} - ${err.substring(0, 100)}`);
  }
  
  const data = await response.json();
  return data.content[0].text.trim();
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
      title[langCode] = await translateText(titleEn, langName, 'article title - keep concise');
      await new Promise(r => setTimeout(r, 300));
      
      if (excerptEn) {
        excerpt[langCode] = await translateText(excerptEn, langName, 'article excerpt');
        await new Promise(r => setTimeout(r, 300));
      }
      
      content[langCode] = await translateText(contentEn, langName, 'technical article about AI agents');
      
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
  
  const saPath = process.env.HOME + '/.config/firebase/perky-news-sa.json';
  if (existsSync(saPath)) {
    const sa = JSON.parse(readFileSync(saPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    console.log(`✓ Firebase initialized`);
    return;
  }
  
  console.error('❌ Firebase service account not found');
  process.exit(1);
}

async function main() {
  console.log('🔑 API Key found:', ANTHROPIC_API_KEY.substring(0, 10) + '...');
  
  initFirebase();
  const db = admin.firestore();
  
  console.log(`\n📚 Translating ${NEW_ARTICLE_SLUGS.length} new articles\n`);
  
  let count = 0;
  for (const slug of NEW_ARTICLE_SLUGS) {
    count++;
    console.log(`\n[${count}/${NEW_ARTICLE_SLUGS.length}] ${slug}`);
    
    const doc = await db.collection('articles').doc(slug).get();
    if (!doc.exists) {
      console.log(`   ⚠️ Article not found`);
      continue;
    }
    
    const article = { slug: doc.id, ...doc.data() };
    const translated = await translateArticle(article);
    
    await db.collection('articles').doc(slug).update({
      title: translated.title,
      excerpt: translated.excerpt,
      content: translated.content,
      translatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Saved ${slug}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n🎉 All translations complete!');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
