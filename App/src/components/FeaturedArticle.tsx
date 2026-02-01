'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/articles';
import { useLanguage } from '@/lib/i18n';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const { language } = useLanguage();

  return (
    <Link href={`/${language}/articles/${article.slug}`} className='block group'>
      <div className='relative overflow-hidden rounded-xl bg-[#1B1833] border border-[#2d2548]/50'>
        {article.coverImage && (
          <img 
            src={article.coverImage} 
            alt={article.title}
            className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
          />
        )}
        <div className='p-6'>
          <span className='text-xs text-[#EB1B69] font-semibold uppercase tracking-wider'>
            {article.category}
          </span>
          <h2 className='text-2xl font-bold mt-2 group-hover:text-[#EB1B69] transition-colors'>
            {article.title}
          </h2>
          <p className='text-gray-400 mt-2 line-clamp-2'>{article.excerpt}</p>
          <p className='text-sm text-gray-500 mt-4'>{article.publishedAt}</p>
        </div>
      </div>
    </Link>
  );
}
