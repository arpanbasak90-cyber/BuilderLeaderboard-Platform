'use client';

import Link from 'next/link';
import { Builder } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BuilderCardProps {
  builder: Builder;
  rank: number;
  isPodium?: boolean;
}

export default function BuilderCard({ builder, rank, isPodium = false }: BuilderCardProps) {
  const rankConfig = {
    1: { border: 'border-amber-300', shadow: 'shadow-amber-100', badge: 'bg-amber-400', medal: '🥇', label: 'text-amber-600' },
    2: { border: 'border-gray-300', shadow: 'shadow-gray-100', badge: 'bg-gray-400', medal: '🥈', label: 'text-gray-500' },
    3: { border: 'border-orange-300', shadow: 'shadow-orange-100', badge: 'bg-orange-500', medal: '🥉', label: 'text-orange-600' },
  };

  const heightClass = isPodium ? (rank === 1 ? 'h-64' : 'h-52') : '';

  if (!isPodium) return null;

  const cfg = rankConfig[rank as keyof typeof rankConfig] || { border: 'border-gray-200', shadow: 'shadow-gray-50', badge: 'bg-gray-400', medal: '', label: 'text-gray-500' };

  return (
    <Link href={`/profile/${builder.id}`}>
      <div
        className={`relative flex flex-col items-center justify-between rounded-2xl border-2 bg-white p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg ${cfg.border} shadow-md ${cfg.shadow} ${heightClass}`}
      >
        {/* Rank badge */}
        <div className={`absolute -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${cfg.badge} shadow-sm`}>
          {rank}
        </div>

        <div className="mt-2 flex flex-col items-center">
          <Avatar className="h-16 w-16 border-2 border-gray-100 shadow-sm">
            <AvatarImage src={builder.avatar} alt={builder.name} />
            <AvatarFallback className="bg-purple-50 text-purple-600 font-semibold">{builder.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="mt-2 text-center text-sm font-semibold text-gray-900">{builder.name}</h3>
          <span className={`text-xs font-medium ${cfg.label}`}>Level {builder.level}</span>
        </div>

        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">XP</span>
            <span className="font-semibold text-gray-800">{builder.xp.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">XLM</span>
            <span className="font-semibold text-amber-600">{builder.xlmEarned} ✦</span>
          </div>

          {builder.badges.length > 0 && (
            <div className="flex justify-center text-lg pt-1">
              {builder.badges.slice(0, 3).map((b) => (
                <span key={b.id} title={b.name}>{b.icon}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
