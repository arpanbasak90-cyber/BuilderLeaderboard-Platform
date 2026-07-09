"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Trophy, Award, Sparkles, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InteractiveBuilderProps {
  onProfileUpdate: () => void;
}

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
];

export default function InteractiveBuilder({ onProfileUpdate }: InteractiveBuilderProps) {
  const { publicKey, isConnected } = useWallet();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [registered, setRegistered] = useState(false);
  const [currentXP, setCurrentXP] = useState(0);

  useEffect(() => {
    if (!publicKey) return;
    const stored = localStorage.getItem(`builder_profile_${publicKey}`);
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        setName(profile.name);
        setSelectedAvatar(profile.avatar);
        setCurrentXP(profile.xp);
        setRegistered(true);
      } catch (e) { console.error(e); }
    } else {
      setName("");
      setRegistered(false);
      setCurrentXP(0);
    }
  }, [publicKey]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter a builder name.", variant: "destructive" });
      return;
    }

    const newProfile = {
      id: publicKey,
      name: name.trim(),
      stellarAddress: publicKey,
      avatar: selectedAvatar,
      xp: currentXP || 100,
      level: Math.floor((currentXP || 100) / 500) + 1,
      badges: [],
      questsCompleted: Math.floor((currentXP || 100) / 500),
      xlmEarned: Math.floor((currentXP || 100) / 10),
      onChainTxCount: Math.floor((currentXP || 100) / 15),
      joinedAt: new Date().toISOString().split("T")[0],
      weeklyXPGain: 100,
    };

    localStorage.setItem(`builder_profile_${publicKey}`, JSON.stringify(newProfile));
    setRegistered(true);
    setCurrentXP(newProfile.xp);
    toast({ title: "🎉 Profile Registered!", description: `Welcome ${name.trim()} to BuilderBoard!` });
    onProfileUpdate();
  };

  const handleCompleteQuest = (xpReward: number, questName: string) => {
    if (!publicKey || !registered) {
      toast({ title: "Profile required", description: "Register your profile above first.", variant: "destructive" });
      return;
    }
    const stored = localStorage.getItem(`builder_profile_${publicKey}`);
    if (!stored) return;
    try {
      const profile = JSON.parse(stored);
      const updatedXP = profile.xp + xpReward;
      const updatedProfile = {
        ...profile,
        xp: updatedXP,
        level: Math.floor(updatedXP / 500) + 1,
        questsCompleted: profile.questsCompleted + 1,
        xlmEarned: profile.xlmEarned + Math.floor(xpReward / 10),
        onChainTxCount: profile.onChainTxCount + 1,
      };
      localStorage.setItem(`builder_profile_${publicKey}`, JSON.stringify(updatedProfile));
      setCurrentXP(updatedXP);
      toast({ title: `🏆 +${xpReward} XP`, description: `Completed: ${questName}` });
      onProfileUpdate();
    } catch (e) { console.error(e); }
  };

  if (!isConnected || !publicKey) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
            <UserPlus className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {registered ? "Your Builder Profile" : "Register on Leaderboard"}
          </h3>
        </div>

        {registered ? (
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <img src={selectedAvatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-purple-200" />
              <div>
                <h4 className="font-bold text-gray-900">{name}</h4>
                <p className="text-xs text-purple-600 font-medium">Level {Math.floor(currentXP / 500) + 1} Builder</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-gray-100 text-sm">
              <span className="text-gray-500">Total XP</span>
              <span className="font-bold text-gray-900 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                {currentXP.toLocaleString()} XP
              </span>
            </div>

            <button
              onClick={() => setRegistered(false)}
              className="text-xs text-gray-400 hover:text-purple-600 underline transition-colors"
            >
              Edit Profile Name
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="builder-name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Builder Handle / Username
              </label>
              <input
                id="builder-name"
                type="text"
                maxLength={20}
                placeholder="e.g. StarCoder"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 focus:border-purple-400 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-100 text-sm transition-all"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Avatar</span>
              <div className="flex gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-1 rounded-full border-2 transition-all ${
                      selectedAvatar === avatar ? "border-purple-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={avatar} alt="Avatar option" className="w-10 h-10 rounded-full" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              🚀 Join Leaderboard
            </button>
          </form>
        )}
      </div>

      {/* Quest Simulator */}
      <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Quest Simulator</h3>
        </div>
        <p className="text-xs text-gray-500">
          Award yourself XP to watch your rank dynamically update on the leaderboard.
        </p>

        <div className="space-y-2">
          {[
            { name: "Deploy First Soroban Smart Contract", xp: 500, icon: "🚀" },
            { name: "Execute Cross-Border XLM Transfer", xp: 350, icon: "💸" },
            { name: "Build a Liquidity Pool on Testnet", xp: 750, icon: "🌊" },
          ].map((q) => (
            <button
              key={q.name}
              onClick={() => handleCompleteQuest(q.xp, q.name)}
              className="w-full flex items-center justify-between p-3 bg-white hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-xl transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{q.icon}</span>
                <div>
                  <span className="block text-xs font-semibold text-gray-900">{q.name}</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">+{q.xp} XP reward</span>
                </div>
              </div>
              <Award className="h-4 w-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
