"use client";
import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Identity,
  Avatar,
  Name,
  EthBalance,
} from "@coinbase/onchainkit/identity";

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const router = useRouter();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            AI Persona Battle
          </h1>
          <p className="text-gray-600 text-lg max-w-xs mx-auto">
            Create your AI persona, compete with others, win ETH!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <span className="text-2xl mb-1">🎭</span>
            <span className="text-xs text-gray-600 text-center">Build Persona</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <span className="text-2xl mb-1">🤖</span>
            <span className="text-xs text-gray-600 text-center">AI Responds</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <span className="text-2xl mb-1">💰</span>
            <span className="text-xs text-gray-600 text-center">Win ETH</span>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="w-full max-w-sm space-y-4">
          {isConnected ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <Wallet>
                  <Identity address={address} className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 rounded-full" />
                    <div className="flex flex-col">
                      <Name className="font-semibold text-gray-800" />
                      <EthBalance className="text-sm text-gray-500" />
                    </div>
                  </Identity>
                  <WalletDropdown>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <p className="text-gray-600 mb-4">Connect your wallet to start playing</p>
              <Wallet>
                <ConnectWallet className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
                  <span>Connect Wallet</span>
                </ConnectWallet>
              </Wallet>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 pb-8">
        <button
          onClick={() => router.push("/lobbies")}
          disabled={!isConnected}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
            ${isConnected
              ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isConnected ? "🎮 Enter Game" : "Connect Wallet to Play"}
        </button>
      </div>
    </div>
  );
}
