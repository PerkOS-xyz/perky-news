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

// ============================================================================
// VERIFIED ARTICLES - All content based on official sources
// ============================================================================

const articles = [
  // -------------------------------------------------------------------------
  // x402 Protocol V2
  // -------------------------------------------------------------------------
  {
    slug: 'x402-v2-multi-chain-payments-100m-transactions',
    title: 'x402 V2 Launches: Multi-Chain Payments After 100M+ Transactions',
    excerpt: 'Coinbase\'s x402 protocol releases V2 with wallet identity, API discovery, and multi-chain support after processing over 100 million payments since May 2025.',
    content: `# x402 V2 Launches: Multi-Chain Payments After 100M+ Transactions

The x402 protocol has reached a major milestone with its V2 upgrade, released on December 11, 2025. After six months of real-world usage since launching in May 2025, the protocol has processed over **100 million payments** across APIs, apps, and AI agents.

## What is x402?

x402 is an open standard for HTTP-native payments developed by Coinbase. Using the HTTP 402 status code (Payment Required), it enables seamless micropayments between AI agents, APIs, and applications without traditional payment forms or redirects.

## Key V2 Features

### Wallet-Based Identity
Agents can now establish verifiable identity through their wallets, enabling trust relationships between services. Clients can skip repaying on every call if the resource was previously purchased.

### Automatic API Discovery
New discovery mechanisms allow agents to find and connect with x402-enabled services automatically. Facilitators can crawl and index available endpoints without manual updates.

### Multi-Chain Support
V2 expands beyond Base to support multiple networks including Polygon, Solana, and other L2s using CAIP standards for cross-chain compatibility.

### Dynamic Payment Routing
The new 'payTo' routing enables per-request routing to addresses, roles, or callback-based payout logic—perfect for marketplaces and multi-tenant APIs.

## Developer Tools

The x402 protocol offers official SDKs for:
- **TypeScript** (@x402/sdk)
- **Python** (x402-python)
- **Go** (x402-go)

Key SDK improvements in V2:
- Modular paywall package (@x402/paywall)
- Lifecycle hooks for custom payment logic
- Multi-facilitator support
- Modernized HTTP headers (PAYMENT-REQUIRED, PAYMENT-RESPONSE)

## x402 Foundation

Coinbase and Cloudflare announced the x402 Foundation, an independent organization to drive standardization and adoption of HTTP-native payments.

---

**Sources:**
- [x402 V2 Launch Announcement](https://www.x402.org/writing/x402-v2-launch)
- [Coinbase Developer Documentation](https://docs.cdp.coinbase.com/x402/welcome)
- [The Block Coverage](https://www.theblock.co/post/382284/coinbase-incubated-x402-payments-protocol-built-for-ais-rolls-out-v2)`,
    category: 'x402',
    tags: ['x402', 'payments', 'coinbase', 'multi-chain', 'ai-agents'],
    author: 'Perky News',
    publishedAt: '2025-12-11',
    featured: true,
    sources: [
      { name: 'x402.org', url: 'https://www.x402.org/writing/x402-v2-launch' },
      { name: 'Coinbase Docs', url: 'https://docs.cdp.coinbase.com/x402/welcome' },
      { name: 'The Block', url: 'https://www.theblock.co/post/382284/coinbase-incubated-x402-payments-protocol-built-for-ais-rolls-out-v2' }
    ]
  },

  // -------------------------------------------------------------------------
  // ERC-8004 Trustless Agents
  // -------------------------------------------------------------------------
  {
    slug: 'erc-8004-trustless-agents-ethereum-standard',
    title: 'ERC-8004: The Ethereum Standard for Trustless AI Agents',
    excerpt: 'A new Ethereum standard enables AI agents to discover each other, build reputation, and interact without pre-existing trust. Builder program launched September 2025.',
    content: `# ERC-8004: The Ethereum Standard for Trustless AI Agents

ERC-8004 is a draft Ethereum standard that enables open-ended agent economies by allowing participants to discover, choose, and interact with AI agents across organizational boundaries without pre-existing trust.

## Authors

The standard was created by a cross-industry team:
- **Marco De Rossi** (MetaMask)
- **Davide Crapis** (Ethereum Foundation)
- **Jordan Ellis** (Google)
- **Erik Reppel** (Coinbase)

## Three Core Registries

### 1. Identity Registry
Uses ERC-721 (NFTs) for agent registration, making all agents browsable and transferable. Each agent gets a unique on-chain identifier that works across chains.

### 2. Reputation Registry
A standard interface for posting and fetching feedback signals. Scoring can happen on-chain (for composability) or off-chain (for sophisticated algorithms).

### 3. Validation Registry
Generic hooks for independent validation checks including:
- Stake-secured re-execution
- Zero-knowledge ML (zkML) proofs
- Trusted Execution Environment (TEE) oracles

## Integrations

ERC-8004 extends existing protocols:
- **A2A (Agent-to-Agent)**: Handles agent authentication and messaging
- **MCP (Model Context Protocol)**: Server capabilities and tools
- **x402**: Payment layer (orthogonal but compatible)

## Builder Program

The ERC-8004 Builder Program officially began on **September 23, 2025**, supporting teams implementing the standard on:
- Ethereum Sepolia
- Base Sepolia
- Linea Sepolia
- Hedera Testnet

## Trust Models

Security is proportional to value at risk:
- **Low-stake tasks** (e.g., ordering pizza): Simple reputation
- **High-stake tasks** (e.g., financial transactions): Full validation + staking

---

**Sources:**
- [EIP-8004 Specification](https://eips.ethereum.org/EIPS/eip-8004)
- [Ethereum Magicians Discussion](https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098)
- [8004.org Builder Program](https://8004.org/)`,
    category: 'erc-8004',
    tags: ['ethereum', 'erc-8004', 'ai-agents', 'trust', 'identity'],
    author: 'Perky News',
    publishedAt: '2025-08-13',
    featured: true,
    sources: [
      { name: 'EIP-8004', url: 'https://eips.ethereum.org/EIPS/eip-8004' },
      { name: 'Ethereum Magicians', url: 'https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098' },
      { name: '8004.org', url: 'https://8004.org/' }
    ]
  },

  // -------------------------------------------------------------------------
  // A2A Protocol
  // -------------------------------------------------------------------------
  {
    slug: 'a2a-protocol-google-linux-foundation',
    title: 'A2A Protocol: Google\'s Agent Communication Standard Joins Linux Foundation',
    excerpt: 'Google\'s Agent2Agent protocol, enabling AI agents to discover and collaborate securely, moves to the Linux Foundation with v0.3 release.',
    content: `# A2A Protocol: Google's Agent Communication Standard Joins Linux Foundation

The Agent2Agent (A2A) protocol, created by Google, has become an official Linux Foundation project as of June 23, 2025. The protocol enables secure, intelligent communication between AI agents across organizational boundaries.

## What is A2A?

A2A is an open, vendor-neutral protocol that allows independent AI agents to:
- **Discover each other** across networks
- **Negotiate communication formats** (text, files, streams)
- **Collaborate on tasks** without exposing private code or data

## Version 0.3 Release

On July 31, 2025, Google announced A2A v0.3 with:
- More stable interface for building agents
- Improved streaming reliability
- Better push notification mechanisms
- Support for dynamic UX negotiation within tasks

## Enterprise Adoption

According to a 2025 global AI survey:
- **29%** of enterprises already running agentic AI in production
- **44%** planning to deploy within a year
- Top goals: cost-cutting and reducing manual workloads

## Key Components

### Agent Cards
Agents advertise their skills and capabilities through AgentCards, allowing others to discover what they can do.

### Task Lifecycle
A2A handles complete task orchestration:
1. Task creation
2. Progress updates
3. Result delivery
4. Error handling

### Authentication
Built-in agent authentication ensures secure communication without pre-established relationships.

## Integration with Other Protocols

A2A works alongside:
- **MCP** (Model Context Protocol): For tool and resource access
- **ERC-8004**: For on-chain trust and reputation
- **x402**: For payments between agents

---

**Sources:**
- [Google Developers Blog - A2A Announcement](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [Google Cloud Blog - A2A v0.3](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade)
- [Linux Foundation Press Release](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project)
- [GitHub Repository](https://github.com/a2aproject/A2A)`,
    category: 'ai-agents',
    tags: ['a2a', 'google', 'linux-foundation', 'protocol', 'interoperability'],
    author: 'Perky News',
    publishedAt: '2025-06-23',
    featured: true,
    sources: [
      { name: 'Google Developers', url: 'https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/' },
      { name: 'Linux Foundation', url: 'https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project' },
      { name: 'GitHub', url: 'https://github.com/a2aproject/A2A' }
    ]
  },

  // -------------------------------------------------------------------------
  // ETHGlobal 2026 Hackathons
  // -------------------------------------------------------------------------
  {
    slug: 'ethglobal-2026-hackathon-calendar',
    title: 'ETHGlobal 2026 Hackathon Calendar: 5 Cities, 5 Opportunities',
    excerpt: 'ETHGlobal announces their 2026 in-person hackathon schedule spanning Cannes, New York, Lisbon, Tokyo, and Mumbai.',
    content: `# ETHGlobal 2026 Hackathon Calendar: 5 Cities, 5 Opportunities

ETHGlobal has announced their 2026 in-person hackathon calendar, offering builders five opportunities to hack on cutting-edge Web3 technology across the globe.

## 2026 Schedule

| Event | Location | Dates |
|-------|----------|-------|
| **ETHGlobal Cannes** | 🇫🇷 France | April 3-5 |
| **ETHGlobal New York** | 🇺🇸 USA | June 12-14 |
| **ETHGlobal Lisbon** | 🇵🇹 Portugal | July 24-26 |
| **ETHGlobal Tokyo** | 🇯🇵 Japan | September 25-27 |
| **ETHGlobal Mumbai** | 🇮🇳 India | Q4 (TBA) |

## Also in 2026

### ETHPrague
- **Dates**: May 8-10, 2026
- **Location**: Prague, Czech Republic
- **Theme**: Building a solarpunk future
- **Website**: [ethprague.com](https://ethprague.com)

## What to Expect

ETHGlobal hackathons offer:
- **Cutting-edge tech**: Experiment with the latest Web3 technologies
- **Prizes**: Substantial bounties from leading protocols
- **Mentorship**: Direct access to core developers
- **Community**: Connect with builders worldwide

## ETHGlobal Plus

For serious builders, ETHGlobal Plus provides:
- Priority registration for all hackathons
- Worry-free participation
- Focus on shipping products

## Tips for Success

1. **Start with a problem**, not a technology
2. **Keep scope small** - MVPs win prizes
3. **Practice your pitch** - judges have limited time
4. **Network actively** - many teams form on-site

---

**Sources:**
- [ETHGlobal Official](https://ethglobal.com)
- [ETHGlobal 2026 Announcement](https://x.com/ETHGlobal/status/1992919708589576215)
- [ETHPrague 2026](https://ethprague.com)`,
    category: 'hackathons',
    tags: ['ethglobal', 'hackathons', 'web3', 'events', '2026'],
    author: 'Perky News',
    publishedAt: '2026-01-15',
    featured: false,
    sources: [
      { name: 'ETHGlobal', url: 'https://ethglobal.com' },
      { name: 'ETHPrague', url: 'https://ethprague.com' }
    ]
  },

  // -------------------------------------------------------------------------
  // Agent Protocol Stack
  // -------------------------------------------------------------------------
  {
    slug: 'agent-protocol-stack-a2a-mcp-x402-erc8004',
    title: 'The Agent Protocol Stack: How A2A, MCP, x402, and ERC-8004 Work Together',
    excerpt: 'Understanding the four protocols that power the autonomous agent economy: communication, tools, payments, and trust.',
    content: `# The Agent Protocol Stack: How A2A, MCP, x402, and ERC-8004 Work Together

The future of AI isn't just about models—it's about infrastructure. Four protocols are emerging as the foundational stack for autonomous AI agents.

## The Stack Overview

| Layer | Protocol | Purpose | Creator |
|-------|----------|---------|---------|
| **Communication** | A2A | Agent-to-agent messaging | Google |
| **Capabilities** | MCP | Tools and resources | Anthropic |
| **Payments** | x402 | HTTP-native transactions | Coinbase |
| **Trust** | ERC-8004 | Identity and reputation | Cross-industry |

## How They Work Together

### 1. Discovery (A2A + ERC-8004)
An agent looking for services can:
- Query the ERC-8004 Identity Registry for registered agents
- Check reputation scores before engaging
- Discover capabilities via A2A AgentCards

### 2. Capability Access (MCP)
Once an agent is selected:
- MCP exposes available tools, prompts, and resources
- Standardized function calling interface
- Context management across interactions

### 3. Payment (x402)
When a service requires payment:
- Server responds with HTTP 402 + payment requirements
- Client signs payment (USDC, etc.)
- Transaction settles on-chain
- Access granted

### 4. Trust & Verification (ERC-8004)
After interaction:
- Client posts feedback to Reputation Registry
- Validators can verify work quality
- Future clients benefit from accumulated reputation

## Example Flow

\`\`\`
Agent A needs image generation:

1. [ERC-8004] Query registry for image agents
2. [ERC-8004] Check reputation scores → Select Agent B
3. [A2A] Send task request to Agent B
4. [MCP] Agent B exposes generation tool
5. [x402] Agent A pays $0.05 per image
6. [A2A] Agent B returns generated image
7. [ERC-8004] Agent A posts positive feedback
\`\`\`

## Why This Matters

- **Interoperability**: Agents from different vendors can collaborate
- **Trustless**: No pre-existing relationships required
- **Programmable**: Everything is API-driven
- **Composable**: Mix and match protocols as needed

## Getting Started

Each protocol has official documentation:
- **A2A**: [a2aproject.org](https://github.com/a2aproject/A2A)
- **MCP**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **x402**: [docs.cdp.coinbase.com/x402](https://docs.cdp.coinbase.com/x402)
- **ERC-8004**: [eips.ethereum.org/EIPS/eip-8004](https://eips.ethereum.org/EIPS/eip-8004)

---

**Sources:**
- Official documentation for each protocol`,
    category: 'ai-agents',
    tags: ['a2a', 'mcp', 'x402', 'erc-8004', 'protocol-stack', 'infrastructure'],
    author: 'Perky News',
    publishedAt: '2026-01-20',
    featured: true,
    sources: [
      { name: 'A2A GitHub', url: 'https://github.com/a2aproject/A2A' },
      { name: 'MCP Docs', url: 'https://modelcontextprotocol.io' },
      { name: 'x402 Docs', url: 'https://docs.cdp.coinbase.com/x402' },
      { name: 'EIP-8004', url: 'https://eips.ethereum.org/EIPS/eip-8004' }
    ]
  }
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seed() {
  console.log('🌱 Seeding verified articles to Firebase...\n');

  for (const article of articles) {
    console.log(`📝 Creating: ${article.slug}`);
    
    await db.collection('articles').doc(article.slug).set({
      ...article,
      status: 'published',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      validatedAt: new Date().toISOString(),
    });
    
    console.log(`   ✅ Done`);
  }

  console.log(`\n🎉 Created ${articles.length} verified articles!`);
  console.log('\nArticles:');
  articles.forEach(a => console.log(`  - https://perky.news/articles/${a.slug}`));
  
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
