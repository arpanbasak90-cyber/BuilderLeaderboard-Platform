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

  // Check if already registered
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
      } catch (e) {
        console.error(e);
      }
    } else {
      // Reset state for new keys
      setName("");
      setRegistered(false);
      setCurrentXP(0);
    }
  }, [publicKey]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a builder profile name.",
        variant: "destructive",
      });
      return;
    }

    const newProfile = {
      id: publicKey,
      name: name.trim(),
      stellarAddress: publicKey,
      avatar: selectedAvatar,
      xp: currentXP || 100, // Starts with 100 XP
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
    
    toast({
      title: "🎉 Profile Registered!",
      description: `Welcome ${name.trim()} to the Stellar Builder Leaderboard!`,
    });
    
    onProfileUpdate();
  };

  const handleCompleteQuest = (xpReward: number, questName: string) => {
    if (!publicKey || !registered) {
      toast({
        title: "Profile required",
        description: "Please register your builder name above first.",
        variant: "destructive",
      });
      return;
    }

    const stored = localStorage.getItem(`builder_profile_${publicKey}`);
    if (!stored) return;

    try {
      const profile = JSON.parse(stored);
      const updatedXP = profile.xp + xpReward;
      const updatedLevel = Math.floor(updatedXP / 500) + 1;
      
      const updatedProfile = {
        ...profile,
        xp: updatedXP,
        level: updatedLevel,
        questsCompleted: profile.questsCompleted + 1,
        xlmEarned: profile.xlmEarned + Math.floor(xpReward / 10),
        onChainTxCount: profile.onChainTxCount + 1,
      };

      localStorage.setItem(`builder_profile_${publicKey}`, JSON.stringify(updatedProfile));
      setCurrentXP(updatedXP);
      
      toast({
        title: `🏆 Quest Completed! (+${xpReward} XP)`,
        description: `Successfully completed: ${questName}`,
      });

      onProfileUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isConnected || !publicKey) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 shadow-xl">
      {/* Profile Registration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">
            {registered ? "Your Builder Profile" : "Register on Leaderboard"}
          </h3>
        </div>
        
        {registered ? (
          <div className="space-y-4 bg-[#0f0f1a] p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3">
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-purple-500 bg-gray-900"
              />
              <div>
                <h4 className="font-bold text-white">{name}</h4>
                <p className="text-xs text-purple-400 font-medium">Level {Math.floor(currentXP / 500) + 1} Builder</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-gray-900/60 px-3 py-2 rounded-lg text-sm">
              <span className="text-gray-400">Total XP Accumulated:</span>
              <span className="font-bold text-yellow-400 flex items-center gap-1">
                <Sparkles className="h-4 w-4 fill-yellow-400" />
                {currentXP} XP
              </span>
            </div>

            <button
              onClick={() => {
                setRegistered(false);
              }}
              className="text-xs text-gray-500 hover:text-white underline"
            >
              Edit Profile Name
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="builder-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Enter Builder Handle / Username
              </label>
              <input
                id="builder-name"
                type="text"
                maxLength={20}
                placeholder="e.g. StarCoder"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f0f1a] border border-[#2a2a4a] focus:border-purple-500 rounded-lg p-2.5 text-white focus:outline-none text-sm transition"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Select Your Avatar
              </span>
              <div className="flex gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-1 rounded-full border-2 bg-gray-900 transition-all ${
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
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-all"
            >
              🚀 Join Leaderboard
            </button>
          </form>
        )}
      </div>

      {/* Quest Simulator */}
      <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#2a2a4a] pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Quest Simulator</h3>
        </div>
        <p className="text-xs text-gray-400">
          Simulate quest completions on the Stellar Testnet. Award XP to watch your rank dynamically update on the leaderboard above!
        </p>

        <div className="space-y-3">
          {[
            { name: "Deploy First Soroban Smart Contract", xp: 500, icon: "🚀" },
            { name: "Execute Cross-Border XLM Transfer", xp: 350, icon: "💸" },
            { name: "Build a Liquidity Pool on Testnet", xp: 750, icon: "🌊" },
          ].map((q) => (
            <button
              key={q.name}
              onClick={() => handleCompleteQuest(q.xp, q.name)}
              className="w-full flex items-center justify-between p-3 bg-[#0f0f1a] hover:bg-[#25253e]/60 border border-[#2a2a4a] hover:border-yellow-500/30 rounded-xl transition text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{q.icon}</span>
                <div>
                  <span className="block text-xs font-semibold text-white">{q.name}</span>
                  <span className="block text-[10px] text-green-400 font-medium">+{q.xp} XP reward</span>
                </div>
              </div>
              <Award className="h-5 w-5 text-gray-500 hover:text-yellow-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
