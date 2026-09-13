import type { MetadataRoute } from "next";
import { siteName, siteShortDescription } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteShortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#5C7078",
    theme_color: "#042f2e",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
