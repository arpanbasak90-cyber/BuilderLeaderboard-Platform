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
    if (!quest || !quest.id || !isConnected || !publicKey) {
      setQuestStatus('not_started');
      return;
    }
    try {
      const status = localStorage.getItem(`quest_status_${publicKey}_${quest.id}`) as QuestState;
      if (status === 'completed' || status === 'in_progress' || status === 'not_started') {
        setQuestStatus(status);
      } else {
        setQuestStatus('not_started');
      }
    } catch {
      setQuestStatus('not_started');
    }
  }, [isConnected, publicKey, quest]);

  if (!quest || !quest.id) return null;

  const xpReward = Number(quest.xpReward) || 0;
  const xlmReward = Number(quest.xlmReward) || 0;
  const completedBy = Number(quest.completedBy) || 0;
  const totalSlots = Math.max(1, Number(quest.totalSlots) || 1);
  const difficulty = quest.difficulty || 'Beginner';
  const category = quest.category || 'Smart Contract';

  const difficultyConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Beginner: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    Intermediate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
    Advanced: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
  };

  const categoryConfig: Record<string, { bg: string; text: string }> = {
    'Smart Contract': { bg: 'bg-violet-50', text: 'text-violet-700' },
    DeFi: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
    NFT: { bg: 'bg-pink-50', text: 'text-pink-700' },
    Governance: { bg: 'bg-orange-50', text: 'text-orange-700' },
    Community: { bg: 'bg-green-50', text: 'text-green-700' },
    'Mainnet Launch': { bg: 'bg-blue-50', text: 'text-blue-700' },
  };

  const diff = difficultyConfig[difficulty] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  };
  const cat = categoryConfig[category] || {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
  };

  const ensureProfile = (key: string): Builder => {
    const profileKey = `builder_profile_${key}`;
    const stored = localStorage.getItem(profileKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    const defaultProfile: Builder = {
      id: key,
      name: `Builder_${key.slice(0, 4)}...${key.slice(-4)}`,
      stellarAddress: key,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${key}`,
      xp: 0,
      level: 1,
      badges: [],
      questsCompleted: 0,
      xlmEarned: 0,
      rank: 99,
      onChainTxCount: 1,
      joinedAt: new Date().toISOString().split('T')[0],
      weeklyXPGain: 0,
    };
    try {
      localStorage.setItem(profileKey, JSON.stringify(defaultProfile));
    } catch {}
    return defaultProfile;
  };

  const handleQuestAction = async () => {
    if (!isConnected || !publicKey) {
      setShowPicker(true);
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your Stellar wallet to start this quest.',
      });
      return;
    }

    ensureProfile(publicKey);

    if (questStatus === 'not_started') {
      try {
        localStorage.setItem(`quest_status_${publicKey}_${quest.id}`, 'in_progress');
      } catch {}
      setQuestStatus('in_progress');
      toast({
        title: '🚀 Quest Started!',
        description: `"${quest.title}" is now in progress. Complete the work and click the button again to claim rewards.`,
      });
      logWalletInteraction(publicKey, 'contract_call', undefined, `Started quest: ${quest.title}`);
    } else if (questStatus === 'in_progress') {
      setShowTxModal(true);
    }
  };

  const handleTransactionConfirmed = (txHash: string) => {
    if (!publicKey) return;
    const profile = ensureProfile(publicKey);
    const profileKey = `builder_profile_${publicKey}`;

    try {
      const updatedXP = (profile.xp || 0) + xpReward;
      const updatedXLMEarned = (profile.xlmEarned || 0) + xlmReward;
      const updatedQuestsCompleted = (profile.questsCompleted || 0) + 1;

      const newBadge: Badge = {
        id: `badge_${quest.id}_${Date.now()}`,
        name: `${quest.title} Champion`,
        icon: category === 'Smart Contract' ? '🚀' : category === 'DeFi' ? '💎' : '🔥',
        description: `Successfully completed the ${quest.title} quest.`,
        earnedAt: new Date().toISOString().split('T')[0],
      };

      const updatedProfile: Builder = {
        ...profile,
        xp: updatedXP,
        level: Math.floor(updatedXP / 500) + 1,
        xlmEarned: updatedXLMEarned,
        questsCompleted: updatedQuestsCompleted,
        onChainTxCount: (profile.onChainTxCount || 0) + 1,
        badges: [...(profile.badges || []), newBadge],
      };

      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      localStorage.setItem(`quest_status_${publicKey}_${quest.id}`, 'completed');
      setQuestStatus('completed');

      try {
        fetch('/api/quests/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicKey,
            questId: quest.id,
            xpReward,
            xlmReward,
            questTitle: quest.title,
            category,
          }),
        }).catch((e) => console.error('MongoDB quest complete error:', e));
      } catch {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('builder_updated'));
      }

      toast({
        title: '🎉 Quest Completed!',
        description: `You earned ${xpReward} XP and ${xlmReward} XLM! Tx: ${txHash.slice(0, 8)}...`,
      });

      logWalletInteraction(
        publicKey,
        'contract_call',
        txHash,
        `Completed quest: ${quest.title} (Earned ${xpReward} XP, ${xlmReward} XLM)`
      );
    } catch (e) {
      console.error('Error completing quest:', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save quest completion.' });
    }
  };

  const progressPercentage =
    questStatus === 'completed'
      ? ((completedBy + 1) / totalSlots) * 100
      : (completedBy / totalSlots) * 100;

  return (
    <>
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        onConfirmed={handleTransactionConfirmed}
        questTitle={quest.title || 'Quest'}
        xpReward={xpReward}
        xlmReward={xlmReward}
      />

      <div className={`group flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        questStatus === 'completed' ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:border-purple-200'
      }`}>
        {/* Top badges */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${diff.bg} ${diff.text} ${diff.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`}></span>
            {difficulty}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cat.bg} ${cat.text}`}>
            {category}
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
            <span className="text-sm font-semibold text-gray-800">{xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <Coins className="h-3 w-3 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{xlmReward} XLM</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            <span>{questStatus === 'completed' ? completedBy + 1 : completedBy}/{totalSlots}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                questStatus === 'completed' ? 'bg-emerald-500' : 'bg-purple-600'
              }`}
              style={{ width: `${Math.min(Math.max(0, progressPercentage), 100)}%` }}
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
