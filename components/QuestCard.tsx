'use client';

import { Quest } from '@/types';
import { Zap, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const { isConnected, connect } = useWallet();

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

  const handleStartQuest = async () => {
    if (!isConnected) {
      try {
        await connect();
        toast({
          title: 'Wallet Connected',
          description: 'You can now start this quest.',
        });
      } catch (err: any) {
        toast({
          title: 'Connection Failed',
          description: err.message || 'Could not connect wallet.',
        });
      }
      return;
    }

    toast({
      title: 'Quest Started',
      description: `You've started "${quest.title}".`,
    });
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
            {quest.completedBy}/{quest.totalSlots}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0f0f1a]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleStartQuest}
        className="w-full rounded-lg bg-[#7c3aed] py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#9d4edd] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isConnected ? 'Start Quest' : 'Connect Stellar Wallet to Begin'}
      </button>
    </div>
  );
}
