'use client';

import { useEffect, useState } from 'react';
import { Trophy, Target, Users, Coins } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}

function StatCard({ icon, label, value, suffix = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 transition-all duration-200 hover:border-[#7c3aed]">
      <div className="mb-2 rounded-lg bg-[#7c3aed]/20 p-2 text-[#7c3aed]">{icon}</div>
      <p className="text-2xl font-bold text-[#f1f5f9]">
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-[#94a3b8]">{label}</p>
    </div>
  );
}

interface StatsBarProps {
  totalXP: number;
  totalQuests: number;
  activeBuilders: number;
  totalXLM: number;
}

export default function StatsBar({ totalXP, totalQuests, activeBuilders, totalXLM }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard icon={<Trophy className="h-5 w-5" />} label="Total XP Distributed" value={totalXP} />
      <StatCard icon={<Target className="h-5 w-5" />} label="Quests Completed" value={totalQuests} />
      <StatCard icon={<Users className="h-5 w-5" />} label="Active Builders" value={activeBuilders} />
      <StatCard icon={<Coins className="h-5 w-5" />} label="XLM Rewarded" value={totalXLM} suffix=" ✦" />
    </div>
  );
}
