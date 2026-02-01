import admin from 'firebase-admin';
import { readFileSync } from 'fs';

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

const articles = [
  {
    slug: 'ethglobal-2026-hackathon-calendar',
    title: 'ETHGlobal 2026 Hackathon Calendar: 5 Cities, 5 Opportunities to Build the Future',
    excerpt: "If you've ever dreamed of building something that could change the world—and getting paid for it—hackathons are your launchpad.",
    coverImage: '/images/ethglobal-2026-hero.webp',
    content: `# ETHGlobal 2026 Hackathon Calendar: 5 Cities, 5 Opportunities to Build the Future

**If you've ever dreamed of building something that could change the world—and getting paid for it—hackathons are your launchpad.**

## What is ETHGlobal?

ETHGlobal is the world's largest Ethereum hackathon organizer. Think of it as the Olympics of Web3 development: thousands of builders from around the globe come together for intense 36-48 hour coding sprints, competing for prizes that often reach hundreds of thousands of dollars.

But it's not just about the money. ETHGlobal hackathons are where:
- **Uniswap** was born (now a $5B+ protocol)
- **Flashbots** started (revolutionized MEV)
- Countless successful projects found their founding teams

Whether you're a seasoned developer or just learning to code, these events welcome everyone willing to build.

## Why Should You Care?

Even if you're new to Web3, hackathons offer something unique:

1. **Learn by doing**: No better way to understand blockchain than building on it
2. **Meet your co-founders**: Many successful startups formed at hackathons
3. **Get funded**: Sponsors actively scout for teams to invest in
4. **Free education**: Workshops, mentors, and resources included
5. **Global network**: Connect with builders worldwide

## 2026 Schedule

ETHGlobal announced five in-person hackathons for 2026:

| Event | Location | Dates | Why Go? |
|-------|----------|-------|---------|
| **ETHGlobal Cannes** | 🇫🇷 France | April 3-5 | French Riviera + crypto = perfect combo |
| **ETHGlobal New York** | 🇺🇸 USA | June 12-14 | The biggest US crypto hub |
| **ETHGlobal Lisbon** | 🇵🇹 Portugal | July 24-26 | Europe's crypto-friendly capital |
| **ETHGlobal Tokyo** | 🇯🇵 Japan | September 25-27 | Asia's innovation center |
| **ETHGlobal Mumbai** | 🇮🇳 India | Q4 (TBA) | Fastest-growing dev community |

## Also Worth Your Calendar

### ETHPrague (May 8-10, 2026)
A community-favorite hackathon in the heart of Europe. Known for its "cypherpunk" vibe and focus on privacy tech. The theme? **Building a solarpunk future**—technology that's sustainable, open, and human-centered.

- **Location**: Prague, Czech Republic
- **Vibe**: More intimate than ETHGlobal, strong community focus
- **Website**: [ethprague.com](https://ethprague.com)

## What to Expect at Your First Hackathon

Never been to one? Here's what a typical ETHGlobal weekend looks like:

**Friday evening**: Check-in, team formation, opening ceremony. Sponsors present bounties (specific challenges with prizes).

**Saturday**: Hack all day. Workshops run in parallel—learn new tools while building. Mentors roam the venue helping stuck teams.

**Sunday**: Final push, submit your project, present to judges. Winners announced, prizes distributed.

**The secret**: You don't need a complete product. Judges look for creativity, technical ambition, and a working demo. A clever hack built in 36 hours beats a polished app every time.

## Tips for Success

From hackathon veterans (including teams that have won multiple times):

1. **Start with a problem, not a technology** - "I want to use AI" is weak. "I want to help people find affordable housing" is strong.
2. **Keep your scope tiny** - The #1 mistake is building too much. MVPs win prizes. Cut features ruthlessly.
3. **Practice your pitch** - Judges see 100+ projects. You have 3 minutes. Make every second count.
4. **Network actively** - The people you meet matter more than the prizes. Exchange contacts. Follow up.
5. **Sleep (a little)** - Exhausted brains don't code well. A few hours of rest beats an all-nighter.

## How to Prepare

Want to maximize your chances? Start now:

- **Learn Solidity basics**: [CryptoZombies](https://cryptozombies.io) is free and fun
- **Understand the ecosystem**: Follow builders on Twitter/X
- **Join a local community**: Ethereum meetups exist in most major cities
- **Build something small**: Deploy a simple contract to testnet

---

**The bottom line**: Hackathons changed countless careers—including some of Web3's most successful founders. Whether you win or not, you'll learn more in one weekend than months of tutorials.

Pick a city. Book your flight. Build something amazing.`,
    sources: [
      { name: 'ETHGlobal Official', url: 'https://ethglobal.com' },
      { name: 'ETHGlobal 2026 Announcement', url: 'https://x.com/ETHGlobal/status/1992919708589576215' },
      { name: 'ETHPrague 2026', url: 'https://ethprague.com' }
    ]
  },
  {
    slug: 'x402-v2-multi-chain-payments-100m-transactions',
    title: 'x402 V2: How the Internet is Finally Getting a Payment Button',
    excerpt: 'Imagine if every website, API, and AI agent could accept payments as easily as loading a webpage. That\'s exactly what x402 makes possible.',
    coverImage: '/images/x402-hero.webp',
    content: `# x402 V2: How the Internet is Finally Getting a Payment Button

**Imagine if every website, API, and AI agent could accept payments as easily as loading a webpage. That's exactly what x402 makes possible.**

## The Problem We've All Experienced

You want to access an article, use an API, or get data from a service. What happens?

1. Create an account
2. Enter your email
3. Verify your email
4. Add a credit card
5. Accept terms of service
6. Finally get access

This friction kills the internet economy. Micropayments ($0.01 for an article?) are impossible because credit card fees alone cost $0.30+.

And for AI agents? They can't fill out forms or click "I agree." The current payment infrastructure wasn't built for machines.

## Enter x402: Payments as Simple as HTTP

x402 is a protocol developed by Coinbase that embeds payments directly into the web. It uses HTTP status code 402—"Payment Required"—which has existed since 1999 but was never implemented until now.

Here's how it works:

1. **You request a resource** (webpage, API, data)
2. **Server responds with 402** + price + payment address
3. **Your wallet signs a payment** (happens automatically)
4. **Server verifies** and grants access

No accounts. No forms. No friction. Just pay and access.

## Why This Matters Now

Two things changed that make x402 essential:

**1. AI agents are everywhere.** ChatGPT, Claude, and thousands of autonomous agents need to access APIs, buy compute, and pay for services. They can't use credit cards—they need programmable money.

**2. Stablecoins work.** USDC and other stablecoins provide the reliability of dollars with the programmability of crypto. No price volatility, instant settlement.

## V2: What's New?

After processing **over 100 million payments** since launching in May 2025, Coinbase released x402 V2 on December 11, 2025. Key upgrades:

### Wallet-Based Identity
Your wallet becomes your identity. Pay once, get remembered. No need to re-authenticate for every request—your wallet proves who you are.

### Multi-Chain Support
V2 works across multiple blockchains:
- Base (Coinbase's L2)
- Ethereum
- Polygon
- Solana
- And more via CAIP standards

### Automatic Discovery
Services can advertise their x402 capabilities. Agents can automatically find and connect to payment-enabled APIs without manual configuration.

### Dynamic Pricing
Prices can adjust per-request based on demand, user history, or content type. Perfect for AI inference (pay per token) or premium content.

## Real-World Use Cases

x402 is already powering:

- **AI API calls**: Pay per query instead of monthly subscriptions
- **Premium content**: Read one article for $0.05 without subscribing
- **Data feeds**: Real-time market data, pay per update
- **Compute resources**: Rent GPU time by the second
- **Agent-to-agent commerce**: AI agents hiring other AI agents

## The x402 Foundation

To ensure x402 remains open and vendor-neutral, Coinbase and Cloudflare announced the **x402 Foundation**. This independent organization will:
- Maintain the protocol specification
- Coordinate ecosystem development
- Ensure no single company controls the standard

---

**The bottom line**: The web was built with a payment status code that sat unused for 25 years. Now it's finally being used—and it might change how the entire internet economy works.`,
    sources: [
      { name: 'x402 V2 Launch Announcement', url: 'https://www.x402.org/writing/x402-v2-launch' },
      { name: 'Coinbase Developer Documentation', url: 'https://docs.cdp.coinbase.com/x402/welcome' },
      { name: 'The Block Coverage', url: 'https://www.theblock.co/post/382284/coinbase-incubated-x402-payments-protocol-built-for-ais-rolls-out-v2' }
    ]
  },
  {
    slug: 'erc-8004-trustless-agents-ethereum-standard',
    title: 'ERC-8004: How AI Agents Get Their Own Identity on Ethereum',
    excerpt: 'In a world where AI agents can trade, negotiate, and transact—how do you know which ones to trust? ERC-8004 provides the answer.',
    coverImage: '/images/erc8004-hero.webp',
    content: `# ERC-8004: How AI Agents Get Their Own Identity on Ethereum

**In a world where AI agents can trade, negotiate, and transact—how do you know which ones to trust? ERC-8004 provides the answer.**

## The Trust Problem

Imagine hiring a freelancer you've never met. You'd probably:
- Check their LinkedIn profile
- Read reviews from past clients
- Look at their portfolio
- Maybe start with a small test project

Now imagine the freelancer is an AI agent. No LinkedIn. No identity. No history. How do you trust it with your money or data?

This is the fundamental challenge of the emerging "agent economy"—thousands of AI agents offering services, but no standardized way to verify who they are or whether they're trustworthy.

## What is ERC-8004?

ERC-8004 is a new Ethereum standard (currently in draft) that gives AI agents verifiable, on-chain identity. Think of it as a combination of:
- **Passport** (unique identity)
- **Credit score** (reputation based on history)
- **Professional license** (verified capabilities)

All stored on the blockchain, transparent and tamper-proof.

## Who Built This?

The standard was created by a cross-industry team:
- **Marco De Rossi** from MetaMask
- **Davide Crapis** from the Ethereum Foundation
- **Jordan Ellis** from Google
- **Erik Reppel** from Coinbase

When MetaMask, Google, and Coinbase collaborate on a standard, it's worth paying attention.

## The Three Pillars

ERC-8004 consists of three registries:

### 1. Identity Registry
Every agent gets a unique on-chain ID—like an NFT that represents their existence. This ID:
- Works across all EVM chains
- Can be transferred (selling an agent's identity)
- Links to the agent's capabilities and history

### 2. Reputation Registry
After every interaction, clients can leave feedback. Over time, agents build reputation scores. Unlike Yelp reviews (which can be faked), these are:
- Tied to actual on-chain transactions
- Cryptographically verified
- Weighted by the transaction value

### 3. Validation Registry
For high-stakes tasks, reputation isn't enough. The validation registry enables:
- **Re-execution**: Independent validators re-run the agent's work
- **zkML proofs**: Mathematical proof the AI ran correctly
- **TEE verification**: Hardware-secured execution environments

## Trust Levels for Different Tasks

Not every task needs maximum security. ERC-8004 enables tiered trust:

| Task | Example | Trust Level |
|------|---------|-------------|
| Low stakes | Order pizza | Basic reputation |
| Medium stakes | Book travel | Reputation + escrow |
| High stakes | Financial trade | Full validation |
| Critical | Medical diagnosis | zkML + human review |

## The Builder Program

Want to build on ERC-8004? The official Builder Program launched **September 23, 2025**. Reference implementations are already running on Ethereum Sepolia, Base Sepolia, Linea Sepolia, and Hedera Testnet.

---

**The bottom line**: ERC-8004 is to AI agents what passports and credit scores are to humans—a system for establishing identity and trust in an increasingly autonomous world.`,
    sources: [
      { name: 'EIP-8004 Specification', url: 'https://eips.ethereum.org/EIPS/eip-8004' },
      { name: 'Ethereum Magicians Discussion', url: 'https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098' },
      { name: '8004.org', url: 'https://8004.org/' }
    ]
  },
  {
    slug: 'a2a-protocol-google-linux-foundation',
    title: "A2A Protocol: Google's Blueprint for How AI Agents Will Talk to Each Other",
    excerpt: "If AI agents are going to work together, they need a common language. Google's A2A protocol is becoming that language—and it's now open source under the Linux Foundation.",
    coverImage: '/images/a2a-hero.webp',
    content: `# A2A Protocol: Google's Blueprint for How AI Agents Will Talk to Each Other

**If AI agents are going to work together, they need a common language. Google's A2A protocol is becoming that language—and it's now open source under the Linux Foundation.**

## The Communication Challenge

Picture this: You have an AI travel agent, an AI flight booker, an AI hotel finder, and an AI itinerary planner. Each one is great at its job. But how do they work together?

Without a standard protocol, each agent speaks its own language. Integrating them requires custom code for every combination. Four agents = six integrations. Ten agents = forty-five integrations. It doesn't scale.

This is the problem A2A solves.

## What is A2A?

A2A (Agent-to-Agent) is an open protocol created by Google that enables:
- **Discovery**: Agents find each other
- **Communication**: Standardized message formats
- **Collaboration**: Multi-agent task execution
- **Security**: Built-in authentication

Think of it as HTTP for AI agents—a common standard that everyone can build on.

## A Brief History

- **April 2025**: Google announces A2A at Cloud Next
- **June 2025**: A2A moves to the Linux Foundation
- **July 2025**: Version 0.3 releases with improved stability
- **Now**: Growing adoption across enterprise AI

The move to Linux Foundation was crucial—it signaled that A2A is a true open standard, not a Google proprietary product.

## How It Works

### Agent Cards
Every agent publishes an "Agent Card"—a description of what it can do. Like a business card, but machine-readable.

### Task Lifecycle
When agents work together, A2A manages the entire task:
1. **Create**: One agent requests help from another
2. **Negotiate**: Agents agree on parameters and format
3. **Execute**: Work happens
4. **Update**: Progress communicated
5. **Complete**: Results delivered

## Why Enterprises Care

A 2025 survey found:
- **29%** of enterprises already run agentic AI in production
- **44%** plan to deploy within a year
- Top goals: cost reduction, automation of manual work

But enterprises need standards. They can't build on proprietary protocols that might change or disappear.

## Real-World Scenario

**You ask your personal agent**: "Plan my trip to Tokyo next month"

**Behind the scenes**:
1. Personal agent discovers flight-booking agent via A2A registry
2. Sends task request with dates and preferences
3. Flight agent searches, returns options
4. Personal agent sends hotel request to hotel agent
5. Combines results, presents to you
6. You approve, agents coordinate booking

All through standardized A2A messages. No custom integrations required.

---

**The bottom line**: A2A is the TCP/IP of the agent economy—a foundational protocol that enables everything else.`,
    sources: [
      { name: 'Google Developers Blog', url: 'https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/' },
      { name: 'Google Cloud Blog - A2A v0.3', url: 'https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade' },
      { name: 'Linux Foundation Press Release', url: 'https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project' },
      { name: 'GitHub Repository', url: 'https://github.com/a2aproject/A2A' }
    ]
  },
  {
    slug: 'agent-protocol-stack-a2a-mcp-x402-erc8004',
    title: 'The Agent Protocol Stack: The Four Layers Powering Autonomous AI',
    excerpt: "The AI agent revolution isn't just about smarter models—it's about infrastructure. Here's the complete stack that makes autonomous agents possible.",
    coverImage: '/images/stack-hero.webp',
    content: `# The Agent Protocol Stack: The Four Layers Powering Autonomous AI

**The AI agent revolution isn't just about smarter models—it's about infrastructure. Here's the complete stack that makes autonomous agents possible.**

## Why Infrastructure Matters

ChatGPT amazed the world. But here's the thing: a chatbot that can only talk is limited. The real opportunity is AI that can *act*—book flights, execute trades, manage systems, hire other AIs.

For that, agents need infrastructure:
- How do they communicate with each other?
- How do they access tools and data?
- How do they pay for services?
- How do they establish trust?

Four protocols have emerged to answer these questions. Together, they form the **Agent Protocol Stack**.

## The Stack at a Glance

| Layer | Protocol | Purpose | Think of it as... |
|-------|----------|---------|-------------------|
| **Communication** | A2A | Agent-to-agent messaging | Email for agents |
| **Capabilities** | MCP | Tools and resources | APIs for agents |
| **Payments** | x402 | Transactions | Credit card for agents |
| **Trust** | ERC-8004 | Identity and reputation | Passport for agents |

## Layer 1: Communication (A2A)

**What it does**: Enables agents to discover, message, and collaborate with each other.

**Created by**: Google, now Linux Foundation

**Without it**: Agents would need custom integrations for every connection—impossible to scale.

## Layer 2: Capabilities (MCP)

**What it does**: Connects AI models to tools, data, and resources.

**Created by**: Anthropic (makers of Claude)

**Without it**: Every AI would need custom code to access every tool—thousands of integrations.

## Layer 3: Payments (x402)

**What it does**: Enables agents to pay for services instantly and programmatically.

**Created by**: Coinbase

**Without it**: Agents couldn't buy API calls, compute time, or services from other agents.

## Layer 4: Trust (ERC-8004)

**What it does**: Provides verifiable identity and reputation for agents.

**Created by**: MetaMask, Google, Coinbase, Ethereum Foundation

**Without it**: No way to distinguish good agents from scam agents.

## How They Work Together

Here's a complete example showing all four protocols:

### Scenario: Agent needs image generation

**Step 1: Discovery (A2A + ERC-8004)**
Your agent queries the A2A registry for "image-generation" agents. Checks ERC-8004 reputation scores. Selects "ImageBot" with 98% positive feedback.

**Step 2: Capability Check (MCP)**
Your agent queries ImageBot's MCP endpoint. Discovers available tools: generate_image, upscale_image, edit_image.

**Step 3: Payment (x402)**
Your agent calls generate_image(). ImageBot responds: "402 Payment Required - $0.05 USDC". Your agent's wallet signs payment. ImageBot verifies, generates image.

**Step 4: Completion + Feedback (A2A + ERC-8004)**
ImageBot returns result via A2A. Your agent posts positive feedback to ERC-8004 registry.

Total time: ~2 seconds. No humans involved.

## The Opportunity

We're at an inflection point. The infrastructure for autonomous agents is being built *right now*. 

In 5 years, we'll look back at 2025-2026 as the period when the agent economy's foundation was laid—like 1995-1996 for the web.

---

**The bottom line**: A2A + MCP + x402 + ERC-8004 = the complete infrastructure for autonomous AI agents. Master this stack, and you're ready for the agent economy.`,
    sources: [
      { name: 'A2A GitHub', url: 'https://github.com/a2aproject/A2A' },
      { name: 'MCP Documentation', url: 'https://modelcontextprotocol.io' },
      { name: 'x402 Documentation', url: 'https://docs.cdp.coinbase.com/x402' },
      { name: 'EIP-8004', url: 'https://eips.ethereum.org/EIPS/eip-8004' }
    ]
  }
];

async function updateAll() {
  console.log('📝 Updating all articles with new content + images...\n');

  for (const article of articles) {
    console.log(`Updating: ${article.slug}`);
    
    await db.collection('articles').doc(article.slug).update({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage,
      sources: article.sources,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`  ✅ Done`);
  }

  console.log('\n🎉 All articles updated!');
  process.exit(0);
}

updateAll().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
