# Technical Architecture — BuilderBoard Platform

## Overview

BuilderBoard is a gamified developer leaderboard built on the **Stellar blockchain**. Builders connect their Stellar wallets, complete quests, earn XP and XLM rewards, and compete on a live-ranked leaderboard. All quest completions are proven by real on-chain Stellar transactions.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 13 App Router                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  /        │  │ /quests  │  │/analytics│  │/profile│  │
│  │Leaderboard│  │Quest List│  │Telemetry │  │Builder │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              WalletContext (Global State)            │ │
│  │  connect() | disconnect() | sendTransaction()       │ │
│  │  publicKey | balance | isLoading | isConnected      │ │
│  └──────────────────────┬──────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────┘
                          │
         ┌────────────────┼─────────────────┐
         ▼                ▼                 ▼
┌─────────────┐  ┌─────────────────┐  ┌──────────────────┐
│  Freighter  │  │  Stellar SDK    │  │  Soroban SDK     │
│  Wallet API │  │  (stellar-sdk)  │  │  (contract.ts)   │
│  (signing)  │  │  Horizon HTTP   │  │  Counter Contract│
└─────────────┘  └────────┬────────┘  └────────┬─────────┘
                          │                    │
                 ┌────────▼────────────────────▼─────────┐
                 │       Stellar Testnet Network          │
                 │  Horizon API: horizon-testnet.stellar.org │
                 │  Contract: CBVM5XWQ4P37XJXO...        │
                 └────────────────────────────────────────┘
```

---

## Key Modules

### `context/WalletContext.tsx`
Global React context providing wallet state to all components.

| Method | Description |
|---|---|
| `connect(walletId)` | Connect Freighter/xBull/LOBSTR wallet |
| `disconnect()` | Clear wallet session |
| `sendTransaction(to, amount, memo)` | Build + sign + submit XLM payment |
| `fundWallet()` | Friendbot funding for testnet |

### `lib/stellar.ts`
Low-level Stellar SDK integration:
- Account loading from Horizon
- Transaction building (payment operations)
- Transaction submission with error handling
- Balance fetching

### `lib/contract.ts`
Soroban smart contract integration:
- `callIncrementContract(publicKey, signFn)` — invokes `increment()` on the counter contract
- `getContractCount()` — reads current counter value via simulation

### `lib/feeBump.ts` *(Black Belt Feature)*
Fee sponsorship (gasless transaction) implementation:
- `wrapWithFeeBump(signedInnerXdr, sponsorSecretKey)` — wraps a user-signed tx with fee bump envelope
- `isSponsorshipAvailable()` — checks sponsor account balance
- Enables **zero-fee UX** for builders — treasury pays the network fee

### `lib/telemetry.ts`
Analytics telemetry layer:
- Supabase database integration (with localStorage fallback)
- `logWalletInteraction()` — records on-chain events
- `submitFeedback()` — collects user ratings + comments
- `onboardUser()` — tracks new builder registrations

### `lib/xpEngine.ts`
XP calculation and level progression:
- `calculateLevel(xp)` — returns builder level (1-10)
- `xpToNextLevel(xp)` — XP needed for next level
- `applyQuestReward(profile, quest)` — updates builder stats

---

## Smart Contract

### Counter Contract (Soroban / Rust)
- **Address:** `CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH`
- **Network:** Stellar Testnet
- **Functions:**
  - `increment()` — increments counter by 1, returns new value
  - `get_count()` — reads current count (simulation, no fee)

### Fee Bump (Sponsorship) Flow
```
User clicks "Complete Quest"
    ↓
Inner transaction built (payment: 0.0001 XLM to treasury)
    ↓
User signs with Freighter (inner tx XDR)
    ↓
[Server-side] Fee Bump wraps inner tx
    ↓
[Server-side] Sponsor account signs fee bump envelope
    ↓
Fee Bump submitted to Horizon
    ↓
User pays 0 fees; treasury pays network fee
    ↓
Quest completion proven on-chain
```

---

## Data Flow — Quest Completion

```
1. Builder connects wallet (Freighter)
2. Builder selects a quest → clicks "Start Quest"
3. Quest status stored in localStorage: quest_status_{publicKey}_{questId}
4. Builder clicks "Complete Quest"
5. TransactionModal opens with quest reward preview
6. Builder clicks "Confirm & Sign"
7. sendTransaction() builds XLM payment to treasury (0.0001 XLM)
8. Freighter popup: user reviews + approves
9. Signed XDR submitted to Stellar Horizon
10. Transaction hash returned → stored in telemetry
11. Builder profile updated: +XP, +XLM, +questsCompleted
12. Leaderboard re-sorted
13. Analytics dashboard updated
```

---

## State Management

The app uses **React Context + localStorage** for state (no external state library needed):

| State | Storage | Description |
|---|---|---|
| Wallet connection | `WalletContext` (memory) | publicKey, balance, isConnected |
| Builder profiles | `localStorage` | name, xp, level, badges |
| Quest status | `localStorage` | per-user per-quest completion state |
| Telemetry | `localStorage` → Supabase | wallet interactions, feedback, onboarding |
| Custom quests | `localStorage` | user-created quests |

---

## Deployment

### Vercel (Production)
- **Live URL:** https://builder-leaderboard-platform.vercel.app
- **Build command:** `npm run build`
- **Framework preset:** Next.js
- Zero environment variables required for basic functionality
- Optional: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` for persistent analytics

### CI/CD Pipeline (GitHub Actions)
- On every push to `main`: install deps → build → lint
- See `.github/workflows/` for pipeline config

---

## Security Architecture

See [SECURITY.md](../SECURITY.md) for full security policy and review summary.

Key principles:
- **No private keys in frontend code** — all signing in wallet extension sandbox
- **Fee bump sponsor key** always server-side only
- **All transactions** require explicit user approval via wallet popup
- **localStorage** stores only non-sensitive XP/profile data
