'use client';

import { useState, useCallback, useEffect } from 'react';
import { Builder } from '@/types';
import { builders as defaultBuilders, quests, getTotalStats, getTop5ByXP } from '@/lib/mockData';
import BuilderCard from '@/components/BuilderCard';
import LeaderboardTable from '@/components/LeaderboardTable';
import StatsBar from '@/components/StatsBar';
import CounterDemo from '@/components/CounterDemo';
import FeedbackForm from '@/components/FeedbackForm';
import InteractiveBuilder from '@/components/InteractiveBuilder';
import { useWallet } from '@/hooks/useWallet';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Home() {
  const { publicKey } = useWallet();
  const [allBuilders, setAllBuilders] = useState<Builder[]>(defaultBuilders);

  // Load the connected user's profile and inject into leaderboard
  const refreshLeaderboard = useCallback(() => {
    if (!publicKey) {
      setAllBuilders(defaultBuilders);
      return;
    }
    const stored = localStorage.getItem(`builder_profile_${publicKey}`);
    if (!stored) {
      setAllBuilders(defaultBuilders);
      return;
    }
    try {
      const profile: Builder = JSON.parse(stored);
      // Remove old entry for this address if exists, then inject fresh one
      const filtered = defaultBuilders.filter(
        (b) => b.stellarAddress !== profile.stellarAddress && b.id !== profile.id
      );
      const merged = [...filtered, profile]
        .sort((a, b) => b.xp - a.xp)
        .map((b, i) => ({ ...b, rank: i + 1 }));
      setAllBuilders(merged);
    } catch (e) {
      console.error(e);
      setAllBuilders(defaultBuilders);
    }
  }, [publicKey]);

  // Refresh leaderboard when wallet changes
  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  const stats = getTotalStats();
  const top3 = allBuilders.slice(0, 3);
  const top5ByXP = allBuilders.slice(0, 5);

  const chartData = top5ByXP.map((b) => ({
    name: b.name.split(' ')[0],
    xp: b.xp,
  }));

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="rounded-xl bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] p-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-[#f1f5f9] md:text-5xl">
          Stellar Builder Leaderboard
        </h1>
        <p className="mb-6 text-lg text-[#94a3b8]">
          Compete. Build. Earn XLM on the Stellar Network.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="rounded-full border border-[#2a2a4a] bg-[#1a1a2e] px-6 py-2">
            <span className="text-sm text-[#94a3b8]">Total Builders: </span>
            <span className="font-semibold text-[#f1f5f9]">{allBuilders.length}</span>
          </div>
          <div className="rounded-full border border-[#2a2a4a] bg-[#1a1a2e] px-6 py-2">
            <span className="text-sm text-[#94a3b8]">Total XLM Distributed: </span>
            <span className="font-semibold text-[#06b6d4]">{stats.totalXLM} ✦</span>
          </div>
        </div>
      </section>

      {/* Interactive Builder Profile — Your Leaderboard Spot */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-[#f1f5f9]">
          🎮 Your Builder Profile
        </h2>
        <p className="mb-4 text-sm text-[#94a3b8]">
          Register your name and avatar to appear on the leaderboard. Complete quests to earn XP and climb the ranks!
        </p>
        <InteractiveBuilder onProfileUpdate={refreshLeaderboard} />
      </section>

      {/* Top 3 Podium */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#f1f5f9]">Top Builders</h2>
        <div className="flex flex-col items-end justify-center gap-4 md:flex-row md:items-end">
          {/* Rank 2 - Left */}
          <div className="order-2 w-full md:order-1 md:w-1/3">
            {top3[1] && <BuilderCard builder={top3[1]} rank={2} isPodium />}
          </div>
          {/* Rank 1 - Center (Taller) */}
          <div className="order-1 w-full md:order-2 md:w-1/3">
            {top3[0] && <BuilderCard builder={top3[0]} rank={1} isPodium />}
          </div>
          {/* Rank 3 - Right */}
          <div className="order-3 w-full md:order-3 md:w-1/3">
            {top3[2] && <BuilderCard builder={top3[2]} rank={3} isPodium />}
          </div>
        </div>
      </section>

      {/* Full Leaderboard Table */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-[#f1f5f9]">Full Leaderboard</h2>
        <LeaderboardTable builders={allBuilders} />
      </section>

      {/* Platform Stats Bar */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#f1f5f9]">Platform Statistics</h2>
        <StatsBar
          totalXP={stats.totalXP}
          totalQuests={stats.totalQuestsCompleted}
          activeBuilders={stats.activeBuilders}
          totalXLM={stats.totalXLM}
        />

        {/* Top 5 Builders Chart */}
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#f1f5f9]">Top 5 Builders by XP</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a4a',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#7c3aed' }}
                />
                <Bar dataKey="xp" fill="#7c3aed" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Soroban Smart Contract Demo */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-[#f1f5f9]">Smart Contract Demo</h2>
        <CounterDemo />
      </section>

      {/* Active Quests Preview */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-[#f1f5f9]">Active Quests</h2>
        <p className="mb-6 text-[#94a3b8]">
          {quests.filter((q) => q.isActive).length} quests available to complete
        </p>
        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[#f1f5f9]">View all available quests</span>
            <a
              href="/quests"
              className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#9d4edd]"
            >
              Go to Quests
            </a>
          </div>
        </div>
      </section>

      {/* User Feedback Collection */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-[#f1f5f9]">User Feedback</h2>
        <FeedbackForm />
      </section>
    </div>
  );
}
