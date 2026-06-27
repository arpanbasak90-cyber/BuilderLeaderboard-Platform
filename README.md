# BuilderLeaderboard-Platform

A gamified builder leaderboard for the Stellar ecosystem. Builders connect their Stellar wallet (via Freighter), track XP and quest progress, and send real XLM transactions on the Stellar Testnet directly from the app.

**Live demo:** https://builder-leaderboard-platform.vercel.app

## Features

- 🏆 Leaderboard ranking builders by XP, level, completed quests, and earned XLM
- 🔗 Freighter wallet connect / disconnect
- 💰 Live XLM balance fetching and display (Stellar Testnet)
- 🚰 One-click Testnet funding via Friendbot
- ➤ Send XLM transactions directly from the app, with success/failure feedback and a link to view the confirmed transaction on Stellar Expert
- 🎯 Quests and stats pages

## Tech Stack

- Next.js 13 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- `@stellar/freighter-api` for wallet connection and transaction signing
- `stellar-sdk` for building and submitting transactions to Horizon (Testnet)

## Setup Instructions (Run Locally)

**Prerequisites:**
- Node.js 18+
- [Freighter wallet extension](https://freighter.app) installed in your browser, set to **Testnet**

**Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform.git
cd BuilderLeaderboard-Platform

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

The app will be running at `http://localhost:3000`. No environment variables or API keys are required — leaderboard data is currently mock data (`lib/mockData.ts`), and all Stellar network calls use the public Testnet Horizon and Friendbot endpoints.

**To test the wallet features:**
1. Open Freighter and make sure it's unlocked and set to **Test Net**
2. Click **Connect Wallet** on the site
3. If your wallet has no Testnet XLM yet, use **Fund with Friendbot** to get 10,000 testnet XLM
4. Click **Send XLM** to send a test transaction to any valid Testnet address

## Screenshots

### Wallet Connected State & Balance Displayed
Shows the connected wallet (public key, green "connected" indicator) and the live XLM Testnet balance fetched from Horizon.

![Wallet connected and balance displayed](./screenshots/wallet-connected-balance.png)

### Successful Testnet Transaction
A transaction being sent through the app's Send XLM form, with a green confirmation once submitted successfully.

![Successful testnet transaction](./screenshots/transaction-sent.png)

### Transaction Result Shown to User
The transaction confirmed on-chain, verified via Stellar Expert (Testnet) — showing status, ledger, source/destination accounts, and signature.

![Transaction confirmed on Stellar Expert](./screenshots/transaction-confirmed-explorer.png)

## Project Structure

```
app/                  Next.js app router pages
components/           UI components (WalletConnect, QuestCard, LeaderboardTable, etc.)
hooks/useWallet.ts    Wallet state management hook (connect, disconnect, balance, send)
lib/stellar.ts        Stellar SDK + Freighter integration (connect, balance, send, fund)
lib/mockData.ts       Mock leaderboard/quest data
```

## License

This project was built as a submission for the Stellar Journey to Mastery program (White Belt level).
