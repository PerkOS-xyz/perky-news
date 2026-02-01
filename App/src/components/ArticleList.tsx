import React from 'react';
import { FeaturedArticle } from './FeaturedArticle';
import { ArticleCard } from './ArticleCard';

export function ArticleList({ articles }) {
  return (
    <div className='grid gap-6'>
      <FeaturedArticle article={articles.find(article => article.featured)} />
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

