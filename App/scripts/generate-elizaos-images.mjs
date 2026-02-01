#!/usr/bin/env node
/**
 * Generate Cover Images for ElizaOS Articles
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
  'elizaos-web3-ai-agents-framework': {
    prompt: 'Futuristic AI robot agent in a Web3 environment, holographic blockchain nodes floating around, digital neural network connections, purple and cyan neon glow, clean minimal tech illustration, professional corporate aesthetic, abstract geometric shapes, no text no words',
    title: 'ElizaOS Web3 AI Agents'
  },
  'build-first-ai-agent-elizaos-tutorial': {
    prompt: 'Developer workspace with glowing code on multiple screens, AI assistant hologram emerging from laptop, step-by-step tutorial visualization, warm orange and blue gradient lighting, modern tech office aesthetic, clean minimal design, professional illustration, no text no words',
    title: 'Build First ElizaOS Agent'
  },
  'elizaos-plugins-extending-agent-capabilities': {
    prompt: 'Abstract modular plugin architecture visualization, glowing puzzle pieces connecting together, multiple extension modules orbiting central AI core, purple green and blue gradient, clean minimal tech illustration, isometric 3D style, no text no words',
    title: 'ElizaOS Plugins'
  },
  'why-ai16z-open-source-ai-agents-elizaos': {
    prompt: 'Open source community collaboration concept, multiple developer avatars contributing to central glowing repository, GitHub-style contribution graph visualization, global network connections, green and white color scheme, professional tech illustration, no text no words',
    title: 'ai16z Open Source'
  },
  'elizaos-vs-langchain-framework-comparison': {
    prompt: 'Two abstract AI frameworks facing each other, comparison visualization with balanced scales, technology comparison infographic style, split screen design with contrasting colors (purple vs orange), clean minimal tech illustration, professional corporate aesthetic, no text no words',
    title: 'ElizaOS vs LangChain'
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
  console.log('🖼️  ElizaOS Articles - Image Generator\n');
  
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
