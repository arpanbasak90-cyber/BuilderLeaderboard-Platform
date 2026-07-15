'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { CheckCircle2, Loader2, X, ExternalLink, Zap, Coins, ArrowRight } from 'lucide-react';

export type TxStatus = 'idle' | 'pending' | 'signing' | 'submitting' | 'confirmed' | 'failed';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: (txHash: string) => void;
  questTitle: string;
  xpReward: number;
  xlmReward: number;
}

const TREASURY_ADDRESS = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN';

export default function TransactionModal({
  isOpen,
  onClose,
  onConfirmed,
  questTitle,
  xpReward,
  xlmReward,
}: TransactionModalProps) {
  const { publicKey, sendTransaction, isLoading } = useWallet();
  const [status, setStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setTxHash(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!publicKey) return;
    setError(null);
    setStatus('pending');

    // Simulate wallet signing step
    await new Promise((r) => setTimeout(r, 700));
    setStatus('signing');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('submitting');

    try {
      const hash = await sendTransaction(
        TREASURY_ADDRESS,
        '0.0001', // Minimal symbolic amount — real tx proves on-chain activity
        `Quest: ${questTitle}`
      );
      setTxHash(hash);
      setStatus('confirmed');
      // Notify parent after short delay so user sees success
      setTimeout(() => onConfirmed(hash), 1200);
    } catch (err: any) {
      setError(err.message || 'Transaction failed. Please try again.');
      setStatus('failed');
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Preparing transaction' },
    { key: 'signing', label: 'Waiting for wallet signature' },
    { key: 'submitting', label: 'Submitting to Stellar network' },
    { key: 'confirmed', label: 'Transaction confirmed!' },
  ];

  const activeIndex =
    status === 'idle' ? -1
    : status === 'pending' ? 0
    : status === 'signing' ? 1
    : status === 'submitting' ? 2
    : status === 'confirmed' ? 3
    : -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={status === 'idle' || status === 'confirmed' || status === 'failed' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Quest Completion</h2>
          {(status === 'idle' || status === 'confirmed' || status === 'failed') && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Quest Info */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Quest</p>
            <p className="text-base font-semibold text-gray-900 mb-3">{questTitle}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800">+{xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800">+{xlmReward} XLM</span>
              </div>
            </div>
          </div>

          {/* Transaction details */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction Details</p>
            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 text-sm">
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-gray-500">Network</span>
                <span className="font-medium text-gray-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Stellar Testnet
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-gray-500">From</span>
                <span className="font-mono text-gray-800 text-xs">
                  {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-gray-500">Memo</span>
                <span className="text-gray-800 font-medium truncate max-w-[180px]">Quest: {questTitle}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-gray-500">Fee</span>
                <span className="text-gray-800 font-medium">0.0001 XLM</span>
              </div>
            </div>
          </div>

          {/* Progress Steps (while processing) */}
          {status !== 'idle' && status !== 'failed' && (
            <div className="space-y-2">
              {statusSteps.map((step, i) => {
                const isDone = i < activeIndex;
                const isActive = i === activeIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone ? 'bg-emerald-500' : isActive ? 'bg-purple-600' : 'bg-gray-100'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isActive ? (
                        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      )}
                    </div>
                    <span className={`text-sm ${isDone ? 'text-emerald-600 font-medium' : isActive ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Success state */}
          {status === 'confirmed' && txHash && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="font-semibold text-emerald-700">Transaction Confirmed!</p>
              </div>
              <p className="text-xs text-gray-500 font-mono break-all mb-2">{txHash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
              >
                View on Stellar Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Error state */}
          {status === 'failed' && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-600 mb-1">Transaction Failed</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-5 flex gap-3">
          {status === 'idle' && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Confirm & Sign <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
          {(status === 'confirmed' || status === 'failed') && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
            >
              Close
            </button>
          )}
          {(status === 'pending' || status === 'signing' || status === 'submitting') && (
            <div className="w-full py-2.5 rounded-xl bg-purple-100 text-sm font-medium text-purple-600 text-center cursor-not-allowed">
              Processing…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
