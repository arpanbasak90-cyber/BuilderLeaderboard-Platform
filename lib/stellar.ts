import * as StellarSdk from "stellar-sdk";

export type StellarNetwork = "testnet" | "mainnet" | "localhost";

const HORIZON_URLS: Record<StellarNetwork, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
  localhost: "http://localhost:8000",
};

const NETWORK_PASSPHRASES: Record<StellarNetwork, string> = {
  testnet: StellarSdk.Networks.TESTNET,
  mainnet: StellarSdk.Networks.PUBLIC,
  localhost: "Standalone Network ; February 2017",
};

function getServer(network: StellarNetwork = "testnet") {
  return new StellarSdk.Horizon.Server(HORIZON_URLS[network]);
}

// Connect Freighter Wallet
export async function connectWallet(): Promise<string> {
  const freighter = await import("@stellar/freighter-api");

  const connected = await freighter.isConnected();
  if (!connected) {
    throw new Error("Freighter wallet is not installed. Please install it from https://freighter.app");
  }

  const access = await freighter.requestAccess();
  if (access.error) {
    throw new Error("User denied wallet access");
  }

  const addressResult = await freighter.getAddress();
  if (addressResult.error) {
    throw new Error("Could not get public key");
  }

  return addressResult.address;
}

// Get XLM Balance
export async function getXLMBalance(publicKey: string, network: StellarNetwork = "testnet"): Promise<string> {
  const server = getServer(network);
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (b: any) => b.asset_type === "native"
    );
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : "0.00";
  } catch (e: any) {
    if (e.response?.status === 404) {
      return "0.00 (unfunded)";
    }
    throw new Error("Failed to fetch balance");
  }
}

// Fund account via Friendbot
export async function fundWithFriendbot(publicKey: string, network: StellarNetwork = "testnet"): Promise<void> {
  const url = network === "localhost"
    ? `http://localhost:8000/friendbot?addr=${publicKey}`
    : `https://friendbot.stellar.org?addr=${publicKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Friendbot funding failed");
  }
}

// Send XLM Transaction
export async function sendXLM(
  senderPublicKey: string,
  destination: string,
  amount: string,
  memo?: string,
  network: StellarNetwork = "testnet"
): Promise<string> {
  const freighter = await import("@stellar/freighter-api");
  const server = getServer(network);
  const networkPassphrase = NETWORK_PASSPHRASES[network];

  // Validate destination
  if (!StellarSdk.StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error("Invalid destination Stellar address");
  }

  // Load sender account
  const sourceAccount = await server.loadAccount(senderPublicKey);

  // Auto-fund destination if it does not exist on testnet/localhost
  try {
    await server.loadAccount(destination);
  } catch (e: any) {
    if (e.response?.status === 404) {
      try {
        const friendbotUrl = network === "localhost"
          ? `http://localhost:8000/friendbot?addr=${destination}`
          : `https://friendbot.stellar.org?addr=${destination}`;
        const fundRes = await fetch(friendbotUrl);
        if (fundRes.ok) {
          // Wait briefly for ledger ingestion
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (fbErr) {
        console.warn("Auto-funding destination failed:", fbErr);
      }
    }
  }

  // Build transaction
  let txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount,
      })
    )
    .setTimeout(30);

  if (memo) {
    txBuilder = txBuilder.addMemo(StellarSdk.Memo.text(memo));
  }

  const transaction = txBuilder.build();
  const xdr = transaction.toXDR();

  // Sign with Freighter
  const signResult = await freighter.signTransaction(xdr, {
    networkPassphrase,
  });

  if (signResult.error) {
    throw new Error("Transaction signing failed or was rejected");
  }

  // Submit transaction
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signResult.signedTxXdr,
    networkPassphrase
  );

  const result = await server.submitTransaction(signedTx);
  return result.hash;
}