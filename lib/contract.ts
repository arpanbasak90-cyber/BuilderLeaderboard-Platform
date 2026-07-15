import * as StellarSdk from "@stellar/stellar-sdk";
import { Contract, rpc as SorobanRpc } from "@stellar/stellar-sdk";

export const COUNTER_CONTRACT_ID =
  "CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH";

const RPC_URLS = {
  testnet: "https://soroban-testnet.stellar.org",
  mainnet: "https://soroban-mainnet.stellar.org",
  localhost: "http://localhost:8000",
};

const PASSPHRASES = {
  testnet: StellarSdk.Networks.TESTNET,
  mainnet: StellarSdk.Networks.PUBLIC,
  localhost: "Standalone Network ; February 2017",
};

function getSorobanServer(network: "testnet" | "mainnet" | "localhost") {
  return new SorobanRpc.Server(RPC_URLS[network]);
}

export type TxStatus = "idle" | "pending" | "success" | "error";

export async function incrementCounter(
  callerPublicKey: string,
  network: "testnet" | "mainnet" | "localhost" = "testnet"
): Promise<{ value: number; hash: string }> {
  const freighter = await import("@stellar/freighter-api");
  const server = getSorobanServer(network);
  const networkPassphrase = PASSPHRASES[network];

  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(COUNTER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call("increment"))
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  const prepared = SorobanRpc.assembleTransaction(tx, simulated).build();
  const xdr = prepared.toXDR();

  const signResult = await freighter.signTransaction(xdr, {
    networkPassphrase,
  });
  if (signResult.error) {
    throw new Error("Transaction signing failed or was rejected");
  }

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signResult.signedTxXdr,
    networkPassphrase
  );

  const sendResponse = await server.sendTransaction(signedTx);
  if (sendResponse.status === "ERROR") {
    throw new Error("Transaction submission failed");
  }

  const hash = sendResponse.hash;

  let getResponse = await server.getTransaction(hash);
  let attempts = 0;
  while (getResponse.status === "NOT_FOUND" && attempts < 15) {
    await new Promise((r) => setTimeout(r, 1500));
    getResponse = await server.getTransaction(hash);
    attempts++;
  }

  if (getResponse.status !== "SUCCESS") {
    throw new Error(`Transaction failed with status: ${getResponse.status}`);
  }

  const returnValue = getResponse.returnValue;
  const value = returnValue ? StellarSdk.scValToNative(returnValue) : 0;

  return { value: Number(value), hash };
}

export async function getCounterValue(
  callerPublicKey: string,
  network: "testnet" | "mainnet" | "localhost" = "testnet"
): Promise<number> {
  const server = getSorobanServer(network);
  const networkPassphrase = PASSPHRASES[network];
  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(COUNTER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call("get_count"))
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  if (!SorobanRpc.Api.isSimulationSuccess(simulated)) {
    throw new Error("Simulation did not return a result");
  }

  const result = simulated.result?.retval;
  const value = result ? StellarSdk.scValToNative(result) : 0;
  return Number(value);
}

export async function callIncrementContract(
  callerPublicKey: string,
  signTransaction: (xdr: string) => Promise<string>,
  network: "testnet" | "mainnet" | "localhost" = "testnet"
): Promise<string> {
  const server = getSorobanServer(network);
  const networkPassphrase = PASSPHRASES[network];
  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(COUNTER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call("increment"))
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  const prepared = SorobanRpc.assembleTransaction(tx, simulated).build();
  const signedXdr = await signTransaction(prepared.toXDR());

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    networkPassphrase
  );

  const sendResponse = await server.sendTransaction(signedTx);
  if (sendResponse.status === "ERROR") {
    throw new Error(`Transaction submission failed: ${JSON.stringify(sendResponse)}`);
  }

  const hash = sendResponse.hash;

  let getResponse = await server.getTransaction(hash);
  let attempts = 0;
  while (getResponse.status === "NOT_FOUND" && attempts < 15) {
    await new Promise((r) => setTimeout(r, 1500));
    getResponse = await server.getTransaction(hash);
    attempts++;
  }

  if (getResponse.status !== "SUCCESS") {
    throw new Error(`Transaction failed: ${JSON.stringify(getResponse)}`);
  }

  return hash;
}

export async function getContractCount(
  network: "testnet" | "mainnet" | "localhost" = "testnet"
): Promise<number> {
  try {
    const DUMMY_KEY = "GBHJQJ3BER2EDAHXBNK3QNJRTUZZV4K36GNDEPNN455KEK5NUPPTUR3L";
    return await getCounterValue(DUMMY_KEY, network);
  } catch {
    return 0;
  }
}