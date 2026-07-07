import { Builder, Badge, Quest, MockTransaction, QuestCompletion } from '@/types';

const generateStellarAddress = (seed: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let address = 'G';
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  for (let i = 0; i < 55; i++) {
    address += chars[(hash + i * 7 + seed.charCodeAt(i % seed.length)) % chars.length];
  }
  return address;
};

const allBadges: Badge[] = [
  { id: '1', name: 'First Deploy', icon: '🚀', description: 'Deployed first Soroban contract', earnedAt: '2024-01-15' },
  { id: '2', name: 'Diamond Hands', icon: '💎', description: 'Held XLM for 6+ months', earnedAt: '2024-03-01' },
  { id: '3', name: 'Quest Crusher', icon: '🔥', description: 'Completed 5 quests', earnedAt: '2024-02-20' },
  { id: '4', name: 'Top Builder', icon: '🌟', description: 'Reached top 3 on leaderboard', earnedAt: '2024-03-10' },
  { id: '5', name: 'Speed Coder', icon: '⚡', description: 'Completed a quest in under 1 hour', earnedAt: '2024-02-15' },
  { id: '6', name: 'Collaborator', icon: '🤝', description: 'Contributed to 3 community quests', earnedAt: '2024-03-05' },
];

export const builders: Builder[] = [];

export const quests: Quest[] = [
  {
    id: 'q1',
    title: 'Hello Soroban',
    description: 'Deploy your first Soroban smart contract with a basic "Hello World" function',
    xpReward: 200,
    xlmReward: 25,
    difficulty: 'Beginner',
    category: 'Smart Contract',
    completedBy: 45,
    totalSlots: 100,
    isActive: true,
  },
  {
    id: 'q2',
    title: 'Token Creator',
    description: 'Create a custom token on Stellar using Soroban with transfer and balance functions',
    xpReward: 500,
    xlmReward: 75,
    difficulty: 'Intermediate',
    category: 'DeFi',
    completedBy: 23,
    totalSlots: 50,
    isActive: true,
  },
  {
    id: 'q3',
    title: 'NFT Collection',
    description: 'Build an NFT collection smart contract with minting and ownership tracking',
    xpReward: 600,
    xlmReward: 100,
    difficulty: 'Advanced',
    category: 'NFT',
    completedBy: 12,
    totalSlots: 30,
    isActive: true,
  },
  {
    id: 'q4',
    title: 'Governance Proposal',
    description: 'Create a governance proposal and participate in network voting',
    xpReward: 300,
    xlmReward: 40,
    difficulty: 'Beginner',
    category: 'Governance',
    completedBy: 38,
    totalSlots: 80,
    isActive: true,
  },
  {
    id: 'q5',
    title: 'DEX Integration',
    description: 'Integrate with a Stellar DEX and perform token swaps',
    xpReward: 750,
    xlmReward: 120,
    difficulty: 'Advanced',
    category: 'DeFi',
    completedBy: 8,
    totalSlots: 25,
    isActive: true,
  },
  {
    id: 'q6',
    title: 'Community Tutorial',
    description: 'Write and publish a tutorial for the Stellar developer community',
    xpReward: 250,
    xlmReward: 30,
    difficulty: 'Beginner',
    category: 'Community',
    completedBy: 56,
    totalSlots: 150,
    isActive: true,
  },
  {
    id: 'q7',
    title: 'Multi-Sig Wallet',
    description: 'Build a multi-signature wallet contract with configurable thresholds',
    xpReward: 550,
    xlmReward: 85,
    difficulty: 'Intermediate',
    category: 'Smart Contract',
    completedBy: 15,
    totalSlots: 40,
    isActive: true,
  },
  {
    id: 'q8',
    title: 'Liquidity Pool',
    description: 'Create a liquidity pool with AMM functionality on Soroban',
    xpReward: 800,
    xlmReward: 150,
    difficulty: 'Advanced',
    category: 'DeFi',
    completedBy: 6,
    totalSlots: 20,
    isActive: true,
  },
];

export const generateMockTransactions = (builderId: string): MockTransaction[] => {
  const types: ('Deploy' | 'Invoke' | 'Transfer' | 'Swap' | 'Claim')[] = ['Deploy', 'Invoke', 'Transfer', 'Swap', 'Claim'];
  const transactions: MockTransaction[] = [];
  const seed = builderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < 5; i++) {
    const hash = 'a' + Math.random().toString(16).substr(2, 3) + '...' + Math.random().toString(16).substr(2, 4);
    const date = new Date(2024, 0, 15 + i * 7).toISOString().split('T')[0];
    transactions.push({
      hash,
      type: types[(seed + i) % types.length],
      xlmAmount: Math.floor(Math.random() * 100) + 10,
      date,
    });
  }

  return transactions;
};

export const generateQuestCompletions = (builder: Builder): QuestCompletion[] => {
  const completions: QuestCompletion[] = [];
  const completedQuestIds = quests.slice(0, builder.questsCompleted);

  completedQuestIds.forEach((quest, i) => {
    completions.push({
      questId: quest.id,
      questTitle: quest.title,
      xpEarned: quest.xpReward,
      xlmEarned: quest.xlmReward,
      completedAt: new Date(2024, 0, 10 + i * 5).toISOString().split('T')[0],
      difficulty: quest.difficulty,
    });
  });

  return completions;
};

export const generateWeeklyXPData = (builder: Builder) => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  const baseXP = builder.xp / 6;
  const seed = builder.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return weeks.map((week, i) => ({
    week,
    xp: Math.floor(baseXP * (i + 1) + (seed % 200) * Math.sin(i)),
  }));
};

export const getBuilderById = (id: string): Builder | undefined => {
  return builders.find(b => b.id === id);
};

export const getTotalStats = () => ({
  totalBuilders: builders.length,
  totalXLM: builders.reduce((sum, b) => sum + b.xlmEarned, 0),
  totalXP: builders.reduce((sum, b) => sum + b.xp, 0),
  totalQuestsCompleted: builders.reduce((sum, b) => sum + b.questsCompleted, 0),
  activeBuilders: builders.filter(b => b.weeklyXPGain > 0).length,
});

export const getTop5ByXP = () => {
  return [...builders].sort((a, b) => b.xp - a.xp).slice(0, 5);
};
