'use client';

import { useState, useEffect } from 'react';
import { Quest, Builder, Badge } from '@/types';
import { Zap, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { logWalletInteraction } from '@/lib/telemetry';

interface QuestCardProps {
  quest: Quest;
}

type QuestState = 'not_started' | 'in_progress' | 'completed';

export default function QuestCard({ quest }: QuestCardProps) {
  const { isConnected, publicKey, setShowPicker } = useWallet();
  const [questStatus, setQuestStatus] = useState<QuestState>('not_started');

  // Load quest status on mount or key change
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

  const difficultyColors = {
    Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const categoryColors = {
    'Smart Contract': 'text-[#7c3aed]',
    DeFi: 'text-[#06b6d4]',
    NFT: 'text-pink-400',
    Governance: 'text-orange-400',
    Community: 'text-green-400',
  };

  const handleQuestAction = async () => {
    if (!isConnected || !publicKey) {
      setShowPicker(true);
      toast({
        title: 'Select Wallet',
        description: 'Please connect your Stellar wallet to start this quest.',
      });
      return;
    }

    // Check if user has registered their profile
    const profileKey = `builder_profile_${publicKey}`;
    const storedProfile = localStorage.getItem(profileKey);
    if (!storedProfile) {
      toast({
        variant: 'destructive',
        title: 'Profile Registration Required',
        description: 'Please go to the Home page and register your builder name & avatar under "Your Builder Profile" to claim quest rewards!',
      });
      return;
    }

    if (questStatus === 'not_started') {
      // Start Quest
      localStorage.setItem(`quest_status_${publicKey}_${quest.id}`, 'in_progress');
      setQuestStatus('in_progress');
      toast({
        title: 'Quest Started!',
        description: `You have successfully started "${quest.title}". Build your solution and click Complete once finished.`,
      });
      logWalletInteraction(publicKey, 'contract_call', undefined, `Started quest: ${quest.title}`);
    } else if (questStatus === 'in_progress') {
      // Complete Quest
      try {
        const profile: Builder = JSON.parse(storedProfile);

        // Update stats
        const updatedXP = profile.xp + quest.xpReward;
        const updatedXLMEarned = profile.xlmEarned + quest.xlmReward;
        const updatedQuestsCompleted = profile.questsCompleted + 1;

        // Generate badge
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

        // Save updated builder profile
        localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

        // Mark quest status as completed
        localStorage.setItem(`quest_status_${publicKey}_${quest.id}`, 'completed');
        setQuestStatus('completed');

        toast({
          title: 'Quest Completed! 🎉',
          description: `Congratulations! You earned ${quest.xpReward} XP and ${quest.xlmReward} XLM!`,
        });

        // Log completion in telemetry
        const mockHash = 'tx_' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
        logWalletInteraction(
          publicKey,
          'contract_call',
          mockHash,
          `Completed quest: ${quest.title} (Earned ${quest.xpReward} XP, ${quest.xlmReward} XLM)`
        );
      } catch (e) {
        console.error('Error completing quest:', e);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to complete quest. Please try again.',
        });
      }
    }
  };

  const progressPercentage = (quest.completedBy / quest.totalSlots) * 100;

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-5 transition-all duration-200 hover:border-[#7c3aed]">
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`rounded-full border px-2 py-1 text-xs font-medium ${difficultyColors[quest.difficulty]}`}
        >
          {quest.difficulty}
        </span>
        <span className={`text-xs font-medium ${categoryColors[quest.category]}`}>
          {quest.category}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-[#f1f5f9]">{quest.title}</h3>
      <p className="mb-4 flex-1 text-sm text-[#94a3b8]">{quest.description}</p>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-[#7c3aed]" />
          <span className="text-sm font-medium text-[#f1f5f9]">{quest.xpReward} XP</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="h-4 w-4 text-[#06b6d4]" />
          <span className="text-sm font-medium text-[#f1f5f9]">{quest.xlmReward} ✦</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-[#94a3b8]">Progress</span>
          <span className="text-[#f1f5f9]">
            {questStatus === 'completed' ? quest.completedBy + 1 : quest.completedBy}/{quest.totalSlots}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0f0f1a]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-300"
            style={{ width: `${questStatus === 'completed' ? ((quest.completedBy + 1) / quest.totalSlots) * 100 : progressPercentage}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleQuestAction}
        disabled={questStatus === 'completed'}
        className={`w-full rounded-lg py-2 text-sm font-medium text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
          questStatus === 'completed'
            ? 'bg-emerald-600 hover:bg-emerald-600'
            : questStatus === 'in_progress'
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-[#7c3aed] hover:bg-[#9d4edd]'
        }`}
      >
        {!isConnected
          ? 'Connect Stellar Wallet to Begin'
          : questStatus === 'completed'
            ? '✓ Quest Completed'
            : questStatus === 'in_progress'
              ? '⚡ Complete Quest & Claim Rewards'
              : 'Start Quest'}
      </button>
    </div>
  );
}
