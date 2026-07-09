'use client';

import { useEffect, useState } from 'react';
import { Trophy, Target, Users, Coins } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  suffix?: string;
}

function StatCard({ icon, iconBg, iconColor, label, value, suffix = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`mb-3 rounded-xl p-2.5 ${iconBg} ${iconColor}`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 text-center">{label}</p>
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
      <StatCard icon={<Trophy className="h-5 w-5" />} iconBg="bg-purple-50" iconColor="text-purple-600" label="Total XP Distributed" value={totalXP} />
      <StatCard icon={<Target className="h-5 w-5" />} iconBg="bg-blue-50" iconColor="text-blue-600" label="Quests Completed" value={totalQuests} />
      <StatCard icon={<Users className="h-5 w-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Active Builders" value={activeBuilders} />
      <StatCard icon={<Coins className="h-5 w-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" label="XLM Rewarded" value={totalXLM} suffix=" ✦" />
    </div>
  );
}
