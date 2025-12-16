"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    if (isConnected) {
      router.replace('/campus');
    }
  }, [isConnected, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8 bg-[#eef0f3] text-[#121420]">
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 sm:w-40 sm:h-40">
          <Image
            src="/base-logo.png"
            alt="Base Logo"
            fill
            className="object-contain rounded-xl"
          />
        </div>
        <div className="relative w-28 h-28 sm:w-40 sm:h-40">
          <Image
            src="/icon.png"
            alt="Isik University"
            fill
            className="object-contain rounded-xl"
          />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Işık Üniversitesi Kampüs Girişi</h1>
        <p className="text-gray-700 text-lg">
          Base cüzdanınla giriş yap, kampüs erişimini ve ödemeleri yönet.
        </p>
      </div>

      <div className="w-full max-w-md">
        <Wallet>
          <ConnectWallet className="w-full bg-[#0000ff] text-button-text font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
            Base Wallet ile Giriş Yap
          </ConnectWallet>
        </Wallet>
        <p className="text-center text-sm text-gray-600 mt-3">
          Bağlandıktan sonra otomatik olarak kampüs ekranına yönlendirileceksiniz.
        </p>
      </div>
    </div>
  );
}
