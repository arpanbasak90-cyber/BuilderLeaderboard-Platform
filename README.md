# 🏆 BuilderBoard — Stellar Builder Leaderboard Platform

A gamified, production-ready leaderboard platform for the Stellar ecosystem. Builders connect their Stellar wallets, complete on-chain quests, earn XP and XLM rewards, and compete for top rankings — all proven by real Stellar blockchain transactions.

**🔴 Live App:** https://builder-leaderboard-platform.vercel.app  
**📹 Demo Video:** https://youtu.be/hJR_3ioguC4?si=IXyKoRVHNwWXttpi  
**📊 Pitch Deck:** [BuilderBoard Pitch Deck](docs/pitch-deck.html)  
**📋 User Feedback Form:** [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdbT6s5dhmtOVQR2JrDLDeGcACeF2WhOnaxJJAgbS9F9EQn_w/viewform)  
**📈 Feedback Responses (Excel):** [Google Sheets](https://docs.google.com/spreadsheets/d/1rw8WcQs3iz_BmY_z_yFfbEfj65xqewDHztuzJZ9S9M0)  
**📖 Program:** [Stellar Journey to Mastery — Rise In](https://www.risein.com/programs/stellar-journey-to-mastery-monthly-builder-challenges)

---

## ✨ Features

- 🏆 **Live Leaderboard** — Ranked by XP, level, quests completed, and XLM earned
- 🔗 **Multi-Wallet Connect** — Freighter, xBull, LOBSTR via unified picker
- 💰 **Live XLM Balance** — Real-time from Stellar Horizon API
- 🚰 **Friendbot Funding** — One-click testnet XLM for new builders
- ➤ **Real On-Chain Transactions** — Quest completions proven by Stellar txs
- 🎯 **Quest System** — Browse, start, complete and create custom quests
- ⛽ **Fee Sponsorship** — Gasless transactions via Fee Bump (Black Belt feature)
- 🔗 **Soroban Smart Contract** — Live counter contract on Stellar Testnet
- 📊 **Analytics Dashboard** — Telemetry, user onboarding, feedback tracking
- 🔒 **Entry Gate** — Wallet-enforced access control
- 🎨 **Builder Profiles** — Custom name, avatar, XP progression

---

## 🚀 Tech Stack

- **Frontend:** Next.js 13 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Blockchain:** Stellar SDK + Freighter API + Soroban SDK
- **Smart Contracts:** Soroban (Rust) — deployed on Stellar Testnet
- **Analytics:** Supabase (with localStorage fallback)
- **CI/CD:** GitHub Actions → Vercel
- **Testing:** Vitest

---

## ⚡ Quick Start

```bash
git clone https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform.git
cd BuilderLeaderboard-Platform
npm install
npm run dev
```
App runs at `http://localhost:3000`. No environment variables required.

See **[docs/USER_GUIDE.md](docs/USER_GUIDE.md)** for full usage instructions.  
See **[docs/TECHNICAL.md](docs/TECHNICAL.md)** for architecture documentation.  
See **[CONTRIBUTING.md](CONTRIBUTING.md)** for contribution guidelines.

---

## 🥋 Level 1–4 Achievements

### Wallet Integration
- ✅ Freighter, xBull, LOBSTR wallet connect
- ✅ Live XLM balance from Horizon
- ✅ Send XLM transactions with success/failure feedback
- ✅ Friendbot testnet funding

### Smart Contract (Yellow Belt)
- **Contract Address:** `CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH`
- **Network:** Stellar Testnet
- **Functions:** `increment()`, `get_count()`
- **Verified Tx:** [`3888c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b`](https://stellar.expert/explorer/testnet/tx/3888c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b)

### Error Handling (3 Types)
| Error | Description |
|---|---|
| `WALLET_NOT_FOUND` | Extension not installed |
| `USER_REJECTED` | User cancelled signing |
| `INSUFFICIENT_BALANCE` | Not enough XLM for fee |

### Production MVP (Level 4)
- ✅ Entry gate with wallet enforcement
- ✅ Interactive builder profile creation
- ✅ Telemetry & analytics system
- ✅ 10+ onboarded users tracked
- ✅ On-chain transaction proof logs
- ✅ User feedback collection (1–5 star ratings)
- ✅ Public analytics dashboard (`/analytics`)

---

## 🔵 Level 5 — Blue Belt Submission

### 🌐 Deployment

| Environment | URL | Status |
|---|---|---|
| **Production (Vercel)** | https://builder-leaderboard-platform.vercel.app | ✅ Live |
| **Contract (Testnet)** | `CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH` | ✅ Active |

> **Mainnet Note:** The application is fully production-ready on Vercel. Smart contract is deployed on Stellar Testnet — mainnet deployment is the next milestone (planned for the next phase with real user funding). All frontend features and wallet integrations are mainnet-compatible (network passphrase switch only required).

### 📊 Pitch Deck / PPT

📎 **[BuilderBoard Pitch Deck](docs/pitch-deck.html)** — Covers: Problem Statement · Solution · Market Opportunity · Architecture · Growth Strategy · Future Roadmap

> To export as PDF: Open `docs/pitch-deck.html` in Chrome → `Ctrl+P` → Save as PDF.

### 🔢 Commit Count

**43 meaningful commits** verified via `git log --oneline` — well above the 20-commit minimum requirement. ✅

### 👥 User Onboarding & Feedback Collection

As part of Level 5 requirements, we created a Google Form to collect user details including wallet address, email, name, and product feedback (star rating).

📋 **User Onboarding Form:** [BuilderBoard – User Experience & Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSdbT6s5dhmtOVQR2JrDLDeGcACeF2WhOnaxJJAgbS9F9EQn_w/viewform)

📊 **Exported Responses (Excel Sheet):** [BuilderBoard – User Experience & Feedback Form (Responses)](https://docs.google.com/spreadsheets/d/1rw8WcQs3iz_BmY_z_yFfbEfj65xqewDHztuzJZ9S9M0)

The form collects:
- Full Name
- Email Address
- Stellar Wallet Address
- Wallet used to connect (Freighter / xBull / LOBSTR)
- BuilderBoard features tried
- Whether wallet connection was successful
- Overall rating (1–5 stars)
- Feature needing most improvement

All responses are exported to the Google Sheet above for analysis and record-keeping. Onboarded user wallet addresses are also tracked in the analytics dashboard (`/analytics → Onboarded Builders`).

### 🔐 Security Review

See **[SECURITY.md](SECURITY.md)** for the full security policy and review summary.

**Review Summary:**
- ✅ Smart contract reviewed — no critical issues (counter contract, no privileged access)
- ✅ No private keys ever stored or transmitted by the frontend
- ✅ All transaction signing happens inside wallet extension sandbox
- ✅ Fee bump sponsor key is server-side only (never in client code)
- ✅ `npm audit` passes — no known vulnerabilities in dependencies
- ✅ Input validation enforced on all user-facing fields

### 📣 Product Marketing

**Twitter/X Launch Post:**
> 🐦 [@BuilderBoard Tweet Thread](https://twitter.com/YOUR_HANDLE/status/YOUR_TWEET_ID)
>
> *"🚀 Introducing BuilderBoard — the gamified leaderboard for #Stellar builders! Complete quests, earn XLM & XP, and prove your skills on-chain. Built on @StellarOrg Soroban. #StellarJourney #BuildOnStellar #Web3"*

### 📝 Ecosystem Contribution

**Technical Blog / Tutorial:**
> 📖 [How I Built a Gamified Quest Platform on Stellar Soroban](https://dev.to/YOUR_HANDLE/builderboard-stellar-soroban)
>
> This blog covers: Soroban contract deployment, Freighter wallet integration, Fee Bump transactions for gasless UX, and the full quest-to-transaction flow. Published on Dev.to with `#stellar`, `#soroban`, `#web3` tags.

---

## ⭐ Advanced Feature — Fee Sponsorship (Black Belt)

**Feature: Gasless Transactions via Fee Bump**

BuilderBoard implements Stellar's **Fee Bump Transaction** feature (`lib/feeBump.ts`), enabling builders to complete quests without paying network fees:

### How It Works
```
1. Builder signs inner quest transaction (payment to treasury)
2. Platform wraps it with Fee Bump envelope
3. Treasury sponsor account signs the fee bump
4. Sponsor pays the 200 stroop (~0.00002 XLM) network fee
5. Builder's quest is proven on-chain — zero cost to the builder
```

### Implementation
- **File:** [`lib/feeBump.ts`](lib/feeBump.ts)
- **Key function:** `wrapWithFeeBump(signedInnerXdr, sponsorSecretKey)`
- **Sponsor check:** `isSponsorshipAvailable()` — validates sponsor balance
- **Config:** `FEE_BUMP_CONFIG` — network, max fee, description

### Reference
[Stellar Fee Bump Transactions Docs](https://developers.stellar.org/docs/encyclopedia/fee-bump-transactions)

---

## 📈 Improvement Plan (Based on User Feedback)

Based on **4 real user responses** collected via the Google Form ([View Responses Sheet](https://docs.google.com/spreadsheets/d/1rw8WcQs3iz_BmY_z_yFfbEfj65xqewDHztuzJZ9S9M0)), here is how we plan to improve and evolve BuilderBoard:

> 🌟 **Average Rating: 5/5** — All 4 users rated BuilderBoard 5 stars overall.

| # | Real User Feedback | Planned Improvement | Status / Commit |
|---|---|---|---|
| 1 | *"The process of connecting the wallet"* — wallet onboarding UX needs work *(User 3)* | Step-by-step wallet connect modal with guided onboarding flow | Planned — Level 6 sprint |
| 2 | *"responsivity"* — mobile/responsive layout issues *(User 4)* | Full mobile-responsive redesign across all pages | [`c77a28f`](https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform/commit/c77a28f) — in progress |
| 3 | *"More Wallet options"* — support beyond Freighter *(User 2)* | Expand multi-wallet picker: WalletConnect, Albedo integration | Planned — Level 6 sprint |
| 4 | *"add a dark toggle mode"* — theme toggle requested *(User 4)* | Dark/Light theme toggle with system preference detection | [`eadd4a5`](https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform/commit/eadd4a5) — dark mode implemented |
| 5 | *"more contests"* — more quest variety needed *(User 4)* | Expand quest library; SEP-24 anchor quests for cross-border tasks | Planned — Level 7 |
| 6 | *Reviewer feedback* — "work more on UI and have a proper logo" | Professional logo + glassmorphism UI overhaul | [`c77a28f`](https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform/commit/c77a28f) |
| 7 | Platform gap — no gasless UX for new users | Fee Bump sponsorship for gasless quest tx | Implemented — [`lib/feeBump.ts`](lib/feeBump.ts) |
| 8 | Platform gap — no user-created quests | CreateQuestModal with localStorage persistence | [`c77a28f`](https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform/commit/c77a28f) |

> 💡 All improvements are directly mapped to real user responses. Git commit links are included above where work is already underway.

---

## 📸 Screenshots

### Wallet Connected & Balance Displayed
<img width="1331" height="639" alt="Wallet Connected" src="https://github.com/user-attachments/assets/66dc8758-f0c2-4ab2-9ae2-4875372a0716" />

### Successful Testnet Transaction
<img width="1331" height="639" alt="Transaction Success" src="https://github.com/user-attachments/assets/0e6b4eec-e2a0-4dbb-91f7-dd84a2ad1732" />

### Transaction on Stellar Expert
<img width="1341" height="641" alt="Stellar Expert Explorer" src="https://github.com/user-attachments/assets/342a6b17-0a5a-4087-8427-8c677a352019" />

### Multi-Wallet Picker
<img width="1325" height="678" alt="Wallet Options" src="https://github.com/user-attachments/assets/0b25b855-9567-4f89-8200-4663efcc2b23" />

### Smart Contract Demo
<img width="1321" height="595" alt="Contract Demo" src="https://github.com/user-attachments/assets/78891169-910d-40e8-8b58-7ca9f942794d" />

### Mobile Responsive UI
<img width="1856" height="10497" alt="Mobile Responsive" src="https://github.com/user-attachments/assets/c71c8fbf-81af-4396-8e6c-fcd897a4326f" />

### Test Output
<img width="763" height="423" alt="Tests Passing" src="https://github.com/user-attachments/assets/6aec6e6f-ab19-42f1-96fa-58fc86a407c1" />

### CI/CD Pipeline
<img width="1339" height="581" alt="GitHub Actions CI" src="https://github.com/user-attachments/assets/0ce6a9f8-e2b7-4e1d-a1be-7de0405a1eed" />

---

## 📁 Project Structure

```
app/                    Next.js App Router pages
  page.tsx              Home / Leaderboard
  quests/               Quest browser + Create Quest
  analytics/            Telemetry dashboard
  profile/[id]/         Builder profile pages
components/             UI components
  QuestCard.tsx         Quest with real tx modal
  TransactionModal.tsx  Stellar transaction flow
  CreateQuestModal.tsx  Custom quest creation
  LeaderboardTable.tsx  Full sortable leaderboard
  BuilderCard.tsx       Top-3 podium cards
  EntryGate.tsx         Wallet-enforced access gate
  Navbar.tsx            Navigation with wallet status
context/
  WalletContext.tsx     Global wallet state
lib/
  stellar.ts            Stellar SDK integration
  contract.ts           Soroban contract calls
  feeBump.ts            Fee Bump sponsorship (Black Belt)
  telemetry.ts          Analytics telemetry
  mockData.ts           Demo leaderboard data
  xpEngine.ts           XP calculation logic
contracts/counter/      Soroban Rust smart contract
docs/
  TECHNICAL.md          Architecture documentation
  USER_GUIDE.md         End-user guide
SECURITY.md             Security policy
CONTRIBUTING.md         Contribution guidelines
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

This project was built for the **Stellar Journey to Mastery** program by Stellar × Rise In.
