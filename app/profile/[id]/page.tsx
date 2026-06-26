'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { builders, getBuilderById, generateMockTransactions, generateQuestCompletions, generateWeeklyXPData } from '@/lib/mockData';
import XPMeter from '@/components/XPMeter';
import BadgeDisplay from '@/components/BadgeDisplay';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, Trophy, Target, Coins, Activity, Medal } from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const builder = getBuilderById(params.id as string);

  if (!builder) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="mb-4 text-2xl font-bold text-[#f1f5f9]">Builder Not Found</h1>
        <p className="mb-6 text-[#94a3b8]">The builder you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="rounded-lg bg-[#7c3aed] px-4 py-2 text-white transition-all hover:bg-[#9d4edd]"
        >
          Back to Leaderboard
        </Link>
      </div>
    );
  }

  const transactions = generateMockTransactions(builder.id);
  const questCompletions = generateQuestCompletions(builder);
  const weeklyXPData = generateWeeklyXPData(builder);

  const rankColors = {
    1: 'bg-[#f59e0b] text-white',
    2: 'bg-[#9ca3af] text-white',
    3: 'bg-[#b45309] text-white',
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#94a3b8] transition-colors hover:text-[#f1f5f9]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      {/* Top Section - Profile Header */}
      <section className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar className="h-20 w-20 border-4 border-[#7c3aed]">
            <AvatarImage src={builder.avatar} alt={builder.name} />
            <AvatarFallback>{builder.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-col items-center gap-2 md:flex-row">
              <h1 className="text-3xl font-bold text-[#f1f5f9]">{builder.name}</h1>
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  builder.rank <= 3
                    ? rankColors[builder.rank as keyof typeof rankColors]
                    : 'bg-[#2a2a4a] text-[#f1f5f9]'
                }`}
              >
                #{builder.rank}
              </span>
              <span className="rounded-full bg-[#7c3aed]/20 px-3 py-1 text-sm font-medium text-[#7c3aed]">
                Level {builder.level}
              </span>
            </div>
            <p className="mb-4 font-mono text-sm text-[#06b6d4]">
              {builder.stellarAddress}
            </p>

            <div className="mb-6 max-w-md mx-auto md:mx-0">
              <XPMeter xp={builder.xp} />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="rounded-lg border border-[#2a2a4a] bg-[#0f0f1a] p-3 text-center">
                <Trophy className="mx-auto mb-1 h-5 w-5 text-[#f59e0b]" />
                <p className="text-lg font-bold text-[#f1f5f9]">{builder.xp.toLocaleString()}</p>
                <p className="text-xs text-[#94a3b8]">Total XP</p>
              </div>
              <div className="rounded-lg border border-[#2a2a4a] bg-[#0f0f1a] p-3 text-center">
                <Target className="mx-auto mb-1 h-5 w-5 text-[#7c3aed]" />
                <p className="text-lg font-bold text-[#f1f5f9]">{builder.questsCompleted}</p>
                <p className="text-xs text-[#94a3b8]">Quests Done</p>
              </div>
              <div className="rounded-lg border border-[#2a2a4a] bg-[#0f0f1a] p-3 text-center">
                <Coins className="mx-auto mb-1 h-5 w-5 text-[#06b6d4]" />
                <p className="text-lg font-bold text-[#06b6d4]">{builder.xlmEarned} ✦</p>
                <p className="text-xs text-[#94a3b8]">XLM Earned</p>
              </div>
              <div className="rounded-lg border border-[#2a2a4a] bg-[#0f0f1a] p-3 text-center">
                <Activity className="mx-auto mb-1 h-5 w-5 text-green-400" />
                <p className="text-lg font-bold text-[#f1f5f9]">{builder.onChainTxCount}</p>
                <p className="text-xs text-[#94a3b8]">Txns</p>
              </div>
              <div className="rounded-lg border border-[#2a2a4a] bg-[#0f0f1a] p-3 text-center">
                <Medal className="mx-auto mb-1 h-5 w-5 text-[#9ca3af]" />
                <p className="text-lg font-bold text-[#f1f5f9]">#{builder.rank}</p>
                <p className="text-xs text-[#94a3b8]">Rank</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-[#f1f5f9]">Badges Earned</h2>
        <BadgeDisplay badges={builder.badges} showLocked={true} />
      </section>

      {/* Quest History Section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-[#f1f5f9]">Quest History</h2>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] overflow-hidden">
          {questCompletions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a4a]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Quest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">XP Earned</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">XLM Earned</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {questCompletions.map((quest) => (
                    <tr key={quest.questId} className="border-b border-[#2a2a4a]/50 hover:bg-[#2a2a4a]/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-[#f1f5f9]">{quest.questTitle}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          quest.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          quest.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {quest.difficulty}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#7c3aed]">+{quest.xpEarned}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#06b6d4]">+{quest.xlmEarned} ✦</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#94a3b8]">{quest.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-[#94a3b8]">No quests completed yet</div>
          )}
        </div>
      </section>

      {/* On-Chain Activity Section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-[#f1f5f9]">On-Chain Activity</h2>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a4a]">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Tx Hash</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">XLM Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-[#2a2a4a]/50 hover:bg-[#2a2a4a]/30">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-[#06b6d4]">{tx.hash}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        tx.type === 'Deploy' ? 'bg-[#7c3aed]/20 text-[#7c3aed]' :
                        tx.type === 'Invoke' ? 'bg-[#06b6d4]/20 text-[#06b6d4]' :
                        tx.type === 'Transfer' ? 'bg-green-500/20 text-green-400' :
                        tx.type === 'Swap' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-pink-500/20 text-pink-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#f1f5f9]">{tx.xlmAmount} ✦</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#94a3b8]">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* XP Over Time Chart */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-[#f1f5f9]">XP Progress Over Time</h2>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyXPData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a4a',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#7c3aed' }}
                />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ fill: '#7c3aed', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#9d4edd' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
