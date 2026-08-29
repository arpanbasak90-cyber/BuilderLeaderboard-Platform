'use client';

import Link from 'next/link';
import { Builder } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Sparkles, Award } from 'lucide-react';

interface BuilderCardProps {
  builder: Builder;
  rank: number;
  isPodium?: boolean;
}

export default function BuilderCard({ builder, rank, isPodium = false }: BuilderCardProps) {
  const getBeltClass = (level: number) => {
    if (level >= 7) return 'belt-master';
    if (level >= 6) return 'belt-black';
    if (level >= 5) return 'belt-blue';
    if (level >= 4) return 'belt-green';
    if (level >= 3) return 'belt-orange';
    if (level >= 2) return 'belt-yellow';
    return 'belt-white';
  };

  const getBeltName = (level: number) => {
    if (level >= 7) return 'Master';
    if (level >= 6) return 'Black Belt';
    if (level >= 5) return 'Blue Belt';
    if (level >= 4) return 'Green Belt';
    if (level >= 3) return 'Orange Belt';
    if (level >= 2) return 'Yellow Belt';
    return 'White Belt';
  };

  const rankConfig = {
    1: {
      border: 'border-amber-400 dark:border-amber-500',
      glow: 'shadow-xl shadow-amber-500/20 neon-glow-purple',
      badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white',
      crownColor: 'text-amber-400',
      label: 'Champion',
    },
    2: {
      border: 'border-slate-300 dark:border-slate-600',
      glow: 'shadow-lg shadow-slate-400/10',
      badge: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white',
      crownColor: 'text-slate-400',
      label: 'Runner-up',
    },
    3: {
      border: 'border-orange-400 dark:border-orange-600',
      glow: 'shadow-lg shadow-orange-500/10',
      badge: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
      crownColor: 'text-orange-500',
      label: '3rd Place',
    },
  };

  if (!isPodium) return null;

  const cfg = rankConfig[rank as keyof typeof rankConfig] || rankConfig[3];
  const heightClass = rank === 1 ? 'md:h-72 scale-[1.03]' : 'md:h-64';

  return (
    <Link href={`/profile/${builder.id}`} className="block group">
      <div
        className={`relative flex flex-col items-center justify-between rounded-3xl border-2 bg-white dark:bg-gray-900 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${cfg.border} ${cfg.glow} ${heightClass}`}
      >
        {/* Crown / Rank Badge */}
        <div className="absolute -top-4 flex items-center justify-center">
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-md ${cfg.badge}`}>
            {rank === 1 ? <Crown className="w-3.5 h-3.5 fill-current" /> : <Award className="w-3.5 h-3.5" />}
            <span>#{rank} {cfg.label}</span>
          </div>
        </div>

        {/* Builder Avatar & Info */}
        <div className="mt-3 flex flex-col items-center text-center">
          <div className="relative mb-2">
            <Avatar className="h-16 w-16 border-2 border-purple-200 dark:border-purple-800 shadow-md group-hover:scale-105 transition-transform">
              <AvatarImage src={builder.avatar} alt={builder.name} />
              <AvatarFallback className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-base">
                {builder.name[0]}
              </AvatarFallback>
            </Avatar>
            {rank === 1 && (
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            )}
          </div>

          <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {builder.name}
          </h3>
          <p className="text-[11px] text-gray-400 font-mono mb-2">
            {builder.stellarAddress.slice(0, 6)}...{builder.stellarAddress.slice(-4)}
          </p>

          <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold ${getBeltClass(builder.level)}`}>
            <span>Lv.{builder.level}</span>
            <span>• {getBeltName(builder.level)}</span>
          </span>
        </div>

        {/* Key Metrics */}
        <div className="w-full space-y-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-500 dark:text-gray-400">Total XP</span>
            <span className="font-extrabold text-purple-600 dark:text-purple-400 text-sm">
              {builder.xp.toLocaleString()} XP
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-500 dark:text-gray-400">XLM Earned</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {builder.xlmEarned} XLM
            </span>
          </div>

          {/* Badges preview */}
          {builder.badges.length > 0 && (
            <div className="flex justify-center gap-1 pt-1">
              {builder.badges.slice(0, 4).map((b) => (
                <span key={b.id} className="text-base" title={b.name}>
                  {b.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

