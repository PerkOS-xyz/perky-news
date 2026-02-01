#!/usr/bin/env node
/**
 * Generate cover images for ERC-8004 articles
 */

import Replicate from 'replicate';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

const replicate = new Replicate();

const ARTICLE_PROMPTS = {
  'erc-8004-technical-architecture-deep-dive': {
    prompt: 'Abstract technical blueprint visualization, three interconnected glowing layers forming a pyramid structure, smart contract nodes and connections, Ethereum diamond symbol integrated subtly, deep blue and cyan color scheme with orange accents, isometric 3D technical illustration, clean minimal design, professional tech aesthetic, no text no words',
    title: 'ERC-8004 Technical Architecture'
  },
  'building-trust-ai-on-chain-identity': {
    prompt: 'Futuristic digital trust concept, AI robot hand and human hand reaching toward glowing blockchain shield in center, holographic identity verification elements, warm golden and purple gradient background, trust and connection symbolism, professional corporate illustration style, clean minimal design, no text no words',
    title: 'Building Trust in AI'
  },
  'how-to-register-ai-agent-erc-8004': {
    prompt: 'Step-by-step process visualization, AI robot being registered in digital system, floating holographic forms and checkmarks, Ethereum registration certificate glowing, tutorial style illustration, green success indicators, blue and teal tech aesthetic, clean minimal professional design, no text no words',
    title: 'How to Register AI Agent'
  },
  'erc-8004-vs-traditional-auth-future-security': {
    prompt: 'Split comparison visualization, old rusty padlock and key on left transforming into futuristic blockchain shield on right, dramatic lighting, security evolution concept, old vs new contrast, orange and blue opposing colors meeting in center, professional tech illustration, clean minimal design, no text no words',
    title: 'ERC-8004 vs Traditional Auth'
  }
};

async function generateImage(slug, promptData) {
  console.log(`\n🎨 Generating image for: ${promptData.title}`);
  console.log(`   Prompt: ${promptData.prompt.substring(0, 100)}...`);
  
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
  console.log('🖼️  ERC-8004 Article Image Generator\n');
  
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
    console.log(`  ${slug}: ${url}`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
