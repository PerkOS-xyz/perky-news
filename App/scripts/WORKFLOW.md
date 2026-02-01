# Perky News - Content Workflow

## Overview

Este documento describe el proceso completo para crear, traducir y publicar artículos en Perky News.

---

## 1. Crear Artículo

### Estructura del artículo (JSON)

```json
{
  "slug": "my-article-slug",
  "title": "Article Title in English",
  "excerpt": "Brief summary of the article...",
  "content": "Full markdown content...",
  "category": "x402",
  "tags": ["payments", "blockchain"],
  "author": "Perky News Team",
  "featured": false,
  "sources": [
    { "name": "Source Name", "url": "https://..." }
  ]
}
```

### Categorías disponibles
- `x402` - x402 Protocol
- `erc-8004` - ERC-8004 Standard
- `ai-agents` - AI Agents
- `openclaw` - OpenClaw
- `eliza` - ElizaOS
- `defi` - DeFi
- `hackathons` - Hackathons
- `general` - General

### Comando

```bash
cd App
node scripts/create-article.mjs article.json
```

Esto automáticamente:
1. Valida el contenido
2. Traduce a 7 idiomas (ES, FR, IT, DE, JA, KO, ZH)
3. Sube a Firebase con status `published`

### Opciones

```bash
# Skip translation (English only)
node scripts/create-article.mjs article.json --skip-translate

# Force publish with warnings
node scripts/create-article.mjs article.json --force
```

---

## 2. Traducir Artículos Existentes

### Traducir un artículo específico

```bash
OPENROUTER_API_KEY=xxx node scripts/translate-article.mjs --slug article-slug
```

### Traducir todos los artículos

```bash
OPENROUTER_API_KEY=xxx node scripts/translate-all-force.mjs
```

### Idiomas soportados

| Código | Idioma |
|--------|--------|
| en | English (original) |
| es | Spanish |
| fr | French |
| it | Italian |
| de | German |
| ja | Japanese |
| ko | Korean |
| zh | Chinese (Simplified) |

---

## 3. Generar Imágenes

### Generar imagen para un artículo

```bash
REPLICATE_API_TOKEN=xxx node scripts/generate-article-images.mjs article-slug
```

### Generar todas las imágenes

```bash
REPLICATE_API_TOKEN=xxx node scripts/generate-article-images.mjs
```

### Prompts

Los prompts están definidos en `generate-article-images.mjs`. Reglas:
- Sin texto ni números en las imágenes
- Estilo profesional/corporativo
- Aspect ratio 16:9
- Formato WebP

---

## 4. Estructura en Firebase

### Colección: `articles`

```javascript
{
  // Multi-language content
  title: {
    en: "English Title",
    es: "Título en Español",
    fr: "Titre en Français",
    // ... otros idiomas
  },
  excerpt: { en: "...", es: "...", ... },
  content: { en: "...", es: "...", ... },
  
  // Metadata
  slug: "article-slug",
  category: "x402",
  tags: ["tag1", "tag2"],
  author: "Perky News Team",
  publishedAt: "2026-02-01",
  featured: true,
  status: "published",
  
  // Media
  coverImage: "https://replicate.delivery/...",
  
  // Timestamps
  createdAt: Timestamp,
  translatedAt: "2026-02-01T...",
  imageUpdatedAt: "2026-02-01T..."
}
```

---

## 5. Frontend Multi-idioma

### Cómo funciona

1. Usuario selecciona idioma en el dropdown del header
2. Se guarda cookie `perky-lang`
3. Página recarga
4. Server component lee cookie
5. Fetch de Firebase con idioma correcto
6. Contenido se muestra localizado

### Archivos clave

- `src/lib/i18n/translations.ts` - UI translations
- `src/lib/i18n/LanguageContext.tsx` - React context + cookie
- `src/lib/articles.ts` - Multi-lang article fetching
- `src/components/LanguageSelector.tsx` - Dropdown component

---

## 6. Deploy

### Automático (Netlify)

Cada push a `main` dispara deploy automático.

### Manual

```bash
cd App
npm run build
```

---

## 7. Environment Variables

### Local (scripts)

```bash
# En ~/.zshrc o terminal
export OPENROUTER_API_KEY="sk-or-v1-..."
export REPLICATE_API_TOKEN="r8_..."
export FIREBASE_SA_PATH="~/.config/firebase/perky-news-sa.json"
```

### Netlify

Configurar en Netlify Dashboard:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase config

---

## 8. Checklist Nuevo Artículo

- [ ] Escribir contenido en inglés (markdown)
- [ ] Crear JSON con metadata
- [ ] Ejecutar `create-article.mjs`
- [ ] Verificar traducciones en Firebase
- [ ] Generar imagen con `generate-article-images.mjs`
- [ ] Verificar en https://perky.news
- [ ] Commit y push

---

## 9. Troubleshooting

### Error 401 en OpenRouter
- Verificar `OPENROUTER_API_KEY`

### Error NSFW en Replicate
- Modificar prompt (evitar menciones de dinero/pagos)

### Artículo no aparece
- Verificar `status: "published"` en Firebase
- Verificar que no haya errores en la consola

### Idioma no cambia
- Limpiar cookies del browser
- Verificar que la cookie `perky-lang` existe
