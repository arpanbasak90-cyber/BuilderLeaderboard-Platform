# User Guide — BuilderBoard Platform

## What is BuilderBoard?

BuilderBoard is a gamified leaderboard for Stellar ecosystem builders. You compete with other developers by completing blockchain quests, earning XP and XLM rewards, and climbing the leaderboard rankings — all proven by real on-chain Stellar transactions.

**Live App:** https://builder-leaderboard-platform.vercel.app

---

## Getting Started

### Step 1: Install a Stellar Wallet

You need one of these wallet browser extensions:

| Wallet | Install Link | Recommended |
|---|---|---|
| **Freighter** | https://freighter.app | ✅ Yes |
| xBull | https://xbull.app | Optional |
| LOBSTR | https://lobstr.co | Optional |

> **Important:** Set your wallet to **Testnet** mode before connecting. In Freighter, go to Settings → Network → Testnet.

### Step 2: Connect Your Wallet

1. Open https://builder-leaderboard-platform.vercel.app
2. You'll see the **Connect Wallet** entry gate
3. Click **Connect Wallet to Enter**
4. Select your wallet from the picker
5. Approve the connection request in the wallet popup

### Step 3: Register Your Builder Profile

Once connected:
1. Scroll to **"Your Builder Profile"** on the home page
2. Enter your **builder handle** (username, max 20 chars)
3. Pick an **avatar** from the options
4. Click **🚀 Join Leaderboard**
5. You'll instantly appear on the leaderboard!

### Step 4: Fund Your Testnet Wallet

If you have no testnet XLM:
1. Click **Fund with Friendbot** in the wallet connect panel (top right)
2. You'll receive **10,000 testnet XLM** instantly
3. This is free testnet money — not real XLM

---

## Completing Quests

### Browse Quests
Navigate to **Quests** in the top navigation bar. You'll see all available quests with:
- Difficulty level (Beginner / Intermediate / Advanced)
- XP reward
- XLM reward
- Category (Smart Contract, DeFi, NFT, etc.)

### Start a Quest
1. Click **Start Quest** on any quest card
2. The quest status changes to **In Progress**

### Complete a Quest
1. Click **Complete Quest** (after starting)
2. A **Transaction Modal** will appear showing:
   - The quest name and rewards
   - Transaction details (network, memo, fee)
3. Click **Confirm & Sign**
4. Your wallet popup will appear — **review and approve**
5. The transaction is submitted to Stellar Testnet
6. On success: your XP and XLM are credited, leaderboard updates!

> 💡 Each quest completion creates a real on-chain Stellar transaction, viewable on [Stellar Expert](https://stellar.expert/explorer/testnet).

### Claim Your Reward
After completing, click **Claim Reward** to officially record the completion and award your XP to the leaderboard.

---

## Creating Custom Quests

As a builder, you can create your own quests:

1. Go to the **Quests** page
2. Click **➕ Create Quest** (top right)
3. Fill in:
   - Quest title
   - Description
   - Difficulty (Beginner / Intermediate / Advanced)
   - XP reward
   - XLM reward
   - Category
4. Click **Create Quest**
5. Your quest appears in the list immediately

---

## Smart Contract Demo

The **Smart Contract Demo** section (home page) lets you interact with a live Soroban contract on Stellar Testnet:

1. Connect your wallet
2. Scroll to **"Smart Contract Demo"**
3. See the current on-chain counter value
4. Click **➕ Increment Counter**
5. Approve in your wallet
6. Counter value updates on-chain!

Contract address: `CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH`

---

## Fee Sponsorship (Gasless Transactions)

BuilderBoard supports **Fee Bump** transactions — an advanced Stellar feature where the platform treasury pays your network fees:

- When fee sponsorship is active, your quest transactions cost **0 XLM** in fees
- You only need XLM for actual quest reward transfers
- The treasury sponsor account covers network fees on your behalf
- This makes BuilderBoard accessible even to brand-new builders with minimal XLM

---

## Leaderboard & Rankings

- Builders are ranked by **Total XP** (highest first)
- Your rank updates live as you complete quests
- Top 3 builders get **🥇🥈🥉 medal badges** on the podium
- Weekly XP gain is also tracked to see who's most active this week

---

## Analytics Dashboard

Navigate to **Analytics** to see:
- Total onboarded builders
- Wallet interaction count
- Average user rating
- Pie chart of wallet action types
- Bar chart of feedback ratings
- Full list of onboarded builders with their stats
- Complete wallet interaction log with tx hashes

---

## Leaving Feedback

Help improve the platform:
1. Scroll to **"User Feedback"** on the home page
2. Rate the platform 1-5 stars
3. Write a short comment
4. Click **Submit Feedback**

Your feedback is stored in the analytics dashboard and used to improve the platform.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Wallet not connecting | Make sure Freighter is installed, unlocked, and set to Testnet |
| "Wallet not found" error | Install the Freighter browser extension from freighter.app |
| Transaction rejected | You cancelled the wallet popup — try again and click Approve |
| Insufficient balance | Use "Fund with Friendbot" to get free testnet XLM |
| Quest not updating | Refresh the page; quest state is saved in your browser |
| Balance not showing | Wait a few seconds; Horizon API may take a moment to respond |

---

## Support

- **GitHub Issues:** https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform/issues
- **Demo Video:** https://youtu.be/hJR_3ioguC4
- **Live App:** https://builder-leaderboard-platform.vercel.app
