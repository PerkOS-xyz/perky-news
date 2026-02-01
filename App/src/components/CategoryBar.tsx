'use client';

import React from 'react';
import Link from 'next/link';
import { getAllCategories, categoryLabels } from '@/lib/articles';
import { useLanguage } from '@/lib/i18n';

export function CategoryBar() {
  const { language } = useLanguage();
  const categories = getAllCategories();

  return (
    <nav className='flex flex-wrap gap-4 py-4 border-b border-[#2d2548]/50'>
      <Link 
        href={`/${language}`}
        className='text-sm font-medium text-[#EB1B69] hover:text-[#EF5B57] transition-colors'
      >
        All
      </Link>
      {categories.map((category) => (
        <Link 
          key={category}
          href={`/${language}/category/${category}`}
          className='text-sm font-medium text-gray-400 hover:text-white transition-colors'
        >
          {categoryLabels[category]}
        </Link>
      ))}
    </nav>
  );
}
