/**
 * Fee Bump (Fee Sponsorship) — Black Belt Advanced Feature
 *
 * Fee Bump transactions allow a sponsor account to pay the transaction fee
 * on behalf of the original sender. This enables "gasless" UX where users
 * can interact with the Stellar network without needing XLM for fees.
 *
 * Reference: https://developers.stellar.org/docs/encyclopedia/fee-bump-transactions
 */

import {
  Horizon,
  Keypair,
  TransactionBuilder,
  FeeBumpTransaction,
  Transaction,
  Networks,
} from 'stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;

// The sponsor account that pays fees on behalf of users.
// In production this would be a secure server-side account (env var only).
// For demo purposes we expose the concept; real secret stays server-side.
const FEE_SPONSOR_PUBLIC_KEY = 'GAHJJJKMOKYE4RVPZEWZTKH5FVI4PA3VL7GK2LFNUBSGBV3B7WHXK7C';

export interface FeeBumpResult {
  hash: string;
  sponsored: boolean;
  baseFee: string;
}

/**
 * Wraps a signed inner transaction with a Fee Bump envelope,
 * so the sponsor (treasury) pays the network fee — not the user.
 *
 * @param signedInnerXdr - The fully signed inner transaction XDR from the user's wallet
 * @param sponsorSecretKey - The sponsor's secret key (server-side only, never client)
 * @returns The fee bump transaction hash
 */
export async function wrapWithFeeBump(
  signedInnerXdr: string,
  sponsorSecretKey: string
): Promise<FeeBumpResult> {
  const server = new Horizon.Server(HORIZON_URL);
  const sponsorKeypair = Keypair.fromSecret(sponsorSecretKey);

  // Parse the inner transaction
  const innerTx = TransactionBuilder.fromXDR(signedInnerXdr, NETWORK_PASSPHRASE) as Transaction;

  // Build the fee bump envelope
  const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    '200', // max fee per operation in stroops (0.00002 XLM)
    innerTx,
    NETWORK_PASSPHRASE
  );

  feeBumpTx.sign(sponsorKeypair);

  const response = await server.submitTransaction(feeBumpTx);

  return {
    hash: response.hash,
    sponsored: true,
    baseFee: '200',
  };
}

/**
 * Client-safe helper: checks if fee bump sponsorship is available.
 * In a real deployment, this would call your backend API to determine
 * if the sponsor account has sufficient balance to cover fees.
 */
export async function isSponsorshipAvailable(): Promise<boolean> {
  try {
    const server = new Horizon.Server(HORIZON_URL);
    const account = await server.loadAccount(FEE_SPONSOR_PUBLIC_KEY);
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
    // Sponsorship available if sponsor has > 10 XLM
    return xlmBalance ? parseFloat(xlmBalance.balance) > 10 : false;
  } catch {
    return false;
  }
}

/**
 * Build a sponsored (gasless) transaction for the user.
 * The inner transaction is built and signed by the user's wallet,
 * then the fee bump wraps it so the sponsor pays the fee.
 *
 * Flow:
 * 1. User builds inner tx (e.g. payment, contract call)
 * 2. User signs with their wallet (Freighter)
 * 3. Frontend sends signed XDR to backend sponsor endpoint
 * 4. Backend wraps with fee bump + sponsor signature
 * 5. Backend submits → user pays 0 fees
 *
 * This frontend module exposes the concept + client-side helpers.
 * The actual sponsor signing MUST happen server-side in production.
 */
export const FEE_BUMP_CONFIG = {
  sponsorPublicKey: FEE_SPONSOR_PUBLIC_KEY,
  network: 'testnet' as const,
  maxFeeStroops: '200',
  description: 'BuilderBoard Fee Sponsorship — gasless quest transactions for builders',
};
