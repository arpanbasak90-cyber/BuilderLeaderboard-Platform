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

export const builders: Builder[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    stellarAddress: generateStellarAddress('arjun-sharma'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    xp: 4827,
    rank: 1,
    level: 9,
    badges: [allBadges[0], allBadges[2], allBadges[3], allBadges[4], allBadges[5]],
    questsCompleted: 7,
    xlmEarned: 417,
    onChainTxCount: 156,
    joinedAt: '2024-01-05',
    weeklyXPGain: 327,
  },
  {
    id: '2',
    name: 'Priya Patel',
    stellarAddress: generateStellarAddress('priya-patel'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    xp: 4083,
    rank: 2,
    level: 8,
    badges: [allBadges[0], allBadges[1], allBadges[2], allBadges[5]],
    questsCompleted: 6,
    xlmEarned: 372,
    onChainTxCount: 142,
    joinedAt: '2024-01-10',
    weeklyXPGain: 283,
  },
  {
    id: '3',
    name: 'Rohan Verma',
    stellarAddress: generateStellarAddress('rohan-verma'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    xp: 3714,
    rank: 3,
    level: 7,
    badges: [allBadges[0], allBadges[2], allBadges[3]],
    questsCompleted: 5,
    xlmEarned: 336,
    onChainTxCount: 98,
    joinedAt: '2024-01-15',
    weeklyXPGain: 147,
  },
  {
    id: '4',
    name: 'Sneha Iyer',
    stellarAddress: generateStellarAddress('sneha-iyer'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    xp: 2948,
    rank: 4,
    level: 5,
    badges: [allBadges[0], allBadges[4]],
    questsCompleted: 4,
    xlmEarned: 258,
    onChainTxCount: 78,
    joinedAt: '2024-01-20',
    weeklyXPGain: -43,
  },
  {
    id: '5',
    name: 'Karan Mehta',
    stellarAddress: generateStellarAddress('karan-mehta'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
    xp: 2431,
    rank: 5,
    level: 4,
    badges: [allBadges[0], allBadges[5]],
    questsCompleted: 4,
    xlmEarned: 213,
    onChainTxCount: 65,
    joinedAt: '2024-01-25',
    weeklyXPGain: 91,
  },
  {
    id: '6',
    name: 'Ananya Das',
    stellarAddress: generateStellarAddress('ananya-das'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    xp: 1967,
    rank: 6,
    level: 3,
    badges: [allBadges[0]],
    questsCompleted: 3,
    xlmEarned: 169,
    onChainTxCount: 52,
    joinedAt: '2024-02-01',
    weeklyXPGain: 178,
  },
  {
    id: '7',
    name: 'Vikram Singh',
    stellarAddress: generateStellarAddress('vikram-singh'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    xp: 1634,
    rank: 7,
    level: 3,
    badges: [allBadges[0], allBadges[1]],
    questsCompleted: 3,
    xlmEarned: 134,
    onChainTxCount: 45,
    joinedAt: '2024-02-05',
    weeklyXPGain: 57,
  },
  {
    id: '8',
    name: 'Neha Gupta',
    stellarAddress: generateStellarAddress('neha-gupta'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
    xp: 1298,
    rank: 8,
    level: 2,
    badges: [allBadges[0]],
    questsCompleted: 2,
    xlmEarned: 98,
    onChainTxCount: 32,
    joinedAt: '2024-02-10',
    weeklyXPGain: -27,
  },
  {
    id: '9',
    name: 'Rahul Nair',
    stellarAddress: generateStellarAddress('rahul-nair'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    xp: 972,
    rank: 9,
    level: 1,
    badges: [allBadges[0]],
    questsCompleted: 2,
    xlmEarned: 67,
    onChainTxCount: 28,
    joinedAt: '2024-02-15',
    weeklyXPGain: 113,
  },
  {
    id: '10',
    name: 'Pooja Reddy',
    stellarAddress: generateStellarAddress('pooja-reddy'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
    xp: 643,
    rank: 10,
    level: 1,
    badges: [],
    questsCompleted: 1,
    xlmEarned: 46,
    onChainTxCount: 15,
    joinedAt: '2024-02-20',
    weeklyXPGain: 38,
  },
];

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
