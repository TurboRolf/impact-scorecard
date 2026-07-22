import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.ethisay.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oxufipwdfdnvrxtihmte.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dWZpcHdkZmRudnJ4dGlobXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODk0NTcsImV4cCI6MjA3MjE2NTQ1N30.pgL1R-YqHDUB0Bfs8wd613f3GfxBWVhGG_QEcXQJhog";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchCompanies(): Promise<SitemapEntry[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("Failed to fetch companies for sitemap:", error.message);
    return [];
  }

  return (data || []).map((company) => ({
    path: `/company/${company.id}`,
    lastmod: company.updated_at ? new Date(company.updated_at).toISOString().split("T")[0] : undefined,
    changefreq: "weekly",
    priority: "0.6",
  }));
}

async function fetchProfiles(): Promise<SitemapEntry[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("Failed to fetch profiles for sitemap:", error.message);
    return [];
  }

  return (data || []).map((profile) => ({
    path: `/user/${profile.user_id}`,
    lastmod: profile.updated_at ? new Date(profile.updated_at).toISOString().split("T")[0] : undefined,
    changefreq: "weekly",
    priority: "0.5",
  }));
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const staticEntries: SitemapEntry[] = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/companies", changefreq: "daily", priority: "0.8" },
    { path: "/boycotts", changefreq: "daily", priority: "0.8" },
    { path: "/creators", changefreq: "daily", priority: "0.8" },
    { path: "/about", changefreq: "monthly", priority: "0.4" },
    { path: "/help", changefreq: "monthly", priority: "0.4" },
    { path: "/contact", changefreq: "monthly", priority: "0.4" },
    { path: "/privacy", changefreq: "monthly", priority: "0.3" },
    { path: "/terms", changefreq: "monthly", priority: "0.3" },
  ];

  const [companyEntries, profileEntries] = await Promise.all([
    fetchCompanies(),
    fetchProfiles(),
  ]);

  const allEntries = [...staticEntries, ...companyEntries, ...profileEntries];

  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(allEntries));
  console.log(`sitemap.xml written with ${allEntries.length} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
