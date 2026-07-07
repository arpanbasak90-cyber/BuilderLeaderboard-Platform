"use client";

import { useState, useEffect } from "react";
import {
  getWalletInteractions,
  getFeedbackList,
  getOnboardedUsers,
  WalletInteraction,
  UserFeedback,
  OnboardedUser,
} from "@/lib/telemetry";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  Users,
  MessageSquare,
  Network,
  ShieldCheck,
  ExternalLink,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "interactions" | "feedback">("metrics");
  const [interactions, setInteractions] = useState<WalletInteraction[]>([]);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [users, setUsers] = useState<OnboardedUser[]>([]);

  useEffect(() => {
    // Load lists from telemetry
    setInteractions(getWalletInteractions());
    setFeedback(getFeedbackList());
    setUsers(getOnboardedUsers());
  }, []);

  // Compute metrics
  const totalInteractions = interactions.length;
  const totalFeedbackCount = feedback.length;
  const averageRating =
    totalFeedbackCount > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedbackCount).toFixed(1)
      : "0";
  const uniqueUsersCount = users.length;

  // Chart 1: Action Type Distribution
  const actionCounts = interactions.reduce((acc, current) => {
    acc[current.action] = (acc[current.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const actionChartData = Object.entries(actionCounts).map(([action, count]) => ({
    name: action.replace("_", " ").toUpperCase(),
    value: count,
  }));

  const COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

  // Chart 2: Feedback Rating Distribution
  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    rating: `${star} Star`,
    count: feedback.filter((f) => f.rating === star).length,
  }));

  const truncateKey = (key: string) =>
    key.length > 16 ? `${key.slice(0, 8)}...${key.slice(-8)}` : key;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <section className="rounded-xl bg-gradient-to-r from-[#0f0f1a] to-[#1e1136] p-8 border border-purple-900/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#f1f5f9] flex items-center gap-3">
              <Activity className="h-8 w-8 text-[#7c3aed] animate-pulse" />
              Telemetry & Analytics Setup
            </h1>
            <p className="text-gray-400 mt-2">
              Level 4 Verification Dashboard tracking real-time user onboarding, feedback, on-chain Stellar transactions, and contract operations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-950/60 border border-green-800 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold">
            <ShieldCheck className="h-5 w-5" />
            <span>Telemetry System Active</span>
          </div>
        </div>
      </section>

      {/* Grid Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Onboarded Users</p>
            <h3 className="text-2xl font-bold text-white mt-1">{uniqueUsersCount}</h3>
            <p className="text-xs text-purple-400 mt-1 font-mono">Min Requirement: 10</p>
          </div>
          <Users className="h-10 w-10 text-purple-500 opacity-80" />
        </div>

        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Wallet Interactions</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalInteractions}</h3>
            <p className="text-xs text-green-400 mt-1 font-mono">Proof of wallet active</p>
          </div>
          <Network className="h-10 w-10 text-cyan-500 opacity-80" />
        </div>

        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Feedback Collected</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalFeedbackCount}</h3>
            <p className="text-xs text-amber-500 mt-1 font-mono">Mandatory requirement</p>
          </div>
          <MessageSquare className="h-10 w-10 text-amber-500 opacity-80" />
        </div>

        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Average User Rating</p>
            <h3 className="text-2xl font-bold text-white mt-1">{averageRating} / 5.0</h3>
            <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${
                    s <= Math.round(Number(averageRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </p>
          </div>
          <Star className="h-10 w-10 text-yellow-500 opacity-80" />
        </div>
      </section>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#2a2a4a]">
        {(
          [
            { id: "metrics", label: "📊 System Metrics" },
            { id: "users", label: `👥 Onboarded Builders (${uniqueUsersCount})` },
            { id: "interactions", label: `⛓️ Wallet Interactions (${totalInteractions})` },
            { id: "feedback", label: `💬 User Feedback (${totalFeedbackCount})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === t.id
                ? "border-purple-500 text-white bg-purple-950/20"
                : "border-transparent text-gray-400 hover:text-white hover:bg-[#1a1a2e]/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Action Distribution Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Wallet Action Types</h3>
              <p className="text-xs text-gray-400">Distribution of wallet actions logged through the telemetry platform.</p>
              <div className="h-64 flex justify-center items-center">
                {actionChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={actionChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {actionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f0f1a",
                          border: "1px solid #2a2a4a",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-500">No actions recorded yet.</p>
                )}
              </div>
            </div>

            {/* Ratings distribution */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Feedback Rating Distribution</h3>
              <p className="text-xs text-gray-400">Analysis of feedback scores collected from onboarded builders.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingCounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                    <XAxis dataKey="rating" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f0f1a",
                        border: "1px solid #2a2a4a",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Onboarded User List</h3>
              <p className="text-xs text-gray-400 mt-1">
                List of real onboarded builders. Minimum 10 builders are tracked with their total wallet operation counts.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0f0f1a] text-gray-300 uppercase text-xs font-semibold border-b border-[#2a2a4a]">
                  <tr>
                    <th className="px-4 py-3">Builder</th>
                    <th className="px-4 py-3">Stellar Public Key</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3">Last Active</th>
                    <th className="px-4 py-3 text-right">Interactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a4a]">
                  {users.map((u, i) => (
                    <tr key={u.address} className="hover:bg-[#25253e]/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-900/50 rounded-full flex items-center justify-center text-xs text-purple-300 font-bold">
                          {i + 1}
                        </span>
                        {u.username}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs max-w-xs truncate">{u.address}</td>
                      <td className="px-4 py-3">{u.joinedAt}</td>
                      <td className="px-4 py-3">{u.lastActive}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-cyan-400">
                        {u.interactionsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "interactions" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Proof of Wallet Interactions</h3>
              <p className="text-xs text-gray-400 mt-1">
                Raw logs of wallet events (connection updates, friendbot funds, XLM transfers, and smart contract invocations).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0f0f1a] text-gray-300 uppercase text-xs font-semibold border-b border-[#2a2a4a]">
                  <tr>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Operation Details</th>
                    <th className="px-4 py-3">Transaction Explorer Link</th>
                    <th className="px-4 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a4a]">
                  {interactions.map((item) => (
                    <tr key={item.id} className="hover:bg-[#25253e]/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{truncateKey(item.address)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.action === "contract_call"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : item.action === "send_xlm"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : item.action === "fund_wallet"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : "bg-gray-950 text-gray-300 border border-gray-800"
                          }`}
                        >
                          {item.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white text-xs">{item.details || "No details"}</td>
                      <td className="px-4 py-3">
                        {item.txHash ? (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs hover:underline"
                          >
                            <span className="font-mono text-xs">{item.txHash.slice(0, 10)}...</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Basic User Feedback Summary</h3>
              <p className="text-xs text-gray-400 mt-1">
                Listing comments and ratings provided by builders. Ratings are used to measure project quality and UX optimization.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0f0f1a] border border-[#2a2a4a] rounded-xl p-4 space-y-2 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-md">
                      Account: {item.address}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-white text-sm italic">"{item.comment}"</p>
                  <p className="text-[10px] text-gray-500 text-right">
                    Submitted: {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
