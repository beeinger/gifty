import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { MONEY_CHAIN } from "@/lib/chain/config";
import { parseSwapBody, userSwapError, type SwapQuote } from "@/lib/swap";

export const dynamic = "force-dynamic";

type LiFiQuote = {
  message?: string;
  estimate?: {
    toAmount?: string;
    approvalAddress?: string;
  };
  transactionRequest?: {
    to?: string;
    data?: string;
    value?: string;
  };
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const swap = parseSwapBody(body);
    const params = new URLSearchParams({
      fromChain: String(MONEY_CHAIN.id),
      toChain: String(MONEY_CHAIN.id),
      fromToken: swap.fromToken,
      toToken: swap.toToken,
      fromAmount: swap.baseAmount,
      fromAddress: swap.address,
      slippage: "0.005",
      integrator: "gifty",
    });

    const res = await fetch(`https://li.quest/v1/quote?${params}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const quote = (await res.json()) as LiFiQuote;
    if (!res.ok) {
      throw new Error(quote.message ?? "Could not quote this swap.");
    }

    const to = quote.transactionRequest?.to;
    const data = quote.transactionRequest?.data;
    const outputAmount = quote.estimate?.toAmount;
    if (!to || !isAddress(to) || !data || !outputAmount) {
      throw new Error("Quote missing swap transaction.");
    }

    const approval = quote.estimate?.approvalAddress;
    const payload: SwapQuote = {
      from: swap.from,
      to: swap.to,
      outputAmount,
      sellAmount: swap.baseAmount,
      approvalAddress:
        swap.from === "USDC" && approval && isAddress(approval)
          ? approval
          : null,
      sellToken: swap.fromToken,
      tx: {
        to,
        data: data as `0x${string}`,
        value: quote.transactionRequest?.value ?? "0x0",
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    const parsed = userSwapError(error, "Could not quote this swap.");
    return NextResponse.json({ error: parsed.message }, { status: parsed.status });
  }
}
