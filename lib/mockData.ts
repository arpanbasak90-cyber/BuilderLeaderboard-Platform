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

export const quests: Quest[] = [];

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
  const found = builders.find((b) => b.id === id || b.stellarAddress === id);
  if (found) return found;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`builder_profile_${id}`);
      if (stored) return JSON.parse(stored);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('builder_profile_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && (parsed.id === id || parsed.stellarAddress === id)) {
              return parsed;
            }
          }
        }
      }
    } catch (e) {
      console.error("Error reading stored builder profile:", e);
    }
  }

  return undefined;
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
