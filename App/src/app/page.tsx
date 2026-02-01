import React from 'react';
import { Header } from '@/components/Header';
import { CategoryBar } from '@/components/CategoryBar';
import { ArticleList } from '@/components/ArticleList';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { getArticles, getFeaturedArticles } from '@/lib/articles';

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const recentArticles = getArticles();

  return (
    <div className='flex'>
      <main className='w-8/12 p-4'>
        <Header />
        <CategoryBar />
        <ArticleList articles={recentArticles} />
      </main>
      <Sidebar popularArticles={recentArticles.slice(0, 5)} />
    </div>
  );
}

