import React from 'react';

export function FeaturedArticle({ article }) {
  return (
    <div className='flex flex-col mb-6'>
      <img src={article.image} alt={article.title} className='w-full h-64 object-cover' />
      <h2 className='text-xl mt-2 font-bold'>{article.title}</h2>
      <p className='text-gray-500'>{article.excerpt}</p>
      <span className='text-gray-400'>{article.category} • {article.date}</span>
    </div>
  );
}

