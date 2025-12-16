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
      <h1 className="text-4xl font-bold text-center">Base Mini App Template</h1>
      <p className="text-center text-gray-600">
        Welcome to your new Base MiniApp!
      </p>

      <div className="fixed bottom-8 w-full px-4">
        <button
          onClick={() => router.push('/attendance')}
          className="w-full bg-[#0000ff] text-button-text font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
        >
          Başla
        </button>
      </div>
    </div>
  );
}
