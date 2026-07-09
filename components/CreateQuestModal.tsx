'use client';

import { useState } from 'react';
import { X, PlusCircle, Zap, Coins, ChevronDown } from 'lucide-react';
import { Quest } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (quest: Quest) => void;
}

const CATEGORIES: Quest['category'][] = ['Smart Contract', 'DeFi', 'NFT', 'Governance', 'Community'];
const DIFFICULTIES: Quest['difficulty'][] = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateQuestModal({ isOpen, onClose, onCreated }: CreateQuestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Quest['category']>('Smart Contract');
  const [difficulty, setDifficulty] = useState<Quest['difficulty']>('Beginner');
  const [xpReward, setXpReward] = useState('200');
  const [xlmReward, setXlmReward] = useState('25');
  const [totalSlots, setTotalSlots] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in title and description.' });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // brief UX delay

    const newQuest: Quest = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      xpReward: Math.max(1, parseInt(xpReward) || 100),
      xlmReward: Math.max(1, parseInt(xlmReward) || 10),
      completedBy: 0,
      totalSlots: Math.max(1, parseInt(totalSlots) || 50),
      isActive: true,
    };

    // Persist to localStorage
    const stored = localStorage.getItem('custom_quests');
    const existing: Quest[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem('custom_quests', JSON.stringify([...existing, newQuest]));

    setIsSubmitting(false);
    onCreated(newQuest);
    onClose();
    toast({ title: '✅ Quest Created!', description: `"${newQuest.title}" is now live on the quests board.` });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Smart Contract');
    setDifficulty('Beginner');
    setXpReward('200');
    setXlmReward('25');
    setTotalSlots('50');
  };

  const difficultyColors = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    Advanced: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <PlusCircle className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Quest</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quest Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deploy a Soroban Counter Contract"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              maxLength={80}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what builders need to do to complete this quest..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              maxLength={200}
            />
          </div>

          {/* Category & Difficulty row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Quest['category'])}
                  className="w-full appearance-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Quest['difficulty'])}
                  className="w-full appearance-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8"
                >
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preview difficulty badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Preview:</span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
            <span className="text-xs text-gray-400">{category}</span>
          </div>

          {/* Rewards row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-purple-500" /> XP Reward</span>
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                min={50}
                max={2000}
                step={50}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-amber-500" /> XLM Reward</span>
              </label>
              <input
                type="number"
                value={xlmReward}
                onChange={(e) => setXlmReward(e.target.value)}
                min={1}
                max={500}
                step={5}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Slots</label>
              <input
                type="number"
                value={totalSlots}
                onChange={(e) => setTotalSlots(e.target.value)}
                min={5}
                max={1000}
                step={5}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Create Quest
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
