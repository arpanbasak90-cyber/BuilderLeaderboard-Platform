# Contributing to BuilderBoard Platform

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- [Freighter wallet extension](https://freighter.app) (set to Testnet)
- Git

### Local Setup

```bash
# 1. Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/BuilderLeaderboard-Platform.git
cd BuilderLeaderboard-Platform

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → App runs at http://localhost:3000
```

No environment variables are required for local development — the app uses public Stellar Testnet endpoints.

### Optional: Supabase Telemetry (Analytics)
To enable the Supabase-backed analytics dashboard, create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Without these, the app falls back to localStorage for telemetry — all features still work.

## 🧪 Running Tests

```bash
npm run test
# → Runs vitest unit tests for xpEngine and utility functions
```

## 📁 Project Structure

```
app/                    Next.js App Router pages
  page.tsx              Home / Leaderboard
  quests/               Quest browser + Create Quest
  analytics/            Telemetry dashboard
  profile/[id]/         Builder profile pages
components/             UI components
  QuestCard.tsx         Individual quest with tx modal
  TransactionModal.tsx  Stellar transaction flow UI
  CreateQuestModal.tsx  Create new quest form
  LeaderboardTable.tsx  Full sortable leaderboard
  BuilderCard.tsx       Top-3 podium cards
  ...
context/
  WalletContext.tsx     Global wallet state (connect, disconnect, send, balance)
hooks/
  useWallet.ts          Wallet hook shorthand
lib/
  stellar.ts            Stellar SDK + Freighter integration
  contract.ts           Soroban counter contract calls
  telemetry.ts          Analytics / onboarding telemetry
  feeBump.ts            Fee sponsorship (gasless tx) helper
  mockData.ts           Demo leaderboard/quest data
  xpEngine.ts           XP calculation logic
types/
  index.ts              Shared TypeScript interfaces
```

## 🔄 Contribution Workflow

1. **Fork** the repository
2. **Create a branch** — `git checkout -b feat/your-feature-name`
3. **Make your changes** — follow existing code style (TypeScript, Tailwind)
4. **Test** your changes locally
5. **Commit** with a descriptive message following the convention:
   ```
   feat: add new feature
   fix: resolve bug in component
   docs: update README section
   refactor: improve code structure
   ```
6. **Push** your branch and **open a Pull Request**

## 💡 Areas to Contribute

- 🔗 **Mainnet integration** — migrate from Testnet to Mainnet endpoints
- 🔐 **Multi-sig support** — implement multi-party quest approval
- 📊 **Supabase analytics** — improve the telemetry schema
- 🎨 **UI improvements** — new components, animations
- 🧪 **More tests** — expand vitest coverage to components
- 📖 **Documentation** — improve guides and tutorials
- 🌍 **i18n** — internationalization support

## 📋 Code Style

- TypeScript strict mode
- Functional React components with hooks
- Tailwind CSS for styling (no inline styles)
- `'use client'` directive on all interactive components
- Descriptive variable names; no abbreviations

## 📄 License

By contributing, you agree your contributions will be licensed under the MIT License.
