import React from 'react';
import Link from 'next/link';

export function CategoryBar() {
  const categories = ['AI Agents', 'Web3', 'DeFi', 'NFTs', 'Tech', 'Startups'];

  return (
    <div className='flex justify-around bg-gray-800 p-3 text-white'>
      {categories.map((category) => (
        <Link key={category} href={'/articles?category=' + category.toLowerCase().replace(' ', '-')}>  
          <span className='cursor-pointer hover:underline'>{category}</span>
        </Link>
      ))}
    </div>
  );
}

