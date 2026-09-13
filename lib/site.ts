import { appOrigin } from "@/lib/app-url";

export const siteName = "Gifty";

export const siteTitle = "Gifty";

export const siteTagline =
  "Login, a real ENS name, money in, money out, and a way to pull the next person in.";

export const siteDescription =
  "Send ETH with a gift link. Recipients sign in with Privy, pick a free ENS name on gifty.eth, and claim on Base. No seed phrase.";

export const siteShortDescription =
  "Give a friend ETH and an ENS name with one link. Privy signup faster than fintechs, 0 crypto jargon.";

export function siteUrl(path = "/") {
  const origin = appOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function siteJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: siteName,
        url,
        description: siteDescription,
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${url}/#app`,
        name: siteName,
        url,
        description: siteDescription,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Privy email and Google login with an embedded Base wallet",
          "Free ENSv2 username on gifty.eth at signup",
          "ETH gift links claimed with a browser PLONK proof on Base",
          "Privy fiat onramp to Base USDC and ETH/USDC swaps",
        ],
      },
    ],
  };
}
