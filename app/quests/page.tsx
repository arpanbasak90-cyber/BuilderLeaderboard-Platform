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
  const categories = ['all', 'Smart Contract', 'DeFi', 'NFT', 'Governance', 'Community', 'Mainnet Launch'];

  const loadCustomQuests = async () => {
    let apiQuests: Quest[] = [];
    try {
      const res = await fetch('/api/quests');
      if (res.ok) {
        apiQuests = await res.json();
      }
    } catch (e) {
      console.error('Error fetching quests from API:', e);
    }

    let localQuests: Quest[] = [];
    try {
      const stored = localStorage.getItem('custom_quests');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localQuests = parsed.filter(
            (q) => q && typeof q === 'object' && q.id && q.title
          );
        }
      }
    } catch { /* ignore */ }

    const combinedQuestsMap = new Map<string, Quest>();
    (Array.isArray(apiQuests) ? apiQuests : []).forEach((q) => {
      if (q && q.id) combinedQuestsMap.set(q.id, q);
    });
    localQuests.forEach((q) => {
      if (q && q.id) combinedQuestsMap.set(q.id, q);
    });
    setCustomQuests(Array.from(combinedQuestsMap.values()));
  };

  useEffect(() => {
    loadCustomQuests();
    const handleUpdate = () => loadCustomQuests();
    window.addEventListener('builder_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('builder_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleQuestCreated = (quest: Quest) => {
    if (quest && quest.id && quest.title) {
      setCustomQuests((prev) => [...prev, quest]);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('builder_updated'));
      }
    }
  };

  const safeBuiltIn = builtInQuests.filter((q) => q && typeof q === 'object' && q.id);
  const allQuests = [...safeBuiltIn, ...customQuests];

  const filteredQuests = allQuests.filter((quest: Quest) => {
    if (!quest || !quest.id) return false;
    if (difficultyFilter !== 'all' && quest.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && quest.category !== categoryFilter) return false;
    return quest.isActive !== false;
  });

  const difficultyButtonStyle = (active: boolean) =>
    active
      ? 'bg-purple-600 text-white shadow-sm'
      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:text-purple-600';

  const categoryButtonStyle = (active: boolean) =>
    active
      ? 'bg-purple-600 text-white shadow-sm'
      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:text-purple-600';

  const totalXP = allQuests.reduce((sum, q) => sum + (Number(q.xpReward) || 0), 0);
  const totalXLM = allQuests.reduce((sum, q) => sum + (Number(q.xlmReward) || 0), 0);

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
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Ecosystem Quests</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Complete on-chain challenges to earn XP &amp; XLM bounties on the Stellar network
            </p>
          </div>

          {isConnected && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 px-5 py-3 text-sm font-black text-white transition-all shadow-md shadow-purple-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              Create Custom Quest
            </button>
          )}
        </section>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{allQuests.filter((q) => q.isActive !== false).length}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Active Quests Available</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {totalXP.toLocaleString()} XP
            </p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Total XP Pool</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {totalXLM.toLocaleString()} XLM
            </p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">XLM Bounty Pool</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Difficulty:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${difficultyButtonStyle(difficultyFilter === diff)}`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${categoryButtonStyle(categoryFilter === cat)}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quest count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{filteredQuests.length}</span> of {allQuests.length} quests
          </p>
          {customQuests.length > 0 && (
            <span className="text-xs bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold px-3 py-1 rounded-full border border-purple-100 dark:border-purple-900">
              {customQuests.length} custom quest{customQuests.length > 1 ? 's' : ''} created
            </span>
          )}
        </div>

        {/* Quest Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>

        {/* Empty State */}
        {filteredQuests.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-16 text-center">
            <Target className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">No quests match your filters</p>
            <p className="text-xs text-gray-400 mb-5">Try changing the difficulty or category filters</p>
            <button
              onClick={() => { setDifficultyFilter('all'); setCategoryFilter('all'); }}
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-extrabold text-white transition-all hover:bg-purple-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
