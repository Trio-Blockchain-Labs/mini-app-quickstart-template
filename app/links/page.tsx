'use client';

import BottomNav from '../components/BottomNav';

export default function LinksPage() {
  return (
    <div className="flex flex-col items-center p-4 space-y-6 pb-24 min-h-screen bg-[#eef0f3]">
      <h1 className="text-2xl font-bold text-[#121420]">Linkler</h1>
      <p className="text-gray-700 text-sm text-center max-w-md">
        Linkler bölümü demo için sadeleştirildi. Kampüs işlemleri için lütfen cüzdanla giriş yapıp Campus veya Admin sekmesini kullanın.
      </p>
      <BottomNav />
    </div>
  );
}
