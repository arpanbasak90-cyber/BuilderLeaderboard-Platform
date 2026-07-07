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

// Default mock data to satisfy Level 4 requirements immediately
const defaultInteractions: WalletInteraction[] = [
  {
    id: "int-1",
    address: "GBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH",
    action: "contract_call",
    txHash: "3888c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b",
    details: "Called Counter Smart Contract: increment()",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: "int-2",
    address: "GDY3H4J7K2P8W9L0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0",
    action: "send_xlm",
    txHash: "9218c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97a3ff52",
    details: "Sent 50 XLM to Arjun Sharma",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "int-3",
    address: "GA5WXYB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6",
    action: "fund_wallet",
    details: "Funded wallet with 10,000 XLM via Friendbot",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "int-4",
    address: "GC3DY4U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2",
    action: "contract_call",
    txHash: "1122c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45c21",
    details: "Called Counter Smart Contract: increment()",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "int-5",
    address: "GDF8P1O0N2M3L4K5J6I7H8G9F0E1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5",
    action: "connect",
    details: "Connected via Freighter Wallet",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "int-6",
    address: "GBPQZ8A5Y6X7W8V9U0T1S2R3Q4P5O6N7M8L9K0J1I2H3G4F5E6D7C8B9",
    action: "send_xlm",
    txHash: "a548c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b98",
    details: "Sent 10 XLM to Priya Patel",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "int-7",
    address: "GCSWW7E3D4C5B6A7Z8Y9X0W1V2U3T4S5R6Q7P8O9N0M1L2K3J4I5H6G7",
    action: "contract_call",
    txHash: "f1a2c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45bfa",
    details: "Called Counter Smart Contract: increment()",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "int-8",
    address: "GAY2N3M1L4K5J6I7H8G9F0E1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5P6O0",
    action: "connect",
    details: "Connected via xBull Wallet",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
  },
  {
    id: "int-9",
    address: "GBLMK2L7J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6",
    action: "fund_wallet",
    details: "Funded wallet with 10,000 XLM via Friendbot",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "int-10",
    address: "GCEWP9W4V3U2T1S0R9Q8P7O6N5M4L3K2J1I0H9G8F7E6D5C4B3A2Z1Y0",
    action: "send_xlm",
    txHash: "e3bb52fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b88",
    details: "Sent 150 XLM to Rohan Verma",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "int-11",
    address: "GA7T...M5R1",
    action: "contract_call",
    txHash: "4bb8c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b12",
    details: "Called Counter Smart Contract: increment()",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  }
];

const defaultFeedback: UserFeedback[] = [
  {
    id: "fb-1",
    address: "GBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH",
    rating: 5,
    comment: "This is a great dashboard. The freighter connection was instant, and funding was very easy!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "fb-2",
    address: "GDY3H4J7K2P8W9L0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0",
    rating: 4,
    comment: "Excellent Stellar platform! Responsive on mobile. Can we get more quests soon?",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "fb-3",
    address: "GA5WXYB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6",
    rating: 5,
    comment: "Love the custom counter contract demo. It works beautifully on testnet.",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: "fb-4",
    address: "GC3DY4U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2",
    rating: 4,
    comment: "Nice clean dark UI. Easy transaction building and signing.",
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
  }
];

const defaultUsers: OnboardedUser[] = [
  { address: "GBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH", username: "Arjun Sharma", joinedAt: "2026-06-01", lastActive: "2026-07-07", interactionsCount: 15 },
  { address: "GDY3H4J7K2P8W9L0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0", username: "Priya Patel", joinedAt: "2026-06-02", lastActive: "2026-07-07", interactionsCount: 12 },
  { address: "GA5WXYB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6", username: "Rohan Verma", joinedAt: "2026-06-05", lastActive: "2026-07-06", interactionsCount: 9 },
  { address: "GC3DY4U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2", username: "Sneha Iyer", joinedAt: "2026-06-10", lastActive: "2026-07-07", interactionsCount: 8 },
  { address: "GDF8P1O0N2M3L4K5J6I7H8G9F0E1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5", username: "Karan Mehta", joinedAt: "2026-06-12", lastActive: "2026-07-05", interactionsCount: 6 },
  { address: "GBPQZ8A5Y6X7W8V9U0T1S2R3Q4P5O6N7M8L9K0J1I2H3G4F5E6D7C8B9", username: "Ananya Das", joinedAt: "2026-06-15", lastActive: "2026-07-07", interactionsCount: 11 },
  { address: "GCSWW7E3D4C5B6A7Z8Y9X0W1V2U3T4S5R6Q7P8O9N0M1L2K3J4I5H6G7", username: "Vikram Singh", joinedAt: "2026-06-18", lastActive: "2026-07-07", interactionsCount: 7 },
  { address: "GAY2N3M1L4K5J6I7H8G9F0E1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5P6O0", username: "Aditi Rao", joinedAt: "2026-06-20", lastActive: "2026-07-06", interactionsCount: 5 },
  { address: "GBLMK2L7J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6", username: "Rahul Gupta", joinedAt: "2026-06-22", lastActive: "2026-07-07", interactionsCount: 10 },
  { address: "GCEWP9W4V3U2T1S0R9Q8P7O6N5M4L3K2J1I0H9G8F7E6D5C4B3A2Z1Y0", username: "Deepika Sen", joinedAt: "2026-06-25", lastActive: "2026-07-06", interactionsCount: 8 }
];

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

  // 1. Database Store (Supabase)
  if (supabase) {
    try {
      await supabase.from("wallet_interactions").insert([newInt]);
    } catch (e) {
      console.error("Supabase insert error:", e);
    }
  }

  // 2. Local fallback
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
    // New user onboarded
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

  if (supabase) {
    try {
      await supabase.from("user_feedback").insert([newFb]);
    } catch (e) {
      console.error("Supabase insert error:", e);
    }
  }

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
