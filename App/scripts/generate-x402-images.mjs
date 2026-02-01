#!/usr/bin/env node
/**
 * Generate Cover Images for New x402 Articles
 */

import Replicate from 'replicate';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN not set');
  process.exit(1);
}

const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

// New x402 article prompts
const ARTICLE_PROMPTS = {
  'x402-tutorial-add-payments-api-15-minutes': {
    prompt: 'Minimalist tech illustration of code editor with payment symbols floating around, API endpoint visualization, glowing HTTP request and response flow, cryptocurrency coins integrating with code, blue and green gradient, clean professional developer aesthetic, modern flat design, no text no words',
    title: 'x402 API Tutorial'
  },
  'micropayments-finally-here-x402-changes-everything': {
    prompt: 'Abstract futuristic visualization of tiny glowing coins flowing through digital streams, micropayment concept art, breaking through barriers, transformation metaphor, coins becoming smaller and smaller in a cascade, vibrant purple and gold colors, clean minimal tech illustration, no text no words',
    title: 'Micropayments Revolution'
  },
  'x402-ai-agents-bots-pay-for-services': {
    prompt: 'Futuristic scene of friendly AI robots exchanging glowing digital coins, autonomous agent commerce, machine-to-machine payments visualization, neural network nodes with currency symbols, modern tech illustration, cyan and orange gradient, clean minimal design, no text no words no letters',
    title: 'AI Agents Payments'
  },
  'economics-x402-pricing-strategies-api-developers': {
    prompt: 'Abstract business visualization with floating price tags and charts, API monetization concept, balance scales with digital coins, pricing strategy diagrams as glowing holograms, professional fintech aesthetic, green and blue corporate colors, clean modern illustration, no text no numbers no words',
    title: 'x402 Economics'
  }
};

async function generateImage(slug, promptData) {
  console.log(`\n🎨 Generating image for: ${promptData.title}`);
  console.log(`   Prompt: ${promptData.prompt.substring(0, 80)}...`);
  
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
    console.log(`   ✓ Generated: ${imageUrl}`);
    return imageUrl;
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
  console.log('🖼️  Perky News - x402 Article Image Generator\n');
  
  const results = {};
  
  for (const [slug, promptData] of Object.entries(ARTICLE_PROMPTS)) {
    const imageUrl = await generateImage(slug, promptData);
    if (imageUrl) {
      results[slug] = imageUrl;
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (Object.keys(results).length > 0) {
    console.log('\n📤 Updating Firebase...');
    initFirebase();
    const db = admin.firestore();
    
    for (const [slug, imageUrl] of Object.entries(results)) {
      try {
        await db.collection('articles').doc(slug).update({
          coverImage: String(imageUrl),
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
  for (const [slug, url] of Object.entries(results)) {
    console.log(`  ${slug}:`);
    console.log(`    ${url}`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
