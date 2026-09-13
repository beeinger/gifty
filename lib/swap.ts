import { isAddress, parseEther, parseUnits } from "viem";
import { BASE_NATIVE, BASE_USDC } from "@/lib/chain/config";

export type SwapSide = "ETH" | "USDC";

export type SwapQuote = {
  from: SwapSide;
  to: SwapSide;
  outputAmount: string;
  sellAmount: string;
  approvalAddress: string | null;
  sellToken: `0x${string}`;
  tx: {
    to: `0x${string}`;
    data: `0x${string}`;
    value: string;
  };
};

export function parseSwapBody(body: unknown): {
  address: `0x${string}`;
  from: SwapSide;
  to: SwapSide;
  amount: string;
  baseAmount: string;
  fromToken: typeof BASE_USDC | typeof BASE_NATIVE;
  toToken: typeof BASE_USDC | typeof BASE_NATIVE;
} {
  const record = (body ?? {}) as {
    from?: unknown;
    amount?: unknown;
    address?: unknown;
  };
  const from =
    record.from === "USDC" ? "USDC" : record.from === "ETH" ? "ETH" : null;
  const amount =
    typeof record.amount === "string" ? record.amount.trim() : "";
  const address =
    typeof record.address === "string" ? record.address.trim() : "";

  if (!from) throw new Error("Choose ETH or USDC to sell.");
  if (!amount || Number(amount) <= 0) throw new Error("Enter an amount.");
  if (!isAddress(address)) throw new Error("Invalid wallet address.");

  const to: SwapSide = from === "ETH" ? "USDC" : "ETH";
  const baseAmount =
    from === "ETH"
      ? parseEther(amount).toString()
      : parseUnits(amount, 6).toString();

  return {
    address: address as `0x${string}`,
    from,
    to,
    amount,
    baseAmount,
    fromToken: from === "ETH" ? BASE_NATIVE : BASE_USDC,
    toToken: to === "ETH" ? BASE_NATIVE : BASE_USDC,
  };
}

export function userSwapError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status =
    message.startsWith("Choose") ||
    message.startsWith("Enter") ||
    message.startsWith("Invalid")
      ? 400
      : 502;
  return { message, status };
}
