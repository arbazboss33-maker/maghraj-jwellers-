import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maghrajjewellers.in";

  const staticRoutes = ["", "/shop", "/about", "/gallery", "/blog", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  try {
    const supabase = await createClient();
    const { data: products } = await supabase.from("products").select("slug, updated_at").eq("is_published", true);
    const productRoutes = (products ?? []).map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(p.updated_at),
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
