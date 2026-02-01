#!/usr/bin/env node
/**
 * Generate cover images for DeFi articles using FLUX
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

const ARTICLE_PROMPTS = {
  'ai-meets-defi-agents-revolutionizing-trading': {
    prompt: 'Futuristic AI robot trading on holographic screens showing crypto charts, DeFi protocols visualized as glowing interconnected nodes, digital currency symbols floating, blue and purple neon aesthetic, professional fintech illustration, clean minimal design, 4K, no text',
    title: 'AI Meets DeFi Trading'
  },
  'automated-yield-farming-ai-optimize-returns': {
    prompt: 'Abstract visualization of automated yield farming, golden coins and tokens flowing through digital pipelines, AI brain optimizing paths, DeFi liquidity pools as glowing wells, green and gold color scheme, professional crypto illustration, clean futuristic design, no text',
    title: 'Automated Yield Farming'
  },
  'ai-powered-portfolio-management-crypto': {
    prompt: 'Sophisticated AI portfolio manager visualization, holographic pie charts and bar graphs, diverse crypto assets represented as 3D tokens, robotic hands rebalancing allocations, blue and silver corporate aesthetic, professional investment illustration, clean design, no text',
    title: 'AI Portfolio Management'
  },
  'mev-protection-ai-agents-shield-transactions': {
    prompt: 'Digital shield protecting blockchain transactions, MEV bots being deflected, AI guardian with protective aura, transaction data flowing safely through protected channel, cybersecurity aesthetic, purple and cyan colors, professional tech illustration, no text',
    title: 'MEV Protection'
  },
  'defi-risk-management-ai-tools-traders': {
    prompt: 'AI risk management dashboard with warning indicators, smart contract security visualization, portfolio health monitors, protective algorithms as digital guardians, red and blue alert colors balanced with safe greens, professional fintech illustration, no text',
    title: 'DeFi Risk Management'
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
    console.log(`   ✓ Generated: ${imageUrl.substring(0, 80)}...`);
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
    console.log('✓ Firebase initialized');
  }
}

async function main() {
  console.log('🖼️  Generating DeFi Article Images\n');
  
  const results = {};
  
  for (const [slug, promptData] of Object.entries(ARTICLE_PROMPTS)) {
    const imageUrl = await generateImage(slug, promptData);
    if (imageUrl) {
      results[slug] = imageUrl;
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 3000));
  }
  
  // Update Firebase
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
    console.log(`  ${slug}`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
