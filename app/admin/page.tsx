'use client';

import { useMemo, useState } from 'react';
import BottomNav from '../components/BottomNav';

type Student = {
  id: string;
  name: string;
  department: string;
  year: string;
  status: 'active' | 'suspended';
};

const DEMO_USERNAME = 'admin@isik';
const DEMO_PASSWORD = 'isik123';

const students: Student[] = [
  { id: '20240001', name: 'Elif Kaya', department: 'Bilgisayar Mühendisliği', year: '3', status: 'active' },
  { id: '20240002', name: 'Mert Çelik', department: 'Endüstri Mühendisliği', year: '2', status: 'active' },
  { id: '20240003', name: 'Deniz Arslan', department: 'İşletme', year: '4', status: 'suspended' },
];

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scanValue, setScanValue] = useState('');
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedStudent = useMemo(() => {
    const id = (scanValue || searchId).trim();
    return students.find((s) => s.id === id) || null;
  }, [scanValue, searchId]);

  const handleLogin = () => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      setIsLoggedIn(true);
      setError(null);
      return;
    }
    setError('Geçersiz kullanıcı adı veya şifre (demo).');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#eef0f3] p-4 pb-24">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-6 mt-4 space-y-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-[#0000ff] uppercase">Admin Demo</p>
          <h1 className="text-2xl font-bold text-[#121420]">Yönetici Paneli</h1>
          <p className="text-gray-600 text-sm">
            Demo giriş bilgileri: <strong>{DEMO_USERNAME}</strong> / <strong>{DEMO_PASSWORD}</strong>
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <label className="text-sm text-[#32353d]">
              Kullanıcı Adı
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@isik"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0000ff] outline-none"
              />
            </label>
            <label className="text-sm text-[#32353d]">
              Şifre
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="isik123"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0000ff] outline-none"
              />
            </label>
            <button
              onClick={handleLogin}
              className="w-full bg-[#0000ff] text-button-text font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        ) : (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            Giriş başarılı. QR taraması veya manuel arama ile öğrenci bilgisine erişebilirsiniz.
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {isLoggedIn && (
        <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-6 mt-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0000ff] uppercase">QR / Manuel</p>
              <h2 className="text-xl font-bold text-[#121420]">Öğrenci Doğrulama</h2>
            </div>
            <span className="text-xs text-gray-500">QR kod = öğrenci no</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm text-[#32353d]">
              QR Tarama (demo)
              <input
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
                placeholder="QR verisi: 20240001"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0000ff] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Gerçek QR okuma için burada donanıma erişim eklenir.</p>
            </label>

            <label className="text-sm text-[#32353d]">
              Manuel Öğrenci No
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="20240002"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0000ff] outline-none"
              />
            </label>
          </div>

          {selectedStudent ? (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-[#121420]">{selectedStudent.name}</h3>
              <p className="text-sm text-gray-700">Öğrenci No: {selectedStudent.id}</p>
              <p className="text-sm text-gray-700">Bölüm: {selectedStudent.department}</p>
              <p className="text-sm text-gray-700">Sınıf: {selectedStudent.year}</p>
              <p className={`text-sm font-semibold mt-2 ${selectedStudent.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                Durum: {selectedStudent.status === 'active' ? 'Aktif' : 'Askıda'}
              </p>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-600">
              QR verisini veya öğrenci numarasını girin.
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>Dummy öğrenciler: 20240001 (Elif), 20240002 (Mert), 20240003 (Deniz).</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
