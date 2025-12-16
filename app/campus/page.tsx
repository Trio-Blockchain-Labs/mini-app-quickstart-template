'use client';

import { useMemo, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import BottomNav from '../components/BottomNav';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';

const vendorAddress = '0x0000000000000000000000000000000000000001' as `0x${string}`;
const campusName = 'Isik University';

type Role = 'student' | 'merchant' | 'admin';

const roleCards: { id: Role; title: string; description: string }[] = [
  {
    id: 'student',
    title: 'Öğrenci',
    description: 'Cüzdanla kayıt ol, kampüs girişini imzala, yemek ve kulüp ödemelerini coin ile yap.',
  },
  {
    id: 'merchant',
    title: 'İşletme',
    description: 'Kampüs içi işletmeler için hızlı tahsilat; öğrenciler Base’te coin ile öder.',
  },
  {
    id: 'admin',
    title: 'Yönetici',
    description: 'Kampüs geçişleri ve işletme tahsilatlarını denetle, yetki ver.',
  },
];

export default function CampusPage() {
  const { address, isConnected } = useAccount();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [studentId, setStudentId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [entryProof, setEntryProof] = useState<string | null>(null);
  const [entryStatus, setEntryStatus] = useState<string | null>(null);
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const calls = useMemo(
    () => [
      {
        to: vendorAddress,
        value: BigInt(0), // Demo: 0 ETH; gerçek ödeme için tutarı güncelleyin
        data: '0x' as `0x${string}`,
      },
    ],
    []
  );

  const handleEntryProof = async () => {
    if (!address) {
      setEntryStatus('Önce cüzdan bağlayın.');
      return;
    }

    try {
      setEntryStatus('İmza talebi gönderildi...');
      const proof = await signMessageAsync({
        message: `Kampüs girişi: ${campusName}\nRol: ${selectedRole}\nÖğrenci No: ${studentId || 'N/A'}\nAdres: ${address}\nZaman: ${new Date().toISOString()}`,
      });
      setEntryProof(proof);
      setEntryStatus('Giriş imzası alındı. Kapı doğrulayabilir.');
    } catch (error) {
      setEntryStatus('İmza iptal edildi veya hata oluştu.');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-10 pb-24 min-h-screen bg-[#eef0f3]">
      <header className="w-full max-w-4xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#121420]">Işık Üniversitesi Kampüs</h1>
        <p className="text-[#32353d] text-base sm:text-lg leading-relaxed">
          Öğrenciler cüzdanla kayıt olur, kampüs geçişini imzalar ve işletmelere coin ile ödeme yapar.
          İşletme ve yöneticiler aynı ağda tahsilat ve denetim yapar.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Wallet>
            <ConnectWallet className="bg-[#0000ff] text-button-text px-4 py-2 rounded-lg font-semibold">
              Cüzdan Bağla
            </ConnectWallet>
          </Wallet>
          {address && (
            <span className="text-sm text-gray-500">Bağlı: {address.slice(0, 6)}...{address.slice(-4)}</span>
          )}
        </div>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleCards.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`text-left p-4 rounded-2xl border transition-all ${
              selectedRole === role.id ? 'border-[#0000ff] bg-white shadow-lg' : 'border-gray-200 bg-white/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#121420]">{role.title}</h3>
              {selectedRole === role.id && <span className="text-[#0000ff] text-sm font-semibold">Aktif</span>}
            </div>
            <p className="text-sm text-[#4b5160] mt-2 leading-relaxed">{role.description}</p>
          </button>
        ))}
      </section>

      <section className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0000ff] uppercase">Adım 1</p>
            <h2 className="text-xl font-bold text-[#121420]">Kayıt ve Kimlik</h2>
          </div>
          <span className="text-xs text-gray-500">Cüzdana bağlı rol</span>
        </div>

        {selectedRole === 'student' && (
          <div className="space-y-3">
            <label className="block text-sm text-[#32353d]">
              Öğrenci Numarası
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 20241234"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0000ff] outline-none"
              />
            </label>
            <p className="text-sm text-gray-600">Cüzdan adresi + öğrenci no ile kimlik eşleştirmesi yapılır.</p>
          </div>
        )}

        {selectedRole === 'merchant' && (
          <div className="space-y-3">
            <label className="block text-sm text-[#32353d]">
              İşletme Adı
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Kampüs Kafe"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0000ff] outline-none"
              />
            </label>
            <p className="text-sm text-gray-600">İşletme hesapları tahsilat için Base’te kayıtlı olur.</p>
          </div>
        )}

        {selectedRole === 'admin' && (
          <p className="text-sm text-gray-700">
            Yönetici rolü, giriş imzalarını doğrular ve işletmelere yetki verir. Bu demo’da aynı cüzdanla tüm rolleri test edebilirsiniz.
          </p>
        )}
      </section>

      <section className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0000ff] uppercase">Adım 2</p>
            <h2 className="text-xl font-bold text-[#121420]">Kampüs Giriş İmzası</h2>
          </div>
          <span className="text-xs text-gray-500">İmza = kapı kontrolü</span>
        </div>
        <p className="text-sm text-gray-700">
          Turnikede, öğrenci cüzdanı ile giriş mesajını imzalar. Kapı backend’i imzayı doğrular ve giriş yapar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleEntryProof}
            disabled={isSigning}
            className="bg-[#0000ff] text-button-text px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {isSigning ? 'İmza İsteniyor...' : 'Giriş İmzası Al'}
          </button>
          {entryStatus && <span className="text-sm text-gray-600">{entryStatus}</span>}
        </div>
        {entryProof && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs break-all">
            <strong>İmza:</strong> {entryProof}
          </div>
        )}
      </section>

      <section className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0000ff] uppercase">Adım 3</p>
            <h2 className="text-xl font-bold text-[#121420]">Kampüs İçi Ödeme</h2>
          </div>
          <span className="text-xs text-gray-500">Base Sepolia (demo)</span>
        </div>
        <p className="text-sm text-gray-700">
          Öğrenci, kampüs kafe gibi işletmelere coin (ETH/Base gas token) ile ödeme yapar.
          Bu demo, zincirde 0 ETH’lik (yalnızca gas) örnek bir çağrı yapar; gerçek ödeme için tutarı güncelleyin.
        </p>
        {isConnected ? (
          <Transaction
            chainId={84532}
            calls={calls}
            onStatus={(status) => console.log('Campus payment status', status)}
          >
            <TransactionButton className="bg-[#0000ff] text-button-text" />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
            <TransactionToast>
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        ) : (
          <p className="text-sm text-gray-600">Ödeme yapmak için önce cüzdan bağlayın.</p>
        )}
        <div className="text-xs text-gray-500">
          <p>İşletme adresi: {vendorAddress}</p>
          <p>Yönetici, tahsilatları zincir üstü takip eder; öğrenci tarafında harcama limiti ve whitelist uygulanabilir.</p>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
