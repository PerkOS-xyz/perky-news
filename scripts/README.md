# Perky News Scripts

## Article Translation

Translates articles to all 8 supported languages using Claude API.

### Setup

```bash
cd scripts
npm install

# Configure credentials
cp .env.example .env
# Edit .env with your Firebase and Anthropic API keys
```

### Usage

```bash
# Translate ALL articles
node translate-articles.js

# Translate single article
node translate-articles.js --slug hackathon-to-startup-success-stories

# Translate by category
node translate-articles.js --category hackathons
```

### Supported Languages

| Code | Language |
|------|----------|
| en | English (source) |
| es | Spanish |
| fr | French |
| it | Italian |
| de | German |
| ja | Japanese |
| ko | Korean |
| zh | Chinese |

### Firebase Article Structure

Articles must have multilingual fields:

```javascript
{
  slug: "article-id",
  title: {
    en: "English Title",
    es: "Título en Español",
    // ... all 8 languages
  },
  excerpt: { en: "...", es: "...", ... },
  content: { en: "...", es: "...", ... },
  category: "hackathons",
  status: "published",
  publishedAt: "2026-02-01",
  featured: false
}
```

### Article Workflow

1. **Create article in English** (Firebase Console or script)
2. **Set `status: "published"`** for visibility
3. **Run translation:** `node translate-articles.js --slug new-article-slug`
4. **Verify** in multiple languages on perky.news

### Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=perky-news
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ANTHROPIC_API_KEY=
```
