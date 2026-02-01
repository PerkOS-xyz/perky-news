#!/usr/bin/env node

/**
 * Translate Articles Script
 * 
 * Uses Firebase Client SDK (same as the app) and Anthropic API for translations.
 * 
 * Setup:
 *   cp .env.example .env
 *   # Fill in your Firebase and Anthropic credentials
 *   npm install
 *   node translate-articles.js [--slug article-slug] [--category hackathons]
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

// Config
const LANGUAGES = ['en', 'es', 'fr', 'it', 'de', 'ja', 'ko', 'zh'];
const LANGUAGE_NAMES = {
  en: 'English', es: 'Spanish', fr: 'French', it: 'Italian',
  de: 'German', ja: 'Japanese', ko: 'Korean', zh: 'Chinese (Simplified)'
};

// Firebase init
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'perky-news',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Translation via Anthropic
async function translate(text, targetLang, context = 'article') {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
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
        content: `Translate the following ${context} to ${LANGUAGE_NAMES[targetLang]}. Keep the same tone, style, and formatting (including markdown). Only output the translation, nothing else.\n\n${text}`
      }]
    })
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

// Get English content from field (handles string or object)
function getEnglish(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field.en || '';
}

// Check if needs translation
function needsTranslation(article) {
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    if (!article.title?.[lang] || !article.content?.[lang]) return true;
  }
  return false;
}

// Translate one article
async function translateArticle(docRef, article, slug) {
  const enTitle = getEnglish(article.title);
  const enExcerpt = getEnglish(article.excerpt);
  const enContent = getEnglish(article.content);

  if (!enTitle || !enContent) {
    console.log(`   ⚠️  Missing English content, skipping`);
    return false;
  }

  const title = { en: enTitle };
  const excerpt = { en: enExcerpt };
  const content = { en: enContent };

  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;

    // Skip if already translated
    if (article.title?.[lang] && article.excerpt?.[lang] && article.content?.[lang]) {
      title[lang] = article.title[lang];
      excerpt[lang] = article.excerpt[lang];
      content[lang] = article.content[lang];
      continue;
    }

    process.stdout.write(`   🔄 ${LANGUAGE_NAMES[lang]}...`);
    try {
      title[lang] = await translate(enTitle, lang, 'article title');
      excerpt[lang] = await translate(enExcerpt, lang, 'article excerpt');
      content[lang] = await translate(enContent, lang, 'article content');
      console.log(' ✓');
      await new Promise(r => setTimeout(r, 500)); // Rate limit
    } catch (err) {
      console.log(` ❌ ${err.message}`);
    }
  }

  await updateDoc(docRef, { title, excerpt, content });
  console.log(`   💾 Saved to Firebase`);
  return true;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf('--slug');
  const categoryIndex = args.indexOf('--category');
  
  const filterSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;
  const filterCategory = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

  console.log('🌍 Perky News Article Translator\n');
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set. Copy .env.example to .env and configure.');
    process.exit(1);
  }

  let articlesQuery;
  if (filterSlug) {
    console.log(`📄 Translating single article: ${filterSlug}\n`);
    articlesQuery = query(collection(db, 'articles'), where('__name__', '==', filterSlug));
  } else if (filterCategory) {
    console.log(`📁 Translating category: ${filterCategory}\n`);
    articlesQuery = query(collection(db, 'articles'), where('category', '==', filterCategory));
  } else {
    console.log(`📚 Translating ALL articles\n`);
    articlesQuery = collection(db, 'articles');
  }

  const snapshot = await getDocs(articlesQuery);
  console.log(`Found ${snapshot.size} article(s)\n`);

  let translated = 0, skipped = 0;

  for (const docSnap of snapshot.docs) {
    const article = docSnap.data();
    const title = getEnglish(article.title) || docSnap.id;
    
    console.log(`📄 ${docSnap.id}`);
    console.log(`   "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`);

    if (!needsTranslation(article)) {
      console.log(`   ✅ Already translated\n`);
      skipped++;
      continue;
    }

    const success = await translateArticle(doc(db, 'articles', docSnap.id), article, docSnap.id);
    if (success) translated++;
    console.log();
  }

  console.log(`\n✅ Done! Translated: ${translated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
