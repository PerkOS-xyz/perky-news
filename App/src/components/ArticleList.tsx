'use client';

import React from 'react';
import { FeaturedArticle } from './FeaturedArticle';
import { ArticleCard } from './article-card';
import { Article } from '@/lib/articles';

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  const featured = articles.find(article => article.featured);
  const nonFeatured = articles.filter(article => !article.featured);

  return (
    <div className='grid gap-6'>
      {featured && <FeaturedArticle article={featured} />}
      {nonFeatured.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
