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
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Builder Not Found</h1>
        <p className="mb-6 text-gray-500">The builder you're looking for doesn't exist.</p>
        <Link href="/" className="rounded-xl bg-purple-600 px-5 py-2.5 text-white font-medium transition-all hover:bg-purple-700">
          Back to Leaderboard
        </Link>
      </div>
    );
  }

  const transactions = generateMockTransactions(builder.id);
  const questCompletions = generateQuestCompletions(builder);
  const weeklyXPData = generateWeeklyXPData(builder);

  const rankBadge = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-orange-500 text-white';
    return 'bg-gray-100 text-gray-600';
  };

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      {/* Profile Header */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar className="h-20 w-20 border-4 border-purple-200 shadow-md">
            <AvatarImage src={builder.avatar} alt={builder.name} />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xl">{builder.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h1 className="text-3xl font-bold text-gray-900">{builder.name}</h1>
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankBadge(builder.rank)}`}>
                #{builder.rank}
              </span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 border border-purple-200">
                Level {builder.level}
              </span>
            </div>

            <p className="mb-4 font-mono text-sm text-gray-400">{builder.stellarAddress}</p>

            <div className="mb-6 max-w-md mx-auto md:mx-0">
              <XPMeter xp={builder.xp} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { icon: <Trophy className="mx-auto mb-1 h-4 w-4 text-amber-500" />, val: builder.xp.toLocaleString(), label: 'Total XP', color: 'text-gray-900' },
                { icon: <Target className="mx-auto mb-1 h-4 w-4 text-purple-500" />, val: builder.questsCompleted, label: 'Quests Done', color: 'text-gray-900' },
                { icon: <Coins className="mx-auto mb-1 h-4 w-4 text-amber-500" />, val: `${builder.xlmEarned} ✦`, label: 'XLM Earned', color: 'text-amber-600' },
                { icon: <Activity className="mx-auto mb-1 h-4 w-4 text-emerald-500" />, val: builder.onChainTxCount, label: 'Txns', color: 'text-gray-900' },
                { icon: <Medal className="mx-auto mb-1 h-4 w-4 text-gray-400" />, val: `#${builder.rank}`, label: 'Rank', color: 'text-gray-900' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                  {s.icon}
                  <p className={`text-base font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Badges Earned</h2>
        <BadgeDisplay badges={builder.badges} showLocked={true} />
      </section>

      {/* Quest History */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Quest History</h2>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {questCompletions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Quest', 'Difficulty', 'XP Earned', 'XLM Earned', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {questCompletions.map((quest) => (
                    <tr key={quest.questId} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{quest.questTitle}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          quest.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          quest.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {quest.difficulty}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-purple-600">+{quest.xpEarned}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-amber-600">+{quest.xlmEarned} ✦</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500 text-xs">{quest.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm">No quests completed yet.</div>
          )}
        </div>
      </section>

      {/* On-Chain Activity */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">On-Chain Activity</h2>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Tx Hash', 'Type', 'XLM Amount', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-purple-600">{tx.hash}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        tx.type === 'Deploy' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        tx.type === 'Invoke' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        tx.type === 'Transfer' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        tx.type === 'Swap' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-pink-50 text-pink-700 border-pink-200'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-amber-600">{tx.xlmAmount} ✦</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500 text-xs">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* XP Progress Chart */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">XP Progress Over Time</h2>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyXPData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: '#111827', fontWeight: 600 }}
                  itemStyle={{ color: '#7c3aed' }}
                />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ fill: '#7c3aed', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#9d4edd' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
