import React from 'react';
import { NewsletterForm } from './newsletter-form';

export function Sidebar({ popularArticles }) {
  return (
    <aside className='p-4 bg-gray-200'>
      <h3 className='font-bold mb-4'>Most Popular</h3>
      <ul className='mb-6'>
        {popularArticles.map(article => (
          <li key={article.id} className='mb-2'>
            <a href={'/articles/' + article.id} className='text-blue-500 hover:underline'>{article.title}</a>
          </li>
        ))}
      </ul>
      <h3 className='font-bold mb-4'>Newsletter</h3>
      <NewsletterForm />
    </aside>
  );
}

