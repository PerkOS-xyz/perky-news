#!/usr/bin/env node

/**
 * Translate All Articles Script
 * 
 * Fetches all articles from Firebase and translates any missing languages.
 * Usage: node translate-all-articles.js [--category hackathons]
 * 
 * Requires: FIREBASE_SERVICE_ACCOUNT and ANTHROPIC_API_KEY
 */

const admin = require('firebase-admin');
const path = require('path');

// Supported languages
const LANGUAGES = ['en', 'es', 'fr', 'it', 'de', 'ja', 'ko', 'zh'];
const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish', 
  fr: 'French',
  it: 'Italian',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)'
};

// Parse args
const args = process.argv.slice(2);
const categoryIndex = args.indexOf('--category');
const filterCategory = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || 
  path.join(process.env.HOME, '.clawdbot/firebase-perky-news-sa.json');

let db;
try {
  const serviceAccount = require(serviceAccountPath);
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  db = admin.firestore();
} catch (err) {
  console.error('Firebase init error:', err.message);
  console.error('Set FIREBASE_SERVICE_ACCOUNT env var to your service account JSON path');
  process.exit(1);
}

// Translation function
async function translateText(text, targetLang, context = 'article') {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Translate the following ${context} text to ${LANGUAGE_NAMES[targetLang]}. 
Keep the same tone, style, and formatting (including markdown).
Only output the translation, nothing else.

Text to translate:
${text}`
      }]
    })
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
}

// Check if article needs translation
function needsTranslation(article) {
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    if (!article.title?.[lang] || !article.content?.[lang]) {
      return true;
    }
  }
  return false;
}

// Translate single article
async function translateArticle(docRef, article, slug) {
  const enTitle = typeof article.title === 'string' ? article.title : (article.title?.en || '');
  const enExcerpt = typeof article.excerpt === 'string' ? article.excerpt : (article.excerpt?.en || '');
  const enContent = typeof article.content === 'string' ? article.content : (article.content?.en || '');

  if (!enTitle || !enContent) {
    console.log(`   ⚠️  Skipping - missing English content`);
    return;
  }

  const title = { en: enTitle };
  const excerpt = { en: enExcerpt };
  const content = { en: enContent };

  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;

    if (article.title?.[lang] && article.excerpt?.[lang] && article.content?.[lang]) {
      title[lang] = article.title[lang];
      excerpt[lang] = article.excerpt[lang];
      content[lang] = article.content[lang];
      continue;
    }

    process.stdout.write(`   🔄 ${lang}...`);
    try {
      title[lang] = await translateText(enTitle, lang, 'title');
      excerpt[lang] = await translateText(enExcerpt, lang, 'excerpt');
      content[lang] = await translateText(enContent, lang, 'article');
      console.log(' ✓');
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(` ❌ ${err.message}`);
    }
  }

  await docRef.update({ title, excerpt, content });
  console.log(`   💾 Saved!`);
}

// Main
async function main() {
  console.log('🌍 Translating articles...');
  if (filterCategory) console.log(`   Filter: category = ${filterCategory}`);

  let query = db.collection('articles');
  if (filterCategory) {
    query = query.where('category', '==', filterCategory);
  }

  const snapshot = await query.get();
  console.log(`📚 Found ${snapshot.size} articles\n`);

  let translated = 0;
  for (const doc of snapshot.docs) {
    const article = doc.data();
    const title = typeof article.title === 'string' ? article.title : (article.title?.en || doc.id);
    
    console.log(`📄 ${doc.id}`);
    console.log(`   "${title.substring(0, 50)}..."`);

    if (!needsTranslation(article)) {
      console.log(`   ✅ Already fully translated\n`);
      continue;
    }

    await translateArticle(doc.ref, article, doc.id);
    translated++;
    console.log();
  }

  console.log(`\n✅ Done! Translated ${translated} articles.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
