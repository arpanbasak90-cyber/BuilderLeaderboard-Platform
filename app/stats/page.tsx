'use client';

import { useState, useEffect } from 'react';
import { builders as mockBuilders, quests, getTotalStats } from '@/lib/mockData';
import StatsBar from '@/components/StatsBar';
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
import { getTelemetryData } from '@/lib/telemetry';

export default function StatsPage() {
  const [liveStats, setLiveStats] = useState({
    totalXP: 0,
    totalQuestsCompleted: 0,
    activeBuilders: 0,
    totalXLM: 0,
  });

  useEffect(() => {
    // Calculate aggregate totals from mock data + telemetry/localStorage
    const baseStats = getTotalStats();
    let additionalQuests = 0;
    let additionalXP = 0;
    let additionalXLM = 0;
    let userProfilesCount = 0;

    try {
      // Aggregate all quest completions across keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quest_status_')) {
          const val = localStorage.getItem(key);
          if (val === 'completed') {
            additionalQuests += 1;
          }
        }
        if (key && key.startsWith('builder_profile_')) {
          userProfilesCount += 1;
          const p = JSON.parse(localStorage.getItem(key) || '{}');
          if (p.xp) additionalXP += p.xp;
          if (p.xlmEarned) additionalXLM += p.xlmEarned;
        }
      }
    } catch {}

    const telemetry = getTelemetryData();
    const onboardedCount = Math.max(telemetry.onboardedUsers.length, userProfilesCount || 1);

    setLiveStats({
      totalXP: baseStats.totalXP + additionalXP + (additionalQuests * 300),
      totalQuestsCompleted: baseStats.totalQuestsCompleted + additionalQuests,
      activeBuilders: Math.max(baseStats.activeBuilders, onboardedCount),
      totalXLM: baseStats.totalXLM + additionalXLM + (additionalQuests * 50),
    });
  }, []);

  const categoryData = quests.reduce((acc, quest) => {
    const existing = acc.find((c) => c.name === quest.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: quest.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e'];

  const difficultyData = [
    { name: 'Beginner', value: quests.filter((q) => q.difficulty === 'Beginner').length },
    { name: 'Intermediate', value: quests.filter((q) => q.difficulty === 'Intermediate').length },
    { name: 'Advanced', value: quests.filter((q) => q.difficulty === 'Advanced').length },
  ];

  const levelDistribution = [
    { level: 'Level 9', count: builders.filter((b) => b.level >= 9).length },
    { level: 'Level 7-8', count: builders.filter((b) => b.level >= 7 && b.level < 9).length },
    { level: 'Level 5-6', count: builders.filter((b) => b.level >= 5 && b.level < 7).length },
    { level: 'Level 3-4', count: builders.filter((b) => b.level >= 3 && b.level < 5).length },
    { level: 'Level 1-2', count: builders.filter((b) => b.level >= 1 && b.level < 3).length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-[#f1f5f9]">Platform Statistics</h1>
        <p className="text-lg text-[#94a3b8]">
          Overview of the Stellar Builder Leaderboard ecosystem
        </p>
      </section>

      {/* Stats Bar */}
      <StatsBar
        totalXP={liveStats.totalXP}
        totalQuests={liveStats.totalQuestsCompleted}
        activeBuilders={liveStats.activeBuilders}
        totalXLM={liveStats.totalXLM}
      />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quest Categories Pie Chart */}
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#f1f5f9]">Quests by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#7c3aed"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a4a',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quest Difficulty Chart */}
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#f1f5f9]">Quests by Difficulty</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a4a',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6">
        <h3 className="mb-4 text-lg font-semibold text-[#f1f5f9]">Builder Level Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={levelDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="level" type="category" stroke="#94a3b8" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #2a2a4a',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4">
          <p className="text-sm text-[#94a3b8]">Total Quests</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{quests.length}</p>
        </div>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4">
          <p className="text-sm text-[#94a3b8]">Average XP per Builder</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{Math.round(stats.totalXP / stats.totalBuilders).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4">
          <p className="text-sm text-[#94a3b8]">Total Badges Earned</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{builders.reduce((sum, b) => sum + b.badges.length, 0)}</p>
        </div>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4">
          <p className="text-sm text-[#94a3b8]">Total On-Chain Txns</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{builders.reduce((sum, b) => sum + b.onChainTxCount, 0)}</p>
        </div>
      </div>
    </div>
  );
}
