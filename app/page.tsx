import type { Metadata } from "next";
import HomeClient from "@/components/home-client";
import { siteDescription, siteTitle } from "@/lib/site";

function getCodeParam(
  code: string | string[] | undefined,
): string | undefined {
  if (typeof code === "string" && code.length > 0) return code;
  if (Array.isArray(code) && typeof code[0] === "string" && code[0].length > 0) {
    return code[0];
  }
  return undefined;
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const { code: codeParam } = await searchParams;
  const code = getCodeParam(codeParam);
  if (!code) {
    return {
      title: { absolute: `${siteTitle} — send ETH and an ENS name with a link` },
      description: siteDescription,
    };
  }
  return {
    title: "Claim a gift",
    description:
      "Someone sent you ETH on Gifty. Sign in with Privy, pick a free ENS name, and claim it.",
    robots: { index: false, follow: false },
    openGraph: {
      title: "Claim a gift on Gifty",
      description:
        "Someone sent you ETH. Sign in, pick a free ENS name, and claim it.",
    },
  };
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const { code: codeParam } = await searchParams;
  const code = getCodeParam(codeParam);

  return <HomeClient initialCode={code} />;
}
