export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

export const translations: Record<LanguageCode, {
  // Navigation
  nav: {
    news: string;
    articles: string;
    about: string;
    subscribe: string;
  };
  // Home page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    latestNews: string;
    mostPopular: string;
    meetPerky: string;
    perkyDescription: string;
    stayUpdated: string;
    newsletterCta: string;
    emailPlaceholder: string;
    subscribeButton: string;
  };
  // Article
  article: {
    backToHome: string;
    sources: string;
    minRead: string;
    relatedArticles: string;
  };
  // Categories
  categories: {
    x402: string;
    'erc-8004': string;
    'ai-agents': string;
    hackathons: string;
    defi: string;
    general: string;
    openclaw: string;
    eliza: string;
  };
  // Footer
  footer: {
    tagline: string;
    quickLinks: string;
    topics: string;
    legal: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
}> = {
  en: {
    nav: {
      news: 'News',
      articles: 'Articles',
      about: 'About',
      subscribe: 'Subscribe',
    },
    home: {
      heroTitle: 'The Agent Economy Chronicle',
      heroSubtitle: 'Your daily source for AI agents, Web3 protocols, and the future of autonomous systems.',
      latestNews: 'Latest News',
      mostPopular: 'Most Popular',
      meetPerky: 'Meet Perky',
      perkyDescription: 'Your friendly guide to the agent economy. Perky curates the latest news on AI agents, Web3 protocols, and the future of autonomous systems.',
      stayUpdated: 'Stay Updated',
      newsletterCta: 'Get the latest agent economy news delivered to your inbox.',
      emailPlaceholder: 'Enter your email',
      subscribeButton: 'Subscribe',
    },
    article: {
      backToHome: '← Back to Home',
      sources: 'Sources',
      minRead: 'min read',
      relatedArticles: 'Related Articles',
    },
    categories: {
      x402: 'x402 Protocol',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'AI Agents',
      hackathons: 'Hackathons',
      defi: 'DeFi',
      general: 'General',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: 'The Agent Economy Chronicle',
      quickLinks: 'Quick Links',
      topics: 'Topics',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2026 Perky News. All rights reserved.',
    },
  },
  es: {
    nav: {
      news: 'Noticias',
      articles: 'Artículos',
      about: 'Nosotros',
      subscribe: 'Suscribirse',
    },
    home: {
      heroTitle: 'La Crónica de la Economía de Agentes',
      heroSubtitle: 'Tu fuente diaria de agentes IA, protocolos Web3 y el futuro de los sistemas autónomos.',
      latestNews: 'Últimas Noticias',
      mostPopular: 'Más Popular',
      meetPerky: 'Conoce a Perky',
      perkyDescription: 'Tu guía amigable a la economía de agentes. Perky selecciona las últimas noticias sobre agentes IA, protocolos Web3 y el futuro de los sistemas autónomos.',
      stayUpdated: 'Mantente Informado',
      newsletterCta: 'Recibe las últimas noticias de la economía de agentes en tu correo.',
      emailPlaceholder: 'Ingresa tu email',
      subscribeButton: 'Suscribirse',
    },
    article: {
      backToHome: '← Volver al Inicio',
      sources: 'Fuentes',
      minRead: 'min de lectura',
      relatedArticles: 'Artículos Relacionados',
    },
    categories: {
      x402: 'Protocolo x402',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'Agentes IA',
      hackathons: 'Hackathons',
      defi: 'DeFi',
      general: 'General',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: 'La Crónica de la Economía de Agentes',
      quickLinks: 'Enlaces Rápidos',
      topics: 'Temas',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      copyright: '© 2026 Perky News. Todos los derechos reservados.',
    },
  },
  fr: {
    nav: {
      news: 'Actualités',
      articles: 'Articles',
      about: 'À propos',
      subscribe: "S'abonner",
    },
    home: {
      heroTitle: "La Chronique de l'Économie des Agents",
      heroSubtitle: "Votre source quotidienne sur les agents IA, les protocoles Web3 et l'avenir des systèmes autonomes.",
      latestNews: 'Dernières Actualités',
      mostPopular: 'Plus Populaire',
      meetPerky: 'Rencontrez Perky',
      perkyDescription: "Votre guide amical de l'économie des agents. Perky sélectionne les dernières nouvelles sur les agents IA, les protocoles Web3 et l'avenir des systèmes autonomes.",
      stayUpdated: 'Restez Informé',
      newsletterCta: "Recevez les dernières nouvelles de l'économie des agents dans votre boîte mail.",
      emailPlaceholder: 'Entrez votre email',
      subscribeButton: "S'abonner",
    },
    article: {
      backToHome: "← Retour à l'Accueil",
      sources: 'Sources',
      minRead: 'min de lecture',
      relatedArticles: 'Articles Connexes',
    },
    categories: {
      x402: 'Protocole x402',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'Agents IA',
      hackathons: 'Hackathons',
      defi: 'DeFi',
      general: 'Général',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: "La Chronique de l'Économie des Agents",
      quickLinks: 'Liens Rapides',
      topics: 'Sujets',
      legal: 'Mentions Légales',
      privacy: 'Politique de Confidentialité',
      terms: "Conditions d'Utilisation",
      copyright: '© 2026 Perky News. Tous droits réservés.',
    },
  },
  it: {
    nav: {
      news: 'Notizie',
      articles: 'Articoli',
      about: 'Chi Siamo',
      subscribe: 'Iscriviti',
    },
    home: {
      heroTitle: "La Cronaca dell'Economia degli Agenti",
      heroSubtitle: 'La tua fonte quotidiana su agenti IA, protocolli Web3 e il futuro dei sistemi autonomi.',
      latestNews: 'Ultime Notizie',
      mostPopular: 'Più Popolari',
      meetPerky: 'Incontra Perky',
      perkyDescription: "La tua guida amichevole all'economia degli agenti. Perky seleziona le ultime notizie su agenti IA, protocolli Web3 e il futuro dei sistemi autonomi.",
      stayUpdated: 'Rimani Aggiornato',
      newsletterCta: "Ricevi le ultime notizie dell'economia degli agenti nella tua casella di posta.",
      emailPlaceholder: 'Inserisci la tua email',
      subscribeButton: 'Iscriviti',
    },
    article: {
      backToHome: '← Torna alla Home',
      sources: 'Fonti',
      minRead: 'min di lettura',
      relatedArticles: 'Articoli Correlati',
    },
    categories: {
      x402: 'Protocollo x402',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'Agenti IA',
      hackathons: 'Hackathon',
      defi: 'DeFi',
      general: 'Generale',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: "La Cronaca dell'Economia degli Agenti",
      quickLinks: 'Link Rapidi',
      topics: 'Argomenti',
      legal: 'Legale',
      privacy: 'Privacy Policy',
      terms: 'Termini di Servizio',
      copyright: '© 2026 Perky News. Tutti i diritti riservati.',
    },
  },
  de: {
    nav: {
      news: 'Nachrichten',
      articles: 'Artikel',
      about: 'Über uns',
      subscribe: 'Abonnieren',
    },
    home: {
      heroTitle: 'Die Chronik der Agenten-Wirtschaft',
      heroSubtitle: 'Ihre tägliche Quelle für KI-Agenten, Web3-Protokolle und die Zukunft autonomer Systeme.',
      latestNews: 'Neueste Nachrichten',
      mostPopular: 'Am Beliebtesten',
      meetPerky: 'Triff Perky',
      perkyDescription: 'Ihr freundlicher Führer durch die Agenten-Wirtschaft. Perky kuratiert die neuesten Nachrichten über KI-Agenten, Web3-Protokolle und die Zukunft autonomer Systeme.',
      stayUpdated: 'Bleiben Sie Informiert',
      newsletterCta: 'Erhalten Sie die neuesten Nachrichten der Agenten-Wirtschaft in Ihrem Postfach.',
      emailPlaceholder: 'E-Mail eingeben',
      subscribeButton: 'Abonnieren',
    },
    article: {
      backToHome: '← Zurück zur Startseite',
      sources: 'Quellen',
      minRead: 'Min. Lesezeit',
      relatedArticles: 'Verwandte Artikel',
    },
    categories: {
      x402: 'x402-Protokoll',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'KI-Agenten',
      hackathons: 'Hackathons',
      defi: 'DeFi',
      general: 'Allgemein',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: 'Die Chronik der Agenten-Wirtschaft',
      quickLinks: 'Schnelllinks',
      topics: 'Themen',
      legal: 'Rechtliches',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      copyright: '© 2026 Perky News. Alle Rechte vorbehalten.',
    },
  },
  ja: {
    nav: {
      news: 'ニュース',
      articles: '記事',
      about: '概要',
      subscribe: '購読',
    },
    home: {
      heroTitle: 'エージェント経済クロニクル',
      heroSubtitle: 'AIエージェント、Web3プロトコル、自律システムの未来に関する毎日の情報源。',
      latestNews: '最新ニュース',
      mostPopular: '人気記事',
      meetPerky: 'Perkyに会う',
      perkyDescription: 'エージェント経済へのフレンドリーなガイド。PerkyがAIエージェント、Web3プロトコル、自律システムの最新ニュースをお届けします。',
      stayUpdated: '最新情報を入手',
      newsletterCta: 'エージェント経済の最新ニュースをメールでお届けします。',
      emailPlaceholder: 'メールアドレスを入力',
      subscribeButton: '購読する',
    },
    article: {
      backToHome: '← ホームに戻る',
      sources: '情報源',
      minRead: '分で読める',
      relatedArticles: '関連記事',
    },
    categories: {
      x402: 'x402プロトコル',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'AIエージェント',
      hackathons: 'ハッカソン',
      defi: 'DeFi',
      general: '一般',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: 'エージェント経済クロニクル',
      quickLinks: 'クイックリンク',
      topics: 'トピック',
      legal: '法的情報',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      copyright: '© 2026 Perky News. All rights reserved.',
    },
  },
  ko: {
    nav: {
      news: '뉴스',
      articles: '기사',
      about: '소개',
      subscribe: '구독',
    },
    home: {
      heroTitle: '에이전트 경제 크로니클',
      heroSubtitle: 'AI 에이전트, Web3 프로토콜, 자율 시스템의 미래에 대한 일일 정보 소스.',
      latestNews: '최신 뉴스',
      mostPopular: '인기 기사',
      meetPerky: 'Perky 만나기',
      perkyDescription: '에이전트 경제를 위한 친절한 가이드. Perky가 AI 에이전트, Web3 프로토콜, 자율 시스템에 대한 최신 뉴스를 큐레이션합니다.',
      stayUpdated: '최신 정보 받기',
      newsletterCta: '에이전트 경제의 최신 뉴스를 이메일로 받아보세요.',
      emailPlaceholder: '이메일 입력',
      subscribeButton: '구독하기',
    },
    article: {
      backToHome: '← 홈으로 돌아가기',
      sources: '출처',
      minRead: '분 소요',
      relatedArticles: '관련 기사',
    },
    categories: {
      x402: 'x402 프로토콜',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'AI 에이전트',
      hackathons: '해커톤',
      defi: 'DeFi',
      general: '일반',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: '에이전트 경제 크로니클',
      quickLinks: '빠른 링크',
      topics: '주제',
      legal: '법적 고지',
      privacy: '개인정보 처리방침',
      terms: '이용약관',
      copyright: '© 2026 Perky News. All rights reserved.',
    },
  },
  zh: {
    nav: {
      news: '新闻',
      articles: '文章',
      about: '关于',
      subscribe: '订阅',
    },
    home: {
      heroTitle: '代理经济编年史',
      heroSubtitle: '您获取AI代理、Web3协议和自主系统未来的每日信息来源。',
      latestNews: '最新新闻',
      mostPopular: '最受欢迎',
      meetPerky: '认识Perky',
      perkyDescription: '您通往代理经济的友好向导。Perky为您精选AI代理、Web3协议和自主系统的最新新闻。',
      stayUpdated: '保持更新',
      newsletterCta: '将代理经济的最新新闻发送到您的邮箱。',
      emailPlaceholder: '输入您的邮箱',
      subscribeButton: '订阅',
    },
    article: {
      backToHome: '← 返回首页',
      sources: '来源',
      minRead: '分钟阅读',
      relatedArticles: '相关文章',
    },
    categories: {
      x402: 'x402协议',
      'erc-8004': 'ERC-8004',
      'ai-agents': 'AI代理',
      hackathons: '黑客松',
      defi: 'DeFi',
      general: '综合',
      openclaw: 'OpenClaw',
      eliza: 'ElizaOS',
    },
    footer: {
      tagline: '代理经济编年史',
      quickLinks: '快速链接',
      topics: '主题',
      legal: '法律信息',
      privacy: '隐私政策',
      terms: '服务条款',
      copyright: '© 2026 Perky News. 保留所有权利。',
    },
  },
};

export function getTranslation(lang: LanguageCode) {
  return translations[lang] || translations.en;
}

export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  const supported = languages.map(l => l.code);
  
  if (supported.includes(browserLang as LanguageCode)) {
    return browserLang as LanguageCode;
  }
  
  return 'en';
}
