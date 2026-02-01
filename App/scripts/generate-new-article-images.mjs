#!/usr/bin/env node
/**
 * Generate images for the 4 new AI agent articles
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

// Prompts for the 4 new articles
const ARTICLE_PROMPTS = {
  'mcp-protocol-claude-connects-world': {
    prompt: 'Abstract futuristic visualization of an AI assistant connecting to multiple tools and services, glowing connection lines between a central AI core and various icons representing files databases and APIs, purple and blue gradient, clean minimal tech illustration, isometric 3D style, professional corporate aesthetic, no text no letters',
    title: 'MCP Protocol'
  },
  'a2a-protocol-google-agent-communication': {
    prompt: 'Futuristic visualization of multiple AI robots communicating with each other through glowing message streams, network of intelligent agents exchanging data, Google colors subtle blue green red yellow accents, clean minimal tech illustration, professional corporate aesthetic, no text no letters no words',
    title: 'A2A Protocol Agent Communication'
  },
  'best-ai-agent-tools-2026': {
    prompt: 'Array of futuristic AI development tools floating in space, holographic interfaces showing code and workflows, developer workstation of the future, vibrant tech colors purple blue cyan, abstract geometric shapes, clean minimal illustration, professional tech aesthetic, no text no letters',
    title: 'Best AI Agent Tools'
  },
  'multi-agent-systems-ai-collaboration': {
    prompt: 'Multiple futuristic AI robots working together as a team around a holographic table, collaborative swarm intelligence visualization, robots with different specializations united, warm orange and cool blue lighting, teamwork concept, clean minimal tech illustration, professional aesthetic, no text no letters',
    title: 'Multi-Agent Systems'
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
    console.log(`   ✓ Generated: ${imageUrl.substring(0, 60)}...`);
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
  } else {
    console.error('❌ Firebase SA not found');
    process.exit(1);
  }
}

async function main() {
  console.log('🖼️  Generating images for 4 new AI agent articles\n');
  
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
    console.log(`  ${slug}`);
    console.log(`    ${url}\n`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
