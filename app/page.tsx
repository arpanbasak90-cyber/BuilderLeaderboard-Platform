'use client';

import { useState, useCallback, useEffect } from 'react';
import { Builder } from '@/types';
import { builders as defaultBuilders, quests } from '@/lib/mockData';
import BuilderCard from '@/components/BuilderCard';
import LeaderboardTable from '@/components/LeaderboardTable';
import StatsBar from '@/components/StatsBar';
import CounterDemo from '@/components/CounterDemo';
import FeedbackForm from '@/components/FeedbackForm';
import InteractiveBuilder from '@/components/InteractiveBuilder';
import { useWallet } from '@/hooks/useWallet';
import Link from 'next/link';
import { Target, ArrowRight, Trophy, Zap, Coins } from 'lucide-react';
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

  const refreshLeaderboard = useCallback(() => {
    const storedBuilders: Builder[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("builder_profile_")) {
          const raw = localStorage.getItem(key);
          if (raw) storedBuilders.push(JSON.parse(raw));
        }
      }
    } catch (e) {
      console.error("Error reading stored builders:", e);
    }

    const sorted = storedBuilders
      .sort((a, b) => b.xp - a.xp)
      .map((b, i) => ({ ...b, rank: i + 1 }));
    setAllBuilders(sorted);
  }, []);

  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard, publicKey]);

  const totalXP = allBuilders.reduce((sum, b) => sum + b.xp, 0);
  const totalXLM = allBuilders.reduce((sum, b) => sum + b.xlmEarned, 0);
  const totalQuests = allBuilders.reduce((sum, b) => sum + b.questsCompleted, 0);
  const activeBuilders = allBuilders.length;

  const top3 = allBuilders.slice(0, 3);
  const top5ByXP = allBuilders.slice(0, 5);

  const chartData = top5ByXP.map((b) => ({
    name: b.name.split(' ')[0],
    xp: b.xp,
  }));

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-8 text-center text-white shadow-lg shadow-purple-200">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Live on Stellar Testnet
        </div>
        <h1 className="mb-2 text-4xl font-bold md:text-5xl">
          Stellar Builder Leaderboard
        </h1>
        <p className="mb-6 text-lg text-purple-100">
          Compete. Build. Earn XLM on the Stellar Network.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3">
            <p className="text-2xl font-bold">{allBuilders.length}</p>
            <p className="text-xs text-purple-200">Total Builders</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3">
            <p className="text-2xl font-bold">{totalXLM} ✦</p>
            <p className="text-xs text-purple-200">XLM Distributed</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3">
            <p className="text-2xl font-bold">{quests.filter(q => q.isActive).length}</p>
            <p className="text-xs text-purple-200">Active Quests</p>
          </div>
        </div>
      </section>

      {/* Builder Profile */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🎮 Your Builder Profile</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Register your name and avatar to appear on the leaderboard. Complete quests to earn XP and climb the ranks!
          </p>
        </div>
        <InteractiveBuilder onProfileUpdate={refreshLeaderboard} />
      </section>

      {/* Top 3 Podium */}
      <section>
        {allBuilders.length > 0 ? (
          <>
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Top Builders
            </h2>
            <div className="flex flex-col items-end justify-center gap-4 md:flex-row md:items-end">
              <div className="order-2 w-full md:order-1 md:w-1/3">
                {top3[1] && <BuilderCard builder={top3[1]} rank={2} isPodium />}
              </div>
              <div className="order-1 w-full md:order-2 md:w-1/3">
                {top3[0] && <BuilderCard builder={top3[0]} rank={1} isPodium />}
              </div>
              <div className="order-3 w-full md:order-3 md:w-1/3">
                {top3[2] && <BuilderCard builder={top3[2]} rank={3} isPodium />}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-white">
            <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No builders registered yet. Be the first to claim rank #1!</p>
          </div>
        )}
      </section>

      {/* Full Leaderboard Table */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Full Leaderboard</h2>
        <LeaderboardTable builders={allBuilders} />
      </section>

      {/* Platform Stats Bar */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900">Platform Statistics</h2>
        <StatsBar
          totalXP={totalXP}
          totalQuests={totalQuests}
          activeBuilders={activeBuilders}
          totalXLM={totalXLM}
        />

        {/* Top 5 Chart */}
        {chartData.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" /> Top 5 Builders by XP
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: '#111827', fontWeight: 600 }}
                    itemStyle={{ color: '#7c3aed' }}
                  />
                  <Bar dataKey="xp" fill="#7c3aed" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* Smart Contract Demo */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Smart Contract Demo</h2>
        <CounterDemo />
      </section>

      {/* Active Quests Preview */}
      <section>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" /> Active Quests
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {quests.filter(q => q.isActive).length} quests available — earn XP and XLM
              </p>
            </div>
            <Link
              href="/quests"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition-all"
            >
              View All Quests
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">User Feedback</h2>
        <FeedbackForm />
      </section>
    </div>
  );
}
