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
} from "lucide-react";

const COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "interactions" | "feedback">("metrics");
  const [interactions, setInteractions] = useState<WalletInteraction[]>([]);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [users, setUsers] = useState<OnboardedUser[]>([]);

  useEffect(() => {
    setInteractions(getWalletInteractions());
    setFeedback(getFeedbackList());
    setUsers(getOnboardedUsers());
  }, []);

  const totalInteractions = interactions.length;
  const totalFeedbackCount = feedback.length;
  const averageRating =
    totalFeedbackCount > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedbackCount).toFixed(1)
      : "0";
  const uniqueUsersCount = users.length;

  const actionCounts = interactions.reduce((acc, cur) => {
    acc[cur.action] = (acc[cur.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const actionChartData = Object.entries(actionCounts).map(([action, count]) => ({
    name: action.replace("_", " ").toUpperCase(),
    value: count,
  }));

  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    rating: `${star}★`,
    count: feedback.filter((f) => f.rating === star).length,
  }));

  const truncateKey = (key: string) =>
    key.length > 16 ? `${key.slice(0, 8)}...${key.slice(-8)}` : key;

  const statCards = [
    {
      label: "Onboarded Users",
      value: uniqueUsersCount,
      sub: "Min Requirement: 10",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      iconBg: "bg-purple-50",
      subColor: "text-purple-500",
    },
    {
      label: "Wallet Interactions",
      value: totalInteractions,
      sub: "Proof of wallet active",
      icon: <Network className="h-5 w-5 text-cyan-500" />,
      iconBg: "bg-cyan-50",
      subColor: "text-cyan-600",
    },
    {
      label: "Feedback Collected",
      value: totalFeedbackCount,
      sub: "Mandatory requirement",
      icon: <MessageSquare className="h-5 w-5 text-amber-500" />,
      iconBg: "bg-amber-50",
      subColor: "text-amber-600",
    },
    {
      label: "Avg. User Rating",
      value: null,
      ratingVal: averageRating,
      sub: null,
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      iconBg: "bg-yellow-50",
      subColor: "",
    },
  ];

  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-7 text-white shadow-lg shadow-purple-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Activity className="h-7 w-7 animate-pulse" />
              Telemetry &amp; Analytics
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              Real-time dashboard tracking user onboarding, feedback, on-chain transactions, and contract operations.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Telemetry Active
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
              {s.value !== null ? (
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{s.value}</h3>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{s.ratingVal} / 5</h3>
              )}
              {s.sub ? (
                <p className={`text-xs mt-1 font-medium ${s.subColor}`}>{s.sub}</p>
              ) : (
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(Number(s.ratingVal)) ? "fill-amber-400 text-amber-400" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}>
              {s.icon}
            </div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
        {(
          [
            { id: "metrics", label: "📊 System Metrics" },
            { id: "users", label: `👥 Builders (${uniqueUsersCount})` },
            { id: "interactions", label: `⛓️ Interactions (${totalInteractions})` },
            { id: "feedback", label: `💬 Feedback (${totalFeedbackCount})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
              activeTab === t.id
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {/* Metrics */}
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900">Wallet Action Types</h3>
              <p className="text-xs text-gray-500">Distribution of wallet actions logged through the telemetry platform.</p>
              <div className="h-64 flex justify-center items-center">
                {actionChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={actionChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {actionChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-400">No actions recorded yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900">Feedback Rating Distribution</h3>
              <p className="text-xs text-gray-500">Analysis of feedback scores from onboarded builders.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingCounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="rating" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: "#111827", fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Onboarded Builders</h3>
              <p className="text-xs text-gray-500 mt-1">
                Real builders tracked with wallet operation counts. Minimum 10 required.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Builder</th>
                    <th className="px-4 py-3">Stellar Public Key</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Last Active</th>
                    <th className="px-4 py-3 text-right">Interactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u, i) => (
                    <tr key={u.address} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs text-purple-600 font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        {u.username}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-xs truncate">{u.address}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{u.joinedAt}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{u.lastActive}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-purple-600">{u.interactionsCount}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No users onboarded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Interactions */}
        {activeTab === "interactions" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Proof of Wallet Interactions</h3>
              <p className="text-xs text-gray-500 mt-1">
                Raw logs of wallet events: connections, XLM transfers, friendbot funds, and smart contract calls.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Tx Explorer</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {interactions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{truncateKey(item.address)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            item.action === "contract_call"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : item.action === "send_xlm"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.action === "fund_wallet"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {item.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 max-w-xs truncate">{item.details || "—"}</td>
                      <td className="px-4 py-3">
                        {item.txHash ? (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium"
                          >
                            <span className="font-mono">{item.txHash.slice(0, 8)}…</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                  {interactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No interactions logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">User Feedback Summary</h3>
              <p className="text-xs text-gray-500 mt-1">
                Comments and ratings from builders. Used to measure project quality and UX.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 hover:border-purple-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-gray-500 bg-white border border-gray-100 px-2.5 py-1 rounded-lg">
                      {item.address}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= item.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 text-sm italic">"{item.comment}"</p>
                  <p className="text-[10px] text-gray-400 text-right">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
              {feedback.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-400">No feedback submitted yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
