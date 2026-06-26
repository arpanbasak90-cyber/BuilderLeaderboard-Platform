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

  const borderColors = {
    1: 'border-l-[#f59e0b]',
    2: 'border-l-[#9ca3af]',
    3: 'border-l-[#b45309]',
  };

  const filteredBuilders = useMemo(() => {
    let result = builders;

    if (search) {
      result = result.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === 'week') {
      result = [...result].sort((a, b) => b.weeklyXPGain - a.weeklyXPGain);
    }

    return result;
  }, [builders, search, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search builders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] py-2 pl-10 pr-4 text-sm text-[#f1f5f9] placeholder-[#94a3b8] focus:border-[#7c3aed] focus:outline-none sm:w-64"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'week', 'month'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-[#1a1a2e] text-[#94a3b8] hover:bg-[#2a2a4a] hover:text-[#f1f5f9]'
              }`}
            >
              {f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#2a2a4a] bg-[#1a1a2e]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a4a]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Builder</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">XP</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Quests</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">XLM</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Txns</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Badges</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Weekly</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuilders.map((builder) => (
              <tr
                key={builder.id}
                className={`border-b border-[#2a2a4a] transition-all duration-200 hover:bg-[#2a2a4a]/50 ${
                  builder.rank <= 3 ? borderColors[builder.rank as keyof typeof borderColors] : ''
                } border-l-4`}
              >
                <td className="whitespace-nowrap px-4 py-4">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      builder.rank === 1
                        ? 'bg-[#f59e0b] text-white'
                        : builder.rank === 2
                          ? 'bg-[#9ca3af] text-white'
                          : builder.rank === 3
                            ? 'bg-[#b45309] text-white'
                            : 'bg-[#2a2a4a] text-[#f1f5f9]'
                    }`}
                  >
                    {builder.rank}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <Link href={`/profile/${builder.id}`} className="flex items-center gap-3 hover:opacity-80">
                    <Avatar className="h-10 w-10 border border-[#2a2a4a]">
                      <AvatarImage src={builder.avatar} alt={builder.name} />
                      <AvatarFallback>{builder.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#f1f5f9]">{builder.name}</p>
                      <p className="text-xs text-[#94a3b8]">
                        {builder.stellarAddress.slice(0, 4)}...{builder.stellarAddress.slice(-4)}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="inline-flex items-center rounded-full bg-[#7c3aed]/20 px-2 py-1 text-xs font-medium text-[#7c3aed]">
                    Lv. {builder.level}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#f1f5f9]">
                  {builder.xp.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-[#f1f5f9]">{builder.questsCompleted}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-[#06b6d4]">
                  {builder.xlmEarned} ✦
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-[#f1f5f9]">{builder.onChainTxCount}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {builder.badges.map((badge) => (
                      <span key={badge.id} className="text-lg" title={badge.name}>
                        {badge.icon}
                      </span>
                    ))}
                    {builder.badges.length === 0 && (
                      <span className="text-xs text-[#94a3b8]">—</span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center gap-1">
                    {builder.weeklyXPGain >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+{builder.weeklyXPGain}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">{builder.weeklyXPGain}</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
