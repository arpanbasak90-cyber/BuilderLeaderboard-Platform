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

<img width="1331" height="639" alt="screenshot no 2" src="https://github.com/user-attachments/assets/66dc8758-f0c2-4ab2-9ae2-4875372a0716" />


### Successful Testnet Transaction
A transaction being sent through the app's Send XLM form, with a green confirmation once submitted successfully.

<img width="1331" height="639" alt="screenshot no 2" src="https://github.com/user-attachments/assets/0e6b4eec-e2a0-4dbb-91f7-dd84a2ad1732" />


### Transaction Result Shown to User
The transaction confirmed on-chain, verified via Stellar Expert (Testnet) — showing status, ledger, source/destination accounts, and signature.

<img width="1341" height="641" alt="Scrrenshot no 3" src="https://github.com/user-attachments/assets/342a6b17-0a5a-4087-8427-8c677a352019" />


## Project Structure

```
app/                  Next.js app router pages
components/           UI components (WalletConnect, QuestCard, LeaderboardTable, etc.)
hooks/useWallet.ts    Wallet state management hook (connect, disconnect, balance, send)
lib/stellar.ts        Stellar SDK + Freighter integration (connect, balance, send, fund)
lib/mockData.ts       Mock leaderboard/quest data

## 🥋 Yellow Belt — Smart Contract Integration

### Deployed Contract
- **Contract Address:** `CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH`
- **Network:** Stellar Testnet
- **Contract Functions:** `increment()`, `get_count()`

### Verified Transaction (Contract Call from Frontend)
- **Transaction Hash:** `3888c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/3888c2fe67f8c4dac0641aa57ad747c66aaf77b02abbc176acd597e23e97c45b)

### Multi-Wallet Support
Wallet picker modal supporting 3 wallets (visible on live demo):
- 🟣 Freighter
- 🔵 xBull
- 🟠 LOBSTR

> 👉 **See live wallet picker:** https://builder-leaderboard-platform.vercel.app

### Error Handling (3 Types)
| Error Type | Description |
|---|---|
| `WALLET_NOT_FOUND` | Wallet extension not installed |
| `USER_REJECTED` | User cancelled the signing request |
| `INSUFFICIENT_BALANCE` | Not enough XLM for transaction fee |

### Contract Demo
> 👉 **Try it live:** https://builder-leaderboard-platform.vercel.app
> Scroll to "Smart Contract Demo" → Connect Wallet → Increment Counter
```

### Screenshot — Wallet Options

<img width="1325" height="678" alt="screenchot no 4" src="https://github.com/user-attachments/assets/0b25b855-9567-4f89-8200-4663efcc2b23" />

### Screenshot — Contract Demo Success

<img width="1321" height="595" alt="Screenshot no 5" src="https://github.com/user-attachments/assets/78891169-910d-40e8-8b58-7ca9f942794d" />

## Screenshot- Mobile Responsive UI

<img width="1856" height="10497" alt="mobile-responsive png" src="https://github.com/user-attachments/assets/c71c8fbf-81af-4396-8e6c-fcd897a4326f" />

## Screenshot -Test Output

<img width="763" height="423" alt="screenshot no 6" src="https://github.com/user-attachments/assets/6aec6e6f-ab19-42f1-96fa-58fc86a407c1" />

## Screenshot- CI/CD Pipeline

<img width="1339" height="581" alt="Screenshot no 7" src="https://github.com/user-attachments/assets/0ce6a9f8-e2b7-4e1d-a1be-7de0405a1eed" />




## License
This project was built as a submission for the Stellar Journey to Mastery program (White Belt + Yellow Belt levels).
