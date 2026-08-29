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
  const [mounted, setMounted] = useState(false);
  const [allBuilders, setAllBuilders] = useState<Builder[]>(defaultBuilders);

  const refreshLeaderboard = useCallback(async () => {
    let apiBuilders: Builder[] = [];
    try {
      const res = await fetch('/api/builders');
      if (res.ok) {
        apiBuilders = await res.json();
      }
    } catch (e) {
      console.error('Error fetching builders from API:', e);
    }

    const storedBuilders: Builder[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("builder_profile_")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed && typeof parsed === 'object' && parsed.id) storedBuilders.push(parsed);
            } catch {}
          }
        }
      }
    } catch (e) {
      console.error("Error reading stored builders:", e);
    }

    const combinedBuildersMap = new Map<string, Builder>();
    (Array.isArray(apiBuilders) ? apiBuilders : []).forEach((b) => {
      if (b && (b.id || b.stellarAddress)) combinedBuildersMap.set(b.id || b.stellarAddress, b);
    });
    storedBuilders.forEach((b) => {
      if (b && (b.id || b.stellarAddress)) combinedBuildersMap.set(b.id || b.stellarAddress, b);
    });
    const combined = Array.from(combinedBuildersMap.values());

    const sorted = combined
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .map((b, i) => ({ ...b, rank: i + 1 }));
    setAllBuilders(sorted);
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshLeaderboard();

    const handleUpdate = () => refreshLeaderboard();
    window.addEventListener('builder_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('builder_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
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
      {/* Live Activity Marquee Ticker */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-2.5 border border-purple-500/20 text-xs shadow-inner">
        <div className="animate-ticker text-purple-200">
          <span className="inline-flex items-center gap-2 px-4 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <strong className="text-white">LIVE ACTIVITY:</strong> Builder @soroban_master completed "Soroban Smart Counter" (+250 XP)
          </span>
          <span className="inline-flex items-center gap-2 px-4 font-semibold">
            ✦ <strong className="text-amber-300">BOUNTY:</strong> Builder @alex_stellar earned 500 XLM from DeFi Challenge
          </span>
          <span className="inline-flex items-center gap-2 px-4 font-semibold">
            🥋 <strong className="text-blue-300">BELT ADVANCEMENT:</strong> Builder @crypto_dev achieved Blue Belt (Level 5)
          </span>
          <span className="inline-flex items-center gap-2 px-4 font-semibold">
            ⚡ <strong className="text-cyan-300">TRANSACTION:</strong> 12,490 Soroban transactions executed on Testnet
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-8 md:p-12 text-center text-white shadow-2xl border border-purple-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Stellar Testnet Live
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-950/50 px-4 py-1.5 text-xs font-extrabold text-blue-300 backdrop-blur">
              🥋 Level 5 Blue Belt Active
            </div>
            <Link
              href="/brand"
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/30 bg-purple-950/60 hover:bg-purple-900/80 px-4 py-1.5 text-xs font-semibold backdrop-blur text-purple-200 hover:text-white transition-all"
            >
              🎨 Brand Kit & Assets
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 shadow-xl">
              <img src="/logo-icon.svg" alt="BuilderBoard Logo" className="w-14 h-14 rounded-xl bg-slate-900" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Builder<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Board</span>
            </h1>
          </div>

          <p className="mb-8 text-base md:text-xl text-purple-100 max-w-2xl font-medium leading-relaxed">
            The gamified competitive platform for Stellar & Soroban developers. Complete on-chain quests, earn <span className="font-black text-amber-300">XLM bounties</span>, and level up through 7 belt tiers.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-3xl font-black text-white">{allBuilders.length}</p>
              <p className="text-xs font-semibold text-purple-200 mt-1">Active Builders</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-3xl font-black text-amber-300">{totalXLM} XLM</p>
              <p className="text-xs font-semibold text-purple-200 mt-1">Total Rewards</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-3xl font-black text-cyan-300">{quests.filter(q => q.isActive).length}</p>
              <p className="text-xs font-semibold text-purple-200 mt-1">Active Quests</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-3xl font-black text-emerald-400">{totalXP.toLocaleString()}</p>
              <p className="text-xs font-semibold text-purple-200 mt-1">Platform XP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Belt Progression Roadmap */}
      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
          🥋 Builder Belt Progression Spectrum
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { level: 'Level 1', name: 'White Belt', class: 'belt-white', desc: 'Onboarding & Wallet Setup' },
            { level: 'Level 2', name: 'Yellow Belt', class: 'belt-yellow', desc: 'First Quest & Transaction' },
            { level: 'Level 3', name: 'Orange Belt', class: 'belt-orange', desc: 'Soroban Smart Contracts' },
            { level: 'Level 4', name: 'Green Belt', class: 'belt-green', desc: 'DeFi & Ecosystem Tooling' },
            { level: 'Level 5', name: 'Blue Belt', class: 'belt-blue', desc: 'Growth, Product & Scaling' },
            { level: 'Level 6', name: 'Black Belt', class: 'belt-black', desc: 'Advanced Architecture' },
            { level: 'Level 7', name: 'Master Track', class: 'belt-master', desc: 'Ecosystem Legend' },
          ].map((b) => (
            <div key={b.level} className={`p-3 rounded-xl flex flex-col items-center text-center ${b.class}`}>
              <span className="text-[10px] font-extrabold opacity-80 uppercase">{b.level}</span>
              <span className="text-xs font-black mt-0.5">{b.name}</span>
              <span className="text-[9px] opacity-75 mt-1 leading-tight">{b.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Builder Profile */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">🎮 Your Builder Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Register your name and avatar to appear on the leaderboard. Complete quests to earn XP and climb the ranks!
          </p>
        </div>
        <InteractiveBuilder onProfileUpdate={refreshLeaderboard} />
      </section>

      {/* Top 3 Podium */}
      <section>
        {allBuilders.length > 0 ? (
          <>
            <h2 className="mb-6 text-center text-2xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" /> Leaderboard Podium
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
          <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Trophy className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No builders registered yet. Be the first to claim rank #1!</p>
          </div>
        )}
      </section>

      {/* Full Leaderboard Table */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Full Leaderboard</h2>
        <LeaderboardTable builders={allBuilders} />
      </section>

      {/* Platform Stats Bar */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Statistics</h2>
        <StatsBar
          totalXP={totalXP}
          totalQuests={totalQuests}
          activeBuilders={activeBuilders}
          totalXLM={totalXLM}
        />

        {/* Top 5 Chart */}
        {chartData.length > 0 && mounted && (
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" /> Top 5 Builders by XP
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    itemStyle={{ color: '#a855f7' }}
                  />
                  <Bar dataKey="xp" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* Smart Contract Demo */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Smart Contract Demo</h2>
        <CounterDemo />
      </section>

      {/* Active Quests Preview */}
      <section>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Active Quests
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {quests.filter(q => q.isActive).length} quests available — earn XP and XLM
              </p>
            </div>
            <Link
              href="/quests"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm"
            >
              View All Quests
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">User Feedback</h2>
        <FeedbackForm />
      </section>
    </div>
  );
}
