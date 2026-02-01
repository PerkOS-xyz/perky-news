#!/usr/bin/env node
/**
 * Generate Cover Images for General AI Agent Articles
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
  'what-are-ai-agents-beginners-guide': {
    prompt: 'Friendly minimalist illustration of an AI robot assistant helping a human with various digital tasks, holographic screens floating around them, warm welcoming colors, blue and orange gradient background, modern flat design style, beginner-friendly aesthetic, professional illustration, no text',
    title: 'What Are AI Agents'
  },
  'agent-economy-transform-work-2030': {
    prompt: 'Futuristic cityscape with humans and AI robots working together in harmony, digital economy visualization with flowing data streams and currency symbols, optimistic utopian aesthetic, sunrise golden hour lighting, professional corporate illustration, clean modern design, no text no numbers',
    title: 'Agent Economy 2030'
  },
  'ai-agents-vs-chatbots-key-differences': {
    prompt: 'Split comparison illustration showing simple chatbot bubble on left versus complex AI agent with multiple tools and connections on right, clean infographic style, blue tones for chatbot green tones for agent, modern minimalist design, professional tech illustration, no text',
    title: 'Agents vs Chatbots'
  },
  'how-to-choose-first-ai-agent-platform': {
    prompt: 'Abstract visualization of different AI platform options represented as floating geometric shapes and pathways, decision tree aesthetic, person standing at crossroads looking at multiple glowing portals, helpful and approachable mood, purple and teal color scheme, modern illustration, no text',
    title: 'Choose AI Platform'
  },
  'future-personal-ai-digital-twin': {
    prompt: 'Artistic representation of human and their digital AI twin reflection facing each other, mirror-like composition with digital particles connecting them, one side organic one side digital holographic, deep blue and cyan colors with warm skin tones, futuristic portrait style, emotional and thoughtful mood, no text',
    title: 'Digital Twin'
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
  const args = process.argv.slice(2);
  const specificSlug = args[0];
  
  console.log('🖼️  Perky News - General Articles Image Generator\n');
  
  const results = {};
  
  for (const [slug, promptData] of Object.entries(ARTICLE_PROMPTS)) {
    if (specificSlug && slug !== specificSlug) continue;
    
    const imageUrl = await generateImage(slug, promptData);
    if (imageUrl) {
      results[slug] = imageUrl;
    }
    
    await new Promise(r => setTimeout(r, 3000));
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
