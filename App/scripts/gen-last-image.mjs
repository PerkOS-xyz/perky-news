#!/usr/bin/env node
import Replicate from 'replicate';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

async function main() {
  console.log('🎨 Generating image for multi-agent-systems...');
  
  const output = await replicate.run(
    'black-forest-labs/flux-1.1-pro',
    {
      input: {
        prompt: 'Multiple futuristic AI robots working together as a team around a holographic table, collaborative swarm intelligence visualization, robots with different specializations united, warm orange and cool blue lighting, teamwork concept, clean minimal tech illustration, professional aesthetic, no text no letters',
        aspect_ratio: '16:9',
        output_format: 'webp',
        output_quality: 90,
        safety_tolerance: 5,
        prompt_upsampling: true
      }
    }
  );
  
  const imageUrl = String(output);
  console.log('✓ Generated:', imageUrl);
  
  // Update Firebase
  const saPath = process.env.HOME + '/.config/firebase/perky-news-sa.json';
  const sa = JSON.parse(readFileSync(saPath, 'utf8'));
  admin.initializeApp({ credential: admin.credential.cert(sa) });
  
  await admin.firestore().collection('articles').doc('multi-agent-systems-ai-collaboration').update({
    coverImage: imageUrl,
    imageUpdatedAt: new Date().toISOString()
  });
  
  console.log('✅ Updated multi-agent-systems-ai-collaboration');
}

main().catch(e => console.error('Error:', e.message));
