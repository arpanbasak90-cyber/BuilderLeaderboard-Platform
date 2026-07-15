import * as StellarSdk from "stellar-sdk";

export type StellarNetwork = "testnet" | "mainnet";

const HORIZON_URLS: Record<StellarNetwork, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

const NETWORK_PASSPHRASES: Record<StellarNetwork, string> = {
  testnet: StellarSdk.Networks.TESTNET,
  mainnet: StellarSdk.Networks.PUBLIC,
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

// Fund account via Friendbot (testnet only)
export async function fundWithFriendbot(publicKey: string): Promise<void> {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${publicKey}`
  );
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