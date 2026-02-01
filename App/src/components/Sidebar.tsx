'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/articles';
import { useLanguage } from '@/lib/i18n';

interface SidebarProps {
  popularArticles: Article[];
}

export function Sidebar({ popularArticles }: SidebarProps) {
  const { language, t } = useLanguage();

  return (
    <aside className='w-4/12 p-4 border-l border-[#2d2548]/50'>
      {/* Most Popular */}
      <div className='mb-8'>
        <h3 className='text-lg font-bold text-[#EB1B69] mb-4'>{t.home.mostPopular}</h3>
        <div className='space-y-4'>
          {popularArticles.map((article, index) => (
            <Link 
              key={article.slug} 
              href={`/${language}/articles/${article.slug}`}
              className='block group'
            >
              <div className='flex gap-3'>
                <span className='text-2xl font-bold text-[#2d2548]'>{index + 1}</span>
                <p className='text-sm group-hover:text-[#EB1B69] transition-colors line-clamp-2'>
                  {article.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className='bg-[#1B1833] rounded-xl p-6 border border-[#2d2548]/50'>
        <h3 className='text-lg font-bold mb-2'>{t.home.stayUpdated}</h3>
        <p className='text-sm text-gray-400 mb-4'>{t.home.newsletterCta}</p>
        <input 
          type='email' 
          placeholder={t.home.emailPlaceholder}
          className='w-full px-4 py-2 rounded-lg bg-[#0E0716] border border-[#2d2548] text-sm mb-3'
        />
        <button className='w-full py-2 bg-gradient-to-r from-[#EB1B69] to-[#EF5B57] rounded-lg font-semibold text-sm'>
          {t.home.subscribeButton}
        </button>
      </div>

      {/* Perky Mascot */}
      <div className='mt-8 text-center'>
        <img 
          src='/perky-mascot.jpg' 
          alt='Perky' 
          className='w-20 h-20 mx-auto rounded-full opacity-70'
        />
        <p className='text-xs text-gray-500 mt-2'>Powered by Perky 🤖</p>
      </div>
    </aside>
  );
}
