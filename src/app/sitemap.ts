import type { MetadataRoute } from "next";

// Required by `output: "export"` — this file is generated once at build time.
export const dynamic = "force-static";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date("2026-09-01"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
