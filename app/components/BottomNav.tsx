'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AcademicCapIcon, HomeIcon, LinkIcon } from '@heroicons/react/24/solid';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-around items-center z-50 pb-8">
      <Link 
        href="/attendance" 
        className={`flex flex-col items-center gap-1 ${
          pathname === '/attendance' ? 'text-[#0000ff]' : 'text-gray-400'
        }`}
      >
        <AcademicCapIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Giriş-Çıkış</span>
      </Link>
      
      <Link 
        href="/examples" 
        className={`flex flex-col items-center gap-1 ${
          pathname === '/examples' ? 'text-[#0000ff]' : 'text-gray-400'
        }`}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Home</span>
      </Link>
      
      <Link 
        href="/links" 
        className={`flex flex-col items-center gap-1 ${
          pathname === '/links' ? 'text-[#0000ff]' : 'text-gray-400'
        }`}
      >
        <LinkIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Links</span>
      </Link>
    </div>
  );
}
