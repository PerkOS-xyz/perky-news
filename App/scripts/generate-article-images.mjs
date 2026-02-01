import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import https from 'https';
import http from 'http';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync('/root/.config/firebase/perky-news-sa.json', 'utf8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'perky-news.firebasestorage.app'
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

// Generate image prompt from article
function generatePrompt(article) {
  const categoryStyles = {
    'x402': 'futuristic digital payment network, blockchain nodes, flowing data streams, purple and blue neon',
    'erc-8004': 'AI robot with ethereum logo, digital identity card, trust network visualization, blue and orange',
    'ai-agents': 'autonomous AI agents working together, neural network, robots collaborating, green tech aesthetic',
    'defi': 'decentralized finance visualization, yield farming, liquidity pools, golden and green',
    'openclaw': 'open source AI framework, code visualization, modular architecture, orange tech theme',
    'eliza': 'crypto AI agent, trading bot, blockchain integration, pink and purple cyberpunk',
    'general': 'technology news, digital innovation, modern tech aesthetic, clean minimal'
  };
  
  const style = categoryStyles[article.category] || categoryStyles.general;
  
  return `Professional tech blog header image: ${article.title}. Style: ${style}. Modern, clean, high quality, 16:9 aspect ratio, no text, abstract visualization`;
}

// Call Replicate API directly
async function callReplicate(prompt) {
  // Create prediction
  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
      input: {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: '16:9'
      }
    })
  });
  
  const prediction = await createRes.json();
  
  // Poll for completion
  let result = prediction;
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    await new Promise(r => setTimeout(r, 1000));
    const pollRes = await fetch(result.urls.get, {
      headers: { 'Authorization': `Token ${REPLICATE_TOKEN}` }
    });
    result = await pollRes.json();
  }
  
  if (result.status === 'failed') {
    throw new Error(result.error || 'Generation failed');
  }
  
  return result.output[0];
}

// Download image from URL
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Upload to Firebase Storage
async function uploadToStorage(buffer, filename) {
  const file = bucket.file(`articles/${filename}`);
  
  await file.save(buffer, {
    metadata: { contentType: 'image/png' },
  });
  
  await file.makePublic();
  
  return `https://storage.googleapis.com/${bucket.name}/articles/${filename}`;
}

// Generate image for article
async function generateImage(article) {
  console.log(`\n🎨 Generating: ${article.slug}`);
  
  const prompt = generatePrompt(article);
  console.log(`   Prompt: ${prompt.substring(0, 60)}...`);
  
  try {
    const imageUrl = await callReplicate(prompt);
    console.log(`   Generated: ${imageUrl.substring(0, 50)}...`);
    
    console.log(`   Downloading...`);
    const imageBuffer = await downloadImage(imageUrl);
    
    console.log(`   Uploading to Storage...`);
    const filename = `${article.slug}.png`;
    const storageUrl = await uploadToStorage(imageBuffer, filename);
    
    await db.collection('articles').doc(article.slug).update({
      coverImage: storageUrl,
      imageGeneratedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`   ✅ Done: ${storageUrl}`);
    return storageUrl;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

// Main
async function main() {
  console.log('🖼️  Generating images for articles...');
  
  const snapshot = await db.collection('articles').get();
  
  for (const doc of snapshot.docs) {
    const article = { slug: doc.id, ...doc.data() };
    
    if (article.coverImage?.includes('storage.googleapis.com')) {
      console.log(`⏭️  Skip: ${article.slug} (has image)`);
      continue;
    }
    
    await generateImage(article);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n🎉 Done!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
