#!/usr/bin/env node
/**
 * Regenerate article images and save locally + update Firebase
 */

import Replicate from 'replicate';
import admin from 'firebase-admin';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN not set');
  process.exit(1);
}

const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

// Firebase setup
const saPath = join(process.env.HOME, '.config/firebase/perky-news-sa.json');
if (!admin.apps.length) {
  const sa = JSON.parse(readFileSync(saPath, 'utf8'));
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}
const db = admin.firestore();

// Output directory
const OUTPUT_DIR = join(process.cwd(), 'public/images/articles');
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Prompts
const ARTICLE_PROMPTS = {
  'a2a-protocol-google-linux-foundation': 'Futuristic abstract visualization of AI agents communicating through digital pathways, glowing neural network connections, blue and white color scheme, professional illustration, 4K, clean minimal design, no text no words',
  'agent-protocol-stack-a2a-mcp-x402-erc8004': 'Abstract layered architecture diagram visualization, four interconnected glowing layers, futuristic blockchain and AI fusion, purple and cyan gradients, clean minimal tech illustration, isometric 3D style, no text no words',
  'erc-8004-trustless-agents-ethereum-standard': 'Futuristic AI robot with digital identity concept, holographic elements, blockchain nodes in background, orange and purple gradient, professional tech illustration, no text no words',
  'ethglobal-2026-hackathon-calendar': 'Vibrant collage of city skylines connected by glowing digital lines, hackathon energy, developers coding, colorful festival atmosphere, professional event style, no text no words',
  'x402-v2-multi-chain-payments-100m-transactions': 'Abstract futuristic payment network visualization with glowing interconnected nodes, digital streams flowing, green and teal color scheme, clean minimal design, fintech aesthetic, no text no words no numbers'
};

async function generateAndSave(slug, prompt) {
  console.log(`\n🎨 Generating: ${slug}`);
  
  try {
    const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
      input: {
        prompt: prompt,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90
      }
    });
    
    console.log(`   Output type: ${typeof output}`);
    console.log(`   Output:`, JSON.stringify(output).substring(0, 200));
    
    let imageUrl;
    if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && output.output) {
      imageUrl = output.output;
    } else if (Array.isArray(output) && output[0]) {
      imageUrl = output[0];
    } else {
      throw new Error(`Unexpected output format: ${JSON.stringify(output)}`);
    }
    
    console.log(`   ✓ Generated: ${imageUrl.substring(0, 80)}...`);
    
    // Download
    const filename = `${slug}.webp`;
    const filepath = join(OUTPUT_DIR, filename);
    
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    writeFileSync(filepath, Buffer.from(buffer));
    console.log(`   ✓ Saved: ${filepath}`);
    
    // Update Firebase
    const localPath = `/images/articles/${filename}`;
    await db.collection('articles').doc(slug).update({ coverImage: localPath });
    console.log(`   ✓ Firebase updated: ${localPath}`);
    
    return localPath;
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Regenerating article images...\n');
  
  for (const [slug, prompt] of Object.entries(ARTICLE_PROMPTS)) {
    await generateAndSave(slug, prompt);
  }
  
  console.log('\n✅ Done!');
  process.exit(0);
}

main();
