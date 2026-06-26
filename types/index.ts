export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
};

export type Builder = {
  id: string;
  name: string;
  stellarAddress: string;
  avatar: string;
  xp: number;
  rank: number;
  level: number;
  badges: Badge[];
  questsCompleted: number;
  xlmEarned: number;
  onChainTxCount: number;
  joinedAt: string;
  weeklyXPGain: number;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  xlmReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Smart Contract' | 'DeFi' | 'NFT' | 'Governance' | 'Community';
  completedBy: number;
  totalSlots: number;
  isActive: boolean;
};

export type MockTransaction = {
  hash: string;
  type: 'Deploy' | 'Invoke' | 'Transfer' | 'Swap' | 'Claim';
  xlmAmount: number;
  date: string;
};

export type QuestCompletion = {
  questId: string;
  questTitle: string;
  xpEarned: number;
  xlmEarned: number;
  completedAt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};
