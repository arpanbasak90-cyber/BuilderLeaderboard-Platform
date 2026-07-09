'use client';

import { useState, useEffect } from 'react';
import { quests as builtInQuests } from '@/lib/mockData';
import QuestCard from '@/components/QuestCard';
import CreateQuestModal from '@/components/CreateQuestModal';
import { Quest } from '@/types';
import { useWallet } from '@/hooks/useWallet';
import { PlusCircle, Target, Zap, Trophy } from 'lucide-react';

export default function QuestsPage() {
  const { isConnected } = useWallet();
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customQuests, setCustomQuests] = useState<Quest[]>([]);

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['all', 'Smart Contract', 'DeFi', 'NFT', 'Governance', 'Community'];

  // Load custom quests from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_quests');
      if (stored) setCustomQuests(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const handleQuestCreated = (quest: Quest) => {
    setCustomQuests((prev) => [...prev, quest]);
  };

  const allQuests = [...builtInQuests, ...customQuests];

  const filteredQuests = allQuests.filter((quest: Quest) => {
    if (difficultyFilter !== 'all' && quest.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && quest.category !== categoryFilter) return false;
    return quest.isActive;
  });

  const difficultyButtonStyle = (active: boolean) =>
    active
      ? 'bg-purple-600 text-white shadow-sm'
      : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600';

  const categoryButtonStyle = (active: boolean) =>
    active
      ? 'bg-purple-600 text-white shadow-sm'
      : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600';

  return (
    <>
      <CreateQuestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleQuestCreated}
      />

      <div className="space-y-8">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Quests</h1>
            <p className="text-gray-500">
              Complete challenges to earn XP &amp; XLM on the Stellar network
            </p>
          </div>

          {isConnected && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-sm hover:shadow-purple-200 hover:shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Create Quest
            </button>
          )}
        </section>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{allQuests.filter(q => q.isActive).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Active Quests</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {allQuests.reduce((sum, q) => sum + q.xpReward, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Total XP Available</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {allQuests.reduce((sum, q) => sum + q.xlmReward, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">XLM in Rewards</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Difficulty</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${difficultyButtonStyle(difficultyFilter === diff)}`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Category</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${categoryButtonStyle(categoryFilter === cat)}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quest count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredQuests.length}</span> of {allQuests.length} quests
          </p>
          {customQuests.length > 0 && (
            <span className="text-xs bg-purple-50 text-purple-600 font-medium px-2.5 py-1 rounded-full border border-purple-100">
              {customQuests.length} custom quest{customQuests.length > 1 ? 's' : ''} created
            </span>
          )}
        </div>

        {/* Quest Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>

        {/* Empty State */}
        {filteredQuests.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
            <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-500 mb-1">No quests match your filters</p>
            <p className="text-sm text-gray-400 mb-5">Try changing the difficulty or category filters</p>
            <button
              onClick={() => { setDifficultyFilter('all'); setCategoryFilter('all'); }}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
