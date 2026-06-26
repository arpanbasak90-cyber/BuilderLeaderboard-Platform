'use client';

import { useState } from 'react';
import { quests } from '@/lib/mockData';
import QuestCard from '@/components/QuestCard';
import { Quest } from '@/types';

export default function QuestsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['all', 'Smart Contract', 'DeFi', 'NFT', 'Governance', 'Community'];

  const filteredQuests = quests.filter((quest: Quest) => {
    if (difficultyFilter !== 'all' && quest.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && quest.category !== categoryFilter) return false;
    return quest.isActive;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-[#f1f5f9]">Available Quests</h1>
        <p className="text-lg text-[#94a3b8]">
          Complete quests to earn XP and XLM rewards on Stellar
        </p>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[#94a3b8]">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                difficultyFilter === diff
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-[#2a2a4a] text-[#94a3b8] hover:bg-[#3a3a5a] hover:text-[#f1f5f9]'
              }`}
            >
              {diff === 'all' ? 'All' : diff}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[#94a3b8]">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-[#2a2a4a] text-[#94a3b8] hover:bg-[#3a3a5a] hover:text-[#f1f5f9]'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quest Count */}
      <p className="text-sm text-[#94a3b8]">
        Showing {filteredQuests.length} of {quests.length} quests
      </p>

      {/* Quest Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>

      {/* Empty State */}
      {filteredQuests.length === 0 && (
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-12 text-center">
          <p className="text-lg text-[#94a3b8]">No quests match your filters</p>
          <button
            onClick={() => {
              setDifficultyFilter('all');
              setCategoryFilter('all');
            }}
            className="mt-4 rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#9d4edd]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
