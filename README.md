# Gifty

Social gift wallet. Send by link, username, or address. Privy signup mints a free ENSv2 username on Sepolia (`label.gifty.eth`). Gifts lock ETH on Base behind a Poseidon commitment and a browser PLONK proof. Spec: [`mission.md`](./mission.md).

## Run

```bash
bun install
bun run zk:setup
bun run deploy:ens-sepolia
bun run deploy:base
bun dev
```

Env: see `.env.example`. `NEXT_PUBLIC_APP_URL` is the public origin (`https://gifty.energia.dev`) used for gift links and metadata. `ALCHEMY_API_KEY` stays server-side (`/api/rpc` Base, `/api/balances`, `/api/ens`). Deployer key is `DEPLOYER_PRIVATE_KEY`. After deploy, `NEXT_PUBLIC_GIFTY_CLAIMER` (Base), `NEXT_PUBLIC_USERNAME_REGISTRAR` (Sepolia), and `NEXT_PUBLIC_ENS_PARENT=gifty.eth` are written into `.env`. Verify uses `ETHERSCAN_API_KEY`.

Needs Foundry (`forge`). `bun run zk:setup` installs `circom` into `.bin/` if it is not already on PATH.

Needs `NEXT_PUBLIC_PRIVY_APP_ID` (optional `NEXT_PUBLIC_PRIVY_CLIENT_ID`). Privy wallets stay on Base. Sepolia ENS is operator-only. ETH↔USDC swap quotes via LI.FI; user confirms in the same Privy tx popup as gifts.

## Layout

| Path | Role |
|---|---|
| `app/`, `components/`, `lib/` | Next.js app (Privy + Base money + Sepolia ENS) |
| `contracts/` | `GiftyClaimer`, `GiftyVerifier`, `GiftyRegistrar` |
| `circuit/` | Circom `gifty_claim` circuit |
| `lib/zk/` | Poseidon packing + browser prove helpers |
| `scripts/zk-setup.ts` | Circuit setup |
| `scripts/deploy-sepolia.ts` | Sepolia ENSv2 parent `gifty.eth` + registrar |
| `scripts/deploy-base.ts` | Base verifier + claimer |
| `mission.md` | Product spec |

## Chain split

- **Sepolia:** ENSv2 parent `gifty.eth`, `GiftyRegistrar`, username mint. Operator always sponsors register. User wallet never switches to Sepolia.
- **Base:** `GiftyClaimer` + `GiftyVerifier`, transfers, balances, Privy fiat onramp to Base USDC, crypto deposit into Base ETH, ETH↔USDC swap (LI.FI quote + Privy confirm). Operator sponsors claims if the user has no Base ETH.

## Progress

| Block | Status |
|---|---|
| Privy email + embedded wallet | done |
| Username at signup (`label.gifty.eth`) | done |
| Gift lock / ZK claim on Base | done |
| Privy onramp on Base | done (USDC card only) |
| Privy crypto deposit into Base ETH | done |
| ETH↔USDC swap on Base (LI.FI + Privy popup) | done |
| Demo spend card | done (live issuing mocked) |
