#!/usr/bin/env node
/**
 * Create Article - Perky News
 * 
 * Creates a new article in Firebase with automatic translation to 8 languages.
 * 
 * Usage:
 *   node create-article.mjs article.json [options]
 *   node create-article.mjs '{"slug": "...", "title": "...", "content": "..."}' [options]
 * 
 * Options:
 *   --force            Publish even with validation warnings
 *   --skip-validation  ⚠️  Skip validation (not recommended)
 *   --skip-translate   Skip translation (English only)
 */

import admin from 'firebase-admin';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync } from 'fs';
import { validateArticle } from './validate-article.mjs';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LANGUAGES = {
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIREBASE INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initFirebase() {
  if (admin.apps.length) return;
  
  const paths = [
    process.env.FIREBASE_SA_PATH,
    '/root/.config/firebase/perky-news-sa.json',
    process.env.HOME + '/.config/firebase/perky-news-sa.json'
  ].filter(Boolean);
  
  for (const p of paths) {
    if (existsSync(p)) {
      const sa = JSON.parse(readFileSync(p, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        storageBucket: 'perky-news.firebasestorage.app'
      });
      return;
    }
  }
  
  console.error('❌ Firebase service account not found');
  console.error('   Set FIREBASE_SA_PATH or copy to ~/.config/firebase/perky-news-sa.json');
  process.exit(1);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSLATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const anthropic = new Anthropic();

async function translateText(text, langName, context = '') {
  if (!text || text.trim() === '') return '';
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `Translate to ${langName}. Keep markdown formatting, technical terms, and proper nouns unchanged.
${context ? `Context: ${context}` : ''}

${text}

Provide ONLY the translation.`
    }]
  });
  
  return response.content[0].text.trim();
}

async function translateArticle(article) {
  console.log('\n🌐 Translating article to 7 languages...\n');
  
  const title = { en: article.title };
  const excerpt = { en: article.excerpt || '' };
  const content = { en: article.content };
  
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    process.stdout.write(`   → ${langName}...`);
    
    try {
      title[langCode] = await translateText(article.title, langName, 'article title');
      excerpt[langCode] = await translateText(article.excerpt || '', langName, 'article excerpt');
      content[langCode] = await translateText(article.content, langName, 'technical article about blockchain/AI');
      
      console.log(' ✓');
    } catch (err) {
      console.log(` ✗ (${err.message})`);
      // Fallback to English
      title[langCode] = article.title;
      excerpt[langCode] = article.excerpt || '';
      content[langCode] = article.content;
    }
    
    await new Promise(r => setTimeout(r, 300));
  }
  
  return { title, excerpt, content };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const args = process.argv.slice(2);
const skipValidation = args.includes('--skip-validation');
const forceWarnings = args.includes('--force');
const skipTranslate = args.includes('--skip-translate');
const articleArg = args.find(a => !a.startsWith('--'));

if (!articleArg) {
  console.error(`
📝 Create Article - Perky News
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Creates article with automatic translation to 8 languages.

Usage: node create-article.mjs <article.json> [options]

Options:
  --force            Publish with validation warnings
  --skip-validation  Skip validation (not recommended)
  --skip-translate   English only (no translations)

Required fields: slug, title, content, category
`);
  process.exit(1);
}

// Load article
let article;
try {
  if (existsSync(articleArg)) {
    article = JSON.parse(readFileSync(articleArg, 'utf8'));
    console.log(`📄 Loading: ${articleArg}\n`);
  } else {
    article = JSON.parse(articleArg);
  }
} catch (err) {
  console.error('❌ Invalid JSON:', err.message);
  process.exit(1);
}

// Validate required fields
const missing = ['slug', 'title', 'content', 'category'].filter(f => !article[f]);
if (missing.length > 0) {
  console.error('❌ Missing required:', missing.join(', '));
  process.exit(1);
}

// Validation
if (!skipValidation) {
  console.log('🔍 Validating content...\n');
  const validation = validateArticle(article.content);

  if (validation.errors.length > 0) {
    console.log('❌ VALIDATION FAILED:\n');
    validation.errors.forEach(e => console.log(`   ❌ ${e}`));
    console.log('\nFix errors and try again.');
    process.exit(1);
  }

  if (validation.warnings.length > 0 && !forceWarnings) {
    console.log('⚠️  WARNINGS:\n');
    validation.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
    console.log('\nUse --force to publish anyway.');
    process.exit(1);
  }
  
  console.log('✅ Validation passed\n');
}

// Create article
async function createArticle() {
  initFirebase();
  const db = admin.firestore();
  const slug = article.slug;
  
  // Check exists
  const existing = await db.collection('articles').doc(slug).get();
  if (existing.exists) {
    console.error(`❌ Article exists: ${slug}`);
    console.error('   Use update-article.mjs to modify');
    process.exit(1);
  }
  
  // Translate if needed
  let title, excerpt, content;
  
  if (skipTranslate) {
    console.log('⏭️  Skipping translation (--skip-translate)\n');
    title = article.title;
    excerpt = article.excerpt || article.content.substring(0, 200) + '...';
    content = article.content;
  } else {
    const translated = await translateArticle(article);
    title = translated.title;
    excerpt = translated.excerpt;
    content = translated.content;
    
    // Fill excerpt if empty
    if (!excerpt.en || excerpt.en === '') {
      excerpt = { en: article.content.substring(0, 200) + '...' };
      for (const lang of Object.keys(LANGUAGES)) {
        excerpt[lang] = content[lang]?.substring(0, 200) + '...' || excerpt.en;
      }
    }
  }
  
  const articleData = {
    title,
    excerpt,
    content,
    category: article.category,
    tags: article.tags || [],
    author: article.author || 'Perky News Team',
    publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
    featured: article.featured || false,
    coverImage: article.coverImage || null,
    sources: article.sources || [],
    status: 'published',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    translatedAt: skipTranslate ? null : new Date().toISOString(),
  };
  
  await db.collection('articles').doc(slug).set(articleData);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Article created!');
  console.log(`   Slug: ${slug}`);
  console.log(`   Languages: ${skipTranslate ? '1 (EN only)' : '8'}`);
  console.log(`   URL: https://perky.news/articles/${slug}`);
}

createArticle().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
