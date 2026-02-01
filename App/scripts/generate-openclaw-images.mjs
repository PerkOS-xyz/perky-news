#!/usr/bin/env node
/**
 * Generate cover images for OpenClaw articles using FLUX
 */

import Replicate from 'replicate';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import https from 'https';
import http from 'http';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN not set');
  process.exit(1);
}

const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

const ARTICLE_PROMPTS = {
  'what-is-openclaw-ai-assistant-that-actually-does-things': {
    prompt: 'Futuristic digital assistant visualization, friendly AI robot companion emerging from laptop screen, glowing neural connections, messaging icons floating (Telegram, Discord), file folders being organized by invisible force, clean modern tech aesthetic, purple and blue gradient, isometric 3D style, professional illustration, no text',
    title: 'What is OpenClaw'
  },
  'how-to-set-up-openclaw-in-10-minutes': {
    prompt: 'Clean minimalist terminal setup visualization, code editor with glowing green checkmarks, installation progress bar completing, laptop with command line interface, step-by-step floating cards, tech tutorial aesthetic, green and dark theme, professional developer illustration, modern flat design, no text',
    title: 'Setup Guide'
  },
  '5-things-you-didnt-know-ai-could-do-with-openclaw': {
    prompt: 'Magical AI capabilities burst illustration, browser being controlled by glowing hands, files organizing themselves, code debugging autonomously, memory brain icon pulsing, five glowing feature orbs, wonder and discovery aesthetic, vibrant colors on dark background, professional tech illustration, no text',
    title: '5 Capabilities'
  },
  'openclaw-vs-chatgpt-why-having-agent-changes-everything': {
    prompt: 'Split screen comparison visualization, left side shows chat bubble in isolation, right side shows AI integrated with computer desktop and tools, action arrows and connection lines, versus symbol in center, blue versus orange color scheme, modern tech comparison infographic style, professional illustration, no text',
    title: 'OpenClaw vs ChatGPT'
  },
  'building-your-second-brain-with-openclaw': {
    prompt: 'Second brain concept visualization, glowing brain connected to organized file system, memory nodes and knowledge graph, floating document cards with connections, productivity and organization aesthetic, human profile silhouette with digital neural network, purple and gold color scheme, professional knowledge management illustration, no text',
    title: 'Second Brain'
  }
};

const OUTPUT_DIR = './public/images/articles';

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = writeFileSync;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        writeFileSync(filepath, buffer);
        resolve(filepath);
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function generateImage(slug, promptData) {
  console.log(`\n🎨 Generating image for: ${promptData.title}`);
  console.log(`   Prompt: ${promptData.prompt.substring(0, 70)}...`);
  
  try {
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: promptData.prompt,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90,
          safety_tolerance: 5,
          prompt_upsampling: true
        }
      }
    );
    
    const imageUrl = typeof output === 'string' ? output : String(output);
    console.log(`   ✓ Generated: ${imageUrl.substring(0, 60)}...`);
    
    // Download to local file
    const localPath = `${OUTPUT_DIR}/${slug}.webp`;
    await downloadImage(imageUrl, localPath);
    console.log(`   ✓ Saved to: ${localPath}`);
    
    return `/images/articles/${slug}.webp`;
  } catch (err) {
    console.error(`   ✗ Failed: ${err.message}`);
    return null;
  }
}

function initFirebase() {
  if (admin.apps.length) return;
  const saPath = process.env.HOME + '/.config/firebase/perky-news-sa.json';
  if (existsSync(saPath)) {
    const sa = JSON.parse(readFileSync(saPath, 'utf8'));
    admin.initializeApp({ 
      credential: admin.credential.cert(sa),
      storageBucket: 'perky-news.firebasestorage.app'
    });
  }
}

async function main() {
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('🖼️  OpenClaw Articles - Image Generator\n');
  
  const results = {};
  
  for (const [slug, promptData] of Object.entries(ARTICLE_PROMPTS)) {
    const localPath = await generateImage(slug, promptData);
    if (localPath) {
      results[slug] = localPath;
    }
    
    // Rate limit between generations
    await new Promise(r => setTimeout(r, 3000));
  }
  
  // Update Firebase with new image paths
  if (Object.keys(results).length > 0) {
    console.log('\n📤 Updating Firebase...');
    initFirebase();
    const db = admin.firestore();
    
    for (const [slug, imagePath] of Object.entries(results)) {
      try {
        await db.collection('articles').doc(slug).update({
          coverImage: imagePath,
          imageUpdatedAt: new Date().toISOString()
        });
        console.log(`   ✓ Updated ${slug}`);
      } catch (err) {
        console.error(`   ✗ Failed to update ${slug}: ${err.message}`);
      }
    }
  }
  
  console.log('\n🎉 Done!');
  console.log('\nGenerated images:');
  for (const [slug, path] of Object.entries(results)) {
    console.log(`  ${slug}: ${path}`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
