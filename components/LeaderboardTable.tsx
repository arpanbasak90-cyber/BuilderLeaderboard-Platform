'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Builder } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, TrendingUp, TrendingDown, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface LeaderboardTableProps {
  builders: Builder[];
}

export default function LeaderboardTable({ builders }: LeaderboardTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [selectedBelt, setSelectedBelt] = useState<string>('all');

  const getBeltClass = (level: number) => {
    if (level >= 7) return 'belt-master';
    if (level >= 6) return 'belt-black';
    if (level >= 5) return 'belt-blue';
    if (level >= 4) return 'belt-green';
    if (level >= 3) return 'belt-orange';
    if (level >= 2) return 'belt-yellow';
    return 'belt-white';
  };

  const getBeltName = (level: number) => {
    if (level >= 7) return 'Master';
    if (level >= 6) return 'Black Belt';
    if (level >= 5) return 'Blue Belt';
    if (level >= 4) return 'Green Belt';
    if (level >= 3) return 'Orange Belt';
    if (level >= 2) return 'Yellow Belt';
    return 'White Belt';
  };

  const filteredBuilders = useMemo(() => {
    let result = builders;
    if (search) {
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.stellarAddress.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedBelt !== 'all') {
      const beltLevelMap: Record<string, number> = {
        white: 1,
        yellow: 2,
        orange: 3,
        green: 4,
        blue: 5,
        black: 6,
        master: 7,
      };
      const reqLevel = beltLevelMap[selectedBelt];
      if (reqLevel) {
        result = result.filter((b) => b.level === reqLevel);
      }
    }
    if (filter === 'week') {
      result = [...result].sort((a, b) => b.weeklyXPGain - a.weeklyXPGain);
    }
    return result;
  }, [builders, search, filter, selectedBelt]);

  const rankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md shadow-amber-500/20 font-black';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-slate-400 text-white font-bold';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold';
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search builder name, wallet address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        {/* Belt Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Belt:
          </span>
          {[
            { id: 'all', label: 'All Belts' },
            { id: 'white', label: 'L1 White' },
            { id: 'yellow', label: 'L2 Yellow' },
            { id: 'orange', label: 'L3 Orange' },
            { id: 'green', label: 'L4 Green' },
            { id: 'blue', label: 'L5 Blue' },
            { id: 'black', label: 'L6 Black' },
            { id: 'master', label: 'L7 Master' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBelt(b.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedBelt === b.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Time Filter */}
        <div className="flex gap-1.5 self-end lg:self-auto">
          {(['all', 'week', 'month'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-purple-600'
              }`}
            >
              {f === 'all' ? 'All Time' : f === 'week' ? 'Weekly XP' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3.5">Rank</th>
                <th className="px-4 py-3.5">Builder</th>
                <th className="px-4 py-3.5">Belt Level</th>
                <th className="px-4 py-3.5">XP Points</th>
                <th className="px-4 py-3.5">Quests</th>
                <th className="px-4 py-3.5">XLM Earned</th>
                <th className="px-4 py-3.5">On-Chain Tx</th>
                <th className="px-4 py-3.5">Badges</th>
                <th className="px-4 py-3.5">Weekly Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredBuilders.map((builder) => (
                <tr
                  key={builder.id}
                  className="group transition-colors hover:bg-purple-50/40 dark:hover:bg-purple-950/20"
                >
                  {/* Rank */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ${rankStyle(builder.rank)}`}>
                        {builder.rank}
                      </span>
                      {builder.rank <= 3 && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      )}
                    </div>
                  </td>

                  {/* Builder Name & Avatar */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <Link href={`/profile/${builder.id}`} className="flex items-center gap-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-purple-100 dark:border-purple-900/50 shadow-sm">
                          <AvatarImage src={builder.avatar} alt={builder.name} />
                          <AvatarFallback className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                            {builder.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {builder.questsCompleted > 5 && (
                          <ShieldCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-emerald-500 bg-white dark:bg-gray-900 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {builder.name}
                          </p>
                          {builder.rank === 1 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded border border-amber-200">
                              CHAMPION
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          {builder.stellarAddress.slice(0, 5)}...{builder.stellarAddress.slice(-4)}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* Belt Level */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getBeltClass(builder.level)}`}>
                      <span>Lv.{builder.level}</span>
                      <span className="opacity-80">• {getBeltName(builder.level)}</span>
                    </span>
                  </td>

                  {/* XP */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {builder.xp.toLocaleString()} <span className="text-xs font-semibold text-purple-500">XP</span>
                    </span>
                  </td>

                  {/* Quests */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {builder.questsCompleted}
                  </td>

                  {/* XLM */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {builder.xlmEarned} XLM
                    </span>
                  </td>

                  {/* Txns */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                    {builder.onChainTxCount} txs
                  </td>

                  {/* Badges */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {builder.badges.map((badge) => (
                        <span
                          key={badge.id}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                          title={badge.name}
                        >
                          {badge.icon}
                        </span>
                      ))}
                      {builder.badges.length === 0 && <span className="text-xs text-gray-300">—</span>}
                    </div>
                  </td>

                  {/* Weekly Trend */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {builder.weeklyXPGain >= 0 ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-900">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>+{builder.weeklyXPGain}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-900">
                          <TrendingDown className="h-3.5 w-3.5" />
                          <span>{builder.weeklyXPGain}</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBuilders.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-base font-semibold text-gray-500 dark:text-gray-400">No builders found matching your criteria</p>
              <p className="text-xs text-gray-400 mt-1">Try resetting search query or belt filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

