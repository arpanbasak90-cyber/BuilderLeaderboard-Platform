'use client';

import { useState, useEffect } from 'react';
import { Quest, Builder, Badge } from '@/types';
import { Zap, Coins, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { logWalletInteraction } from '@/lib/telemetry';
import TransactionModal from '@/components/TransactionModal';

interface QuestCardProps {
  quest: Quest;
}

type QuestState = 'not_started' | 'in_progress' | 'completed';

export default function QuestCard({ quest }: QuestCardProps) {
  const { isConnected, publicKey, setShowPicker } = useWallet();
  const [questStatus, setQuestStatus] = useState<QuestState>('not_started');
  const [showTxModal, setShowTxModal] = useState(false);

  useEffect(() => {
    if (!isConnected || !publicKey) {
      setQuestStatus('not_started');
      return;
    }
    const status = localStorage.getItem(`quest_status_${publicKey}_${quest.id}`) as QuestState;
    if (status) {
      setQuestStatus(status);
    } else {
      setQuestStatus('not_started');
    }
  }, [isConnected, publicKey, quest.id]);

  const difficultyConfig = {
    Beginner: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    Intermediate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
    Advanced: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
  };

  const categoryConfig = {
    'Smart Contract': { bg: 'bg-violet-50', text: 'text-violet-700' },
    DeFi: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
    NFT: { bg: 'bg-pink-50', text: 'text-pink-700' },
    Governance: { bg: 'bg-orange-50', text: 'text-orange-700' },
    Community: { bg: 'bg-green-50', text: 'text-green-700' },
  };

  const diff = difficultyConfig[quest.difficulty];
  const cat = categoryConfig[quest.category];

  const handleQuestAction = async () => {
    if (!isConnected || !publicKey) {
      setShowPicker(true);
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your Stellar wallet to start this quest.',
      });
      return;
    }

    const profileKey = `builder_profile_${publicKey}`;
    const storedProfile = localStorage.getItem(profileKey);
    if (!storedProfile) {
      toast({
        variant: 'destructive',
        title: 'Profile Required',
        description: 'Go to the Home page and register your builder profile first!',
      });
      return;
    }

    if (questStatus === 'not_started') {
      localStorage.setItem(`quest_status_${publicKey}_${quest.id}`, 'in_progress');
      setQuestStatus('in_progress');
      toast({
        title: '🚀 Quest Started!',
        description: `"${quest.title}" is now in progress. Complete the work and click the button again to claim rewards.`,
      });
      logWalletInteraction(publicKey, 'contract_call', undefined, `Started quest: ${quest.title}`);
    } else if (questStatus === 'in_progress') {
      // Open transaction modal instead of silently completing
      setShowTxModal(true);
    }
  };

  const handleTransactionConfirmed = (txHash: string) => {
    if (!publicKey) return;
    const profileKey = `builder_profile_${publicKey}`;
    const storedProfile = localStorage.getItem(profileKey);
    if (!storedProfile) return;

    try {
      const profile: Builder = JSON.parse(storedProfile);
      const updatedXP = profile.xp + quest.xpReward;
      const updatedXLMEarned = profile.xlmEarned + quest.xlmReward;
      const updatedQuestsCompleted = profile.questsCompleted + 1;

      const newBadge: Badge = {
        id: `badge_${quest.id}_${Date.now()}`,
        name: `${quest.title} Champion`,
        icon: quest.category === 'Smart Contract' ? '🚀' : quest.category === 'DeFi' ? '💎' : '🔥',
        description: `Successfully completed the ${quest.title} quest.`,
        earnedAt: new Date().toISOString().split('T')[0],
      };

      const updatedProfile: Builder = {
        ...profile,
        xp: updatedXP,
        level: Math.floor(updatedXP / 1000) + 1,
        xlmEarned: updatedXLMEarned,
        questsCompleted: updatedQuestsCompleted,
        badges: [...profile.badges, newBadge],
      };

      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      localStorage.setItem(`quest_status_${publicKey}_${quest.id}`, 'completed');
      setQuestStatus('completed');
      setShowTxModal(false);

      toast({
        title: '🎉 Quest Completed!',
        description: `You earned ${quest.xpReward} XP and ${quest.xlmReward} XLM! Tx: ${txHash.slice(0, 8)}...`,
      });

      logWalletInteraction(
        publicKey,
        'contract_call',
        txHash,
        `Completed quest: ${quest.title} (Earned ${quest.xpReward} XP, ${quest.xlmReward} XLM)`
      );
    } catch (e) {
      console.error('Error completing quest:', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save quest completion.' });
    }
  };

  const progressPercentage =
    questStatus === 'completed'
      ? ((quest.completedBy + 1) / quest.totalSlots) * 100
      : (quest.completedBy / quest.totalSlots) * 100;

  return (
    <>
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        onConfirmed={handleTransactionConfirmed}
        questTitle={quest.title}
        xpReward={quest.xpReward}
        xlmReward={quest.xlmReward}
      />

      <div className={`group flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        questStatus === 'completed' ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:border-purple-200'
      }`}>
        {/* Top badges */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${diff.bg} ${diff.text} ${diff.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`}></span>
            {quest.difficulty}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cat.bg} ${cat.text}`}>
            {quest.category}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="mb-1.5 text-base font-semibold text-gray-900 leading-snug">{quest.title}</h3>
        <p className="mb-4 flex-1 text-sm text-gray-500 leading-relaxed">{quest.description}</p>

        {/* Rewards */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <Zap className="h-3 w-3 text-purple-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{quest.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <Coins className="h-3 w-3 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{quest.xlmReward} XLM</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            <span>{questStatus === 'completed' ? quest.completedBy + 1 : quest.completedBy}/{quest.totalSlots}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                questStatus === 'completed' ? 'bg-emerald-500' : 'bg-purple-600'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleQuestAction}
          disabled={questStatus === 'completed'}
          className={`group/btn w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
            questStatus === 'completed'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed'
              : questStatus === 'in_progress'
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-amber-200 hover:shadow-md'
              : isConnected
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-purple-200 hover:shadow-md'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          {questStatus === 'completed' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </>
          ) : questStatus === 'in_progress' ? (
            <>
              ⚡ Complete Quest &amp; Claim Rewards
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </>
          ) : !isConnected ? (
            'Connect Wallet to Start'
          ) : (
            <>
              Start Quest
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
