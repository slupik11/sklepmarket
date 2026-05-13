import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sklepmarket.pl";
  const supabase = createClient();

  // Active listings
  const { data: listings } = await supabase
    .from("listings")
    .select("slug, created_at")
    .eq("status", "active");

  // Published blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true);

  const listingUrls: MetadataRoute.Sitemap =
    listings?.map((l) => ({
      url: `${baseUrl}/oferty/${l.slug}`,
      lastModified: new Date(l.created_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })) ?? [];

  const blogUrls: MetadataRoute.Sitemap =
    posts?.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/oferty`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/sprzedaj`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/jak-to-dziala`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/o-nas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...listingUrls,
    ...blogUrls,
  ];
}
