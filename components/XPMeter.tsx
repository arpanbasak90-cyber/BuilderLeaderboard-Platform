'use client';

import { getXPProgress } from '@/lib/xpEngine';

interface XPMeterProps {
  xp: number;
  showLabel?: boolean;
}

export default function XPMeter({ xp, showLabel = true }: XPMeterProps) {
  const progress = getXPProgress(xp);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[#94a3b8]">XP Progress</span>
          <span className="text-[#f1f5f9]">
            {progress.current} / {progress.needed}
          </span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#1a1a2e]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-[#94a3b8]">
          {progress.needed - progress.current} XP to next level
        </div>
      )}
    </div>
  );
}
