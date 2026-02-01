import React from 'react';

export function Footer() {
  return (
    <footer className='flex justify-between items-center p-4 bg-gray-800 text-white'>
      <span>&copy; 2026 Perky News. All rights reserved.</span>
      <img src='/perky-mascot.jpg' alt='Perky mascot' className='w-10 h-10 opacity-70' />
    </footer>
  );
}

