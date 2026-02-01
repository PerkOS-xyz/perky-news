#!/usr/bin/env node

/**
 * Translate Article Script
 * 
 * Takes an article from Firebase and generates translations for all supported languages.
 * Usage: node translate-article.js <article-slug>
 * 
 * Requires: OPENAI_API_KEY or ANTHROPIC_API_KEY in environment
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
  console.error('Make sure FIREBASE_SERVICE_ACCOUNT points to your service account JSON');
  process.exit(1);
}

// Translation function using Claude API
async function translateText(text, targetLang, context = 'article') {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

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

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Main translation function
async function translateArticle(slug) {
  console.log(`\n📄 Fetching article: ${slug}`);
  
  const docRef = db.collection('articles').doc(slug);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    console.error(`Article not found: ${slug}`);
    process.exit(1);
  }

  const article = doc.data();
  console.log(`✅ Found: ${typeof article.title === 'string' ? article.title : article.title?.en || article.title}`);

  // Get English content (source)
  const enTitle = typeof article.title === 'string' ? article.title : (article.title?.en || '');
  const enExcerpt = typeof article.excerpt === 'string' ? article.excerpt : (article.excerpt?.en || '');
  const enContent = typeof article.content === 'string' ? article.content : (article.content?.en || '');

  if (!enTitle || !enContent) {
    console.error('Article missing English title or content');
    process.exit(1);
  }

  // Initialize multilingual objects
  const title = { en: enTitle };
  const excerpt = { en: enExcerpt };
  const content = { en: enContent };

  // Translate to each language
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue; // Skip English (source)

    // Check if translation already exists
    if (article.title?.[lang] && article.excerpt?.[lang] && article.content?.[lang]) {
      console.log(`⏭️  ${LANGUAGE_NAMES[lang]}: Already translated`);
      title[lang] = article.title[lang];
      excerpt[lang] = article.excerpt[lang];
      content[lang] = article.content[lang];
      continue;
    }

    console.log(`🔄 Translating to ${LANGUAGE_NAMES[lang]}...`);
    
    try {
      title[lang] = await translateText(enTitle, lang, 'title');
      console.log(`   ✓ Title: ${title[lang].substring(0, 50)}...`);
      
      excerpt[lang] = await translateText(enExcerpt, lang, 'excerpt');
      console.log(`   ✓ Excerpt`);
      
      content[lang] = await translateText(enContent, lang, 'article content');
      console.log(`   ✓ Content`);
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`   ❌ Error translating to ${lang}:`, err.message);
    }
  }

  // Update Firebase
  console.log(`\n💾 Updating Firebase...`);
  await docRef.update({ title, excerpt, content });
  console.log(`✅ Article updated with translations!`);
}

// CLI
const slug = process.argv[2];
if (!slug) {
  console.log('Usage: node translate-article.js <article-slug>');
  console.log('Example: node translate-article.js hackathon-to-startup-success-stories');
  process.exit(1);
}

translateArticle(slug).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
