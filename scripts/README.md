# Perky News Scripts

## Article Translation

All articles must be translated to all 8 supported languages:
- 🇺🇸 English (en) - Source
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)
- 🇩🇪 German (de)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇨🇳 Chinese (zh)

### Setup

1. Create a Firebase service account:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Save as `~/.clawdbot/firebase-perky-news-sa.json`

2. Set environment variables:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT=~/.clawdbot/firebase-perky-news-sa.json
   export ANTHROPIC_API_KEY=your-key
   ```

### Single Article Translation

```bash
node scripts/translate-article.js <article-slug>

# Example:
node scripts/translate-article.js hackathon-to-startup-success-stories
```

### Batch Translation

```bash
# Translate all articles
node scripts/translate-all-articles.js

# Translate only hackathon articles
node scripts/translate-all-articles.js --category hackathons
```

## Article Creation Workflow

When creating a new article:

1. **Write content in English** (source language)
2. **Upload to Firebase** with English content
3. **Run translation script:**
   ```bash
   node scripts/translate-article.js <new-article-slug>
   ```
4. **Verify** translations in Firebase Console

### Firebase Article Structure

```javascript
{
  slug: "article-slug",
  title: {
    en: "English Title",
    es: "Título en Español",
    fr: "Titre en Français",
    // ... all 8 languages
  },
  excerpt: {
    en: "...",
    es: "...",
    // ...
  },
  content: {
    en: "Full markdown content...",
    es: "Contenido completo...",
    // ...
  },
  category: "hackathons",
  status: "published",
  publishedAt: "2026-02-01",
  // ...
}
```

## Image Generation

For article cover images, use Replicate:

```bash
node ~/clawd/scripts/generate-image.js "prompt" output.png
```
