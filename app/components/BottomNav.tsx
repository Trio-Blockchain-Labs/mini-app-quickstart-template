'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-around items-center z-50 pb-8">
      <Link
        href="/campus"
        className={`flex flex-col items-center gap-1 ${
          pathname === '/campus' ? 'text-[#0000ff]' : 'text-gray-400'
        }`}
      >
        <AcademicCapIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Campus</span>
      </Link>

      <Link
        href="/admin"
        className={`flex flex-col items-center gap-1 ${
          pathname === '/admin' ? 'text-[#0000ff]' : 'text-gray-400'
        }`}
      >
        <ShieldCheckIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Admin</span>
      </Link>
    </div>
  );
}
