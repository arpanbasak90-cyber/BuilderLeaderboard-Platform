'use client';

import { useState, useEffect } from 'react';
import { builders as mockBuilders, quests as builtInQuests, getTotalStats } from '@/lib/mockData';
import StatsBar from '@/components/StatsBar';
import { Builder, Quest } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getOnboardedUsers } from '@/lib/telemetry';
import { BarChart3, Target, Trophy, Users, Zap, ShieldCheck } from 'lucide-react';

export default function StatsPage() {
  const [allBuilders, setAllBuilders] = useState<Builder[]>(mockBuilders);
  const [allQuests, setAllQuests] = useState<Quest[]>(builtInQuests);
  const [liveStats, setLiveStats] = useState({
    totalXP: 0,
    totalQuestsCompleted: 0,
    activeBuilders: 0,
    totalXLM: 0,
  });

  useEffect(() => {
    // 1. Gather all custom builders from localStorage
    const storedBuilders: Builder[] = [];
    let additionalQuestsCount = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('builder_profile_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              storedBuilders.push(JSON.parse(raw));
            } catch {}
          }
        }
        if (key && key.startsWith('quest_status_')) {
          const val = localStorage.getItem(key);
          if (val === 'completed') {
            additionalQuestsCount += 1;
          }
        }
      }
    } catch {}

    // Merge mock + custom builders
    const combinedBuildersMap = new Map<string, Builder>();
    mockBuilders.forEach((b) => combinedBuildersMap.set(b.id, b));
    storedBuilders.forEach((b) => combinedBuildersMap.set(b.id, b));
    const combinedBuilders = Array.from(combinedBuildersMap.values());
    setAllBuilders(combinedBuilders);

    // 2. Gather custom quests from localStorage
    let combinedQuests = [...builtInQuests];
    try {
      const storedQuestsRaw = localStorage.getItem('custom_quests');
      if (storedQuestsRaw) {
        const storedQuests: Quest[] = JSON.parse(storedQuestsRaw);
        combinedQuests = [...builtInQuests, ...storedQuests];
      }
    } catch {}
    setAllQuests(combinedQuests);

    // 3. Compute telemetry & live totals
    const onboardedUsers = getOnboardedUsers();
    const computedTotalXP = combinedBuilders.reduce((sum, b) => sum + b.xp, 0);
    const computedTotalXLM = combinedBuilders.reduce((sum, b) => sum + b.xlmEarned, 0);
    const computedTotalQuests = Math.max(
      combinedBuilders.reduce((sum, b) => sum + b.questsCompleted, 0),
      additionalQuestsCount
    );

    setLiveStats({
      totalXP: computedTotalXP,
      totalQuestsCompleted: computedTotalQuests,
      activeBuilders: Math.max(combinedBuilders.length, onboardedUsers.length),
      totalXLM: computedTotalXLM,
    });
  }, []);

  const categoryData = allQuests.reduce((acc, quest) => {
    const existing = acc.find((c) => c.name === quest.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: quest.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

  const difficultyData = [
    { name: 'Beginner', value: allQuests.filter((q) => q.difficulty === 'Beginner').length },
    { name: 'Intermediate', value: allQuests.filter((q) => q.difficulty === 'Intermediate').length },
    { name: 'Advanced', value: allQuests.filter((q) => q.difficulty === 'Advanced').length },
  ];

  const levelDistribution = [
    { level: 'Level 9+', count: allBuilders.filter((b) => b.level >= 9).length },
    { level: 'Level 7-8', count: allBuilders.filter((b) => b.level >= 7 && b.level < 9).length },
    { level: 'Level 5-6', count: allBuilders.filter((b) => b.level >= 5 && b.level < 7).length },
    { level: 'Level 3-4', count: allBuilders.filter((b) => b.level >= 3 && b.level < 5).length },
    { level: 'Level 1-2', count: allBuilders.filter((b) => b.level >= 1 && b.level < 3).length },
  ];

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  };

  const avgXPPerBuilder = allBuilders.length > 0
    ? Math.round(liveStats.totalXP / allBuilders.length)
    : 0;

  const totalBadgesEarned = allBuilders.reduce((sum, b) => sum + (b.badges?.length || 0), 0);
  const totalOnChainTxns = allBuilders.reduce((sum, b) => sum + (b.onChainTxCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 p-7 text-white shadow-lg shadow-purple-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Platform Statistics
            </h1>
            <p className="text-purple-100 text-sm mt-1">
              Real-time analytics and ecosystem metrics for the Stellar Builder Leaderboard
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Live Ecosystem Data
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar
        totalXP={liveStats.totalXP}
        totalQuests={liveStats.totalQuestsCompleted}
        activeBuilders={liveStats.activeBuilders}
        totalXLM={liveStats.totalXLM}
      />

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quest Categories Pie Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" /> Quests by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quest Difficulty Bar Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Quests by Difficulty
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#111827', fontWeight: 600 }} />
                <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-600" /> Builder Level Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={levelDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis dataKey="level" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#111827', fontWeight: 600 }} />
              <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Quests</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allQuests.length}</p>
          <p className="text-xs text-purple-600 font-medium mt-0.5">Built-in + Custom Quests</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg XP per Builder</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{avgXPPerBuilder.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">Across active builders</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Badges Awarded</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalBadgesEarned}</p>
          <p className="text-xs text-amber-600 font-medium mt-0.5">Achievement unlocks</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">On-Chain Txns</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalOnChainTxns}</p>
          <p className="text-xs text-cyan-600 font-medium mt-0.5">Stellar network transactions</p>
        </div>
      </div>
    </div>
  );
}
