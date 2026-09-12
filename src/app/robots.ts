import type { MetadataRoute } from "next";

// Required by `output: "export"` — this file is generated once at build time.
export const dynamic = "force-static";
import { isStaging } from "@/lib/env";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    // Staging must never be crawled.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
