'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Builder } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface LeaderboardTableProps {
  builders: Builder[];
}

export default function LeaderboardTable({ builders }: LeaderboardTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  const filteredBuilders = useMemo(() => {
    let result = builders;
    if (search) {
      result = result.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter === 'week') {
      result = [...result].sort((a, b) => b.weeklyXPGain - a.weeklyXPGain);
    }
    return result;
  }, [builders, search, filter]);

  const rankStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-orange-500 text-white';
    return 'bg-gray-100 text-gray-600';
  };

  const rowBorderStyle = (rank: number) => {
    if (rank === 1) return 'border-l-4 border-l-amber-400';
    if (rank === 2) return 'border-l-4 border-l-gray-400';
    if (rank === 3) return 'border-l-4 border-l-orange-500';
    return 'border-l-4 border-l-transparent';
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search builders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 sm:w-64 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'week', 'month'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Builder</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Level</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">XP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Quests</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">XLM</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Txns</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Badges</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Weekly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBuilders.map((builder) => (
              <tr
                key={builder.id}
                className={`transition-all duration-150 hover:bg-gray-50 ${rowBorderStyle(builder.rank)}`}
              >
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankStyle(builder.rank)}`}>
                    {builder.rank}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <Link href={`/profile/${builder.id}`} className="flex items-center gap-3 hover:opacity-80">
                    <Avatar className="h-9 w-9 border border-gray-100">
                      <AvatarImage src={builder.avatar} alt={builder.name} />
                      <AvatarFallback className="bg-purple-50 text-purple-600 font-semibold text-xs">{builder.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{builder.name}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        {builder.stellarAddress.slice(0, 4)}...{builder.stellarAddress.slice(-4)}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-100">
                    Lv.{builder.level}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-gray-900">
                  {builder.xp.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">{builder.questsCompleted}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-amber-600">
                  {builder.xlmEarned} ✦
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">{builder.onChainTxCount}</td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex flex-wrap gap-0.5">
                    {builder.badges.map((badge) => (
                      <span key={badge.id} className="text-base" title={badge.name}>{badge.icon}</span>
                    ))}
                    {builder.badges.length === 0 && <span className="text-xs text-gray-300">—</span>}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    {builder.weeklyXPGain >= 0 ? (
                      <>
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">+{builder.weeklyXPGain}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-medium text-red-500">{builder.weeklyXPGain}</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBuilders.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No builders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
