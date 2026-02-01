import React from 'react';

export function Header() {
  return (
    <header className='flex items-center justify-between p-4 bg-black'>
      <div className='text-white text-lg font-bold'>👾 Perky News</div>
      <nav className='space-x-4'>
        <a href='/' className='text-white'>News</a>
        <a href='/premium' className='text-white'>Premium</a>
        <a href='/about' className='text-white'>About</a>
        <a href='/login' className='text-white'>Login</a>
      </nav>
    </header>
  );
}

