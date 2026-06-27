import * as StellarSdk from "@stellar/stellar-sdk";
import { Contract, rpc as SorobanRpc } from "@stellar/stellar-sdk";

export const COUNTER_CONTRACT_ID =
  "CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new SorobanRpc.Server(RPC_URL);

export type TxStatus = "idle" | "pending" | "success" | "error";

export async function incrementCounter(
  callerPublicKey: string
): Promise<{ value: number; hash: string }> {
  const freighter = await import("@stellar/freighter-api");

  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(COUNTER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
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
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  if (signResult.error) {
    throw new Error("Transaction signing failed or was rejected");
  }

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signResult.signedTxXdr,
    NETWORK_PASSPHRASE
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

export async function getCounterValue(callerPublicKey: string): Promise<number> {
  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(COUNTER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
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
  signTransaction: (xdr: string) => Promise<string>
): Promise<string> {
  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(COUNTER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
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
    NETWORK_PASSPHRASE
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

export async function getContractCount(): Promise<number> {
  try {
    const DUMMY_KEY = "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN";
    return await getCounterValue(DUMMY_KEY);
  } catch {
    return 0;
  }
}