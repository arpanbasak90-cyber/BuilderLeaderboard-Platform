export const XP_PER_LEVEL = 500;

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL);
};

export const getXPProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const currentLevelXP = xp % XP_PER_LEVEL;
  const needed = XP_PER_LEVEL;
  const percentage = (currentLevelXP / needed) * 100;

  return {
    current: currentLevelXP,
    needed,
    percentage: Math.min(percentage, 100),
  };
};

export const getXPForNextLevel = (xp: number): number => {
  const nextLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
  return nextLevel * XP_PER_LEVEL;
};
