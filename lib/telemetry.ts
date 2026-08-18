import { createClient } from "@supabase/supabase-js";

// Attempt to initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface WalletInteraction {
  id: string;
  address: string;
  action: "connect" | "disconnect" | "send_xlm" | "contract_call" | "fund_wallet";
  txHash?: string;
  details?: string;
  timestamp: string;
}

export interface UserFeedback {
  id: string;
  address: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface OnboardedUser {
  address: string;
  username: string;
  joinedAt: string;
  lastActive: string;
  interactionsCount: number;
}

const defaultInteractions: WalletInteraction[] = [];

const defaultFeedback: UserFeedback[] = [];

const defaultUsers: OnboardedUser[] = [];

// Helper to load array from localStorage
function getLocal<T>(key: string, defaults: T[]): T[] {
  if (typeof window === "undefined") return defaults;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(val);
  } catch {
    return defaults;
  }
}

// Helper to save array to localStorage
function saveLocal<T>(key: string, data: T[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Log a wallet interaction
export async function logWalletInteraction(
  address: string,
  action: WalletInteraction["action"],
  txHash?: string,
  details?: string
): Promise<void> {
  const newInt: WalletInteraction = {
    id: `int-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    address,
    action,
    txHash,
    details,
    timestamp: new Date().toISOString(),
  };

  try {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInt),
    }).catch((e) => console.error('MongoDB telemetry error:', e));
  } catch {}

  // Local fallback
  const ints = getLocal<WalletInteraction>("telemetry_interactions", defaultInteractions);
  saveLocal("telemetry_interactions", [newInt, ...ints]);

  // Update onboarded users
  const users = getLocal<OnboardedUser>("telemetry_users", defaultUsers);
  const existingUserIndex = users.findIndex(
    (u) => u.address.toLowerCase() === address.toLowerCase()
  );

  if (existingUserIndex >= 0) {
    users[existingUserIndex].lastActive = new Date().toISOString().split("T")[0];
    users[existingUserIndex].interactionsCount += 1;
  } else {
    users.unshift({
      address,
      username: `Builder_${address.slice(2, 8)}`,
      joinedAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      interactionsCount: 1,
    });
  }
  saveLocal("telemetry_users", users);
}

// Submit feedback
export async function submitFeedback(
  address: string,
  rating: number,
  comment: string
): Promise<void> {
  const newFb: UserFeedback = {
    id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    address,
    rating,
    comment,
    timestamp: new Date().toISOString(),
  };

  try {
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFb),
    }).catch((e) => console.error('MongoDB feedback error:', e));
  } catch {}

  const fbs = getLocal<UserFeedback>("telemetry_feedback", defaultFeedback);
  saveLocal("telemetry_feedback", [newFb, ...fbs]);
}

// Fetch lists
export function getWalletInteractions(): WalletInteraction[] {
  return getLocal<WalletInteraction>("telemetry_interactions", defaultInteractions);
}

export function getFeedbackList(): UserFeedback[] {
  return getLocal<UserFeedback>("telemetry_feedback", defaultFeedback);
}

export function getOnboardedUsers(): OnboardedUser[] {
  return getLocal<OnboardedUser>("telemetry_users", defaultUsers);
}
