#!/usr/bin/env node
/**
 * Generate Cover Images for Hackathon Articles
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
  'how-to-win-ethglobal-hackathon': {
    prompt: 'Dynamic illustration of diverse developers at hackathon, coding on laptops with glowing screens, Ethereum logo floating above, trophy in center, neon blue and purple lighting, energy and excitement, professional tech illustration, modern flat design style, no text no words',
    title: 'How to Win ETHGlobal'
  },
  'best-sponsor-prizes-web3-hackathons-2026': {
    prompt: 'Abstract visualization of golden prize trophies connected by blockchain nodes, multiple sponsor logos as glowing orbs, treasure chest opening with crypto coins and NFTs, purple and gold color scheme, professional corporate tech aesthetic, no text no words no numbers',
    title: 'Best Sponsor Prizes'
  },
  'building-winning-hackathon-team': {
    prompt: 'Isometric illustration of four diverse team members collaborating around holographic code display, puzzle pieces connecting above them, teamwork energy, vibrant orange and teal colors, modern tech illustration style, professional and friendly, no text no words',
    title: 'Building Winning Team'
  },
  'hackathon-to-startup-success-stories': {
    prompt: 'Abstract journey visualization from hackathon laptop to rocket ship launching into success, transformation metaphor, growth stages shown as ascending path, green and gold colors representing success and wealth, inspirational corporate tech style, no text no words',
    title: 'Hackathon to Startup'
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
  console.log('🖼️  Hackathon Articles - Image Generator\n');
  
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
