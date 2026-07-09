# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (main branch) | ✅ |
| Older branches | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability in **BuilderBoard Platform**, please follow responsible disclosure:

1. **Do NOT open a public GitHub issue** for security vulnerabilities.
2. **Email the maintainer directly** at the contact email listed in the GitHub profile, with the subject line: `[SECURITY] BuilderBoard Vulnerability Report`.
3. Include:
   - A clear description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Any suggested fix (optional but appreciated)

We will acknowledge your report within **48 hours** and aim to release a patch within **7 days** for critical issues.

## Security Review

This project has undergone an internal security review covering:

### Smart Contract Security
- **Contract:** `CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH` (Testnet)
- **Review scope:** Soroban counter contract — integer overflow checks, access control, state mutation safety
- **Findings:** No critical vulnerabilities. Counter uses `i32` with safe Soroban SDK math. No privileged admin functions exposed.
- **Status:** ✅ Reviewed — no critical issues found

### Frontend Security
- **Wallet keys:** Never stored client-side. Freighter API handles all key management.
- **XDR signing:** All transaction signing happens inside the wallet extension sandbox — the app never accesses private keys.
- **Fee Bump:** Sponsor secret key is never exposed on the frontend — `lib/feeBump.ts` documents the server-side pattern.
- **localStorage:** Only non-sensitive data (XP, profile names, quest status) stored locally.
- **Input validation:** All user inputs (builder name, comment) are sanitized at component level with `maxLength` enforcement.
- **Dependencies:** Pinned to specific versions in `package-lock.json`. Regularly audited with `npm audit`.

### Transaction Safety
- All XLM transactions require explicit user approval via wallet extension popup.
- Transaction memos are sanitized and length-limited.
- Horizon endpoint uses official SDF testnet (`horizon-testnet.stellar.org`).

## Known Limitations (Testnet)

- This application currently runs on **Stellar Testnet** — no real funds are at risk.
- Mainnet deployment would require additional security review and a formal audit of any expanded smart contract logic.
- Fee Bump / sponsorship feature uses a demo treasury; production deployment requires a hardware-secured sponsor account.

## Security Best Practices for Builders Using This App

1. Always verify the Freighter popup shows the correct network (Testnet).
2. Never share your Stellar secret key with anyone.
3. Review transaction details in the wallet popup before approving.
4. Use Testnet XLM only — obtainable free from Friendbot.
