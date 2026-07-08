"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

// ── CATEGORIES ────────────────────────────────────────────────
export async function upsertCategory(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const payload = {
    name,
    slug: slugify(name),
    metal_type: formData.get("metal_type") as string,
    display_order: Number(formData.get("display_order")) || 0,
    is_active: formData.get("is_active") === "on",
  };
  if (id) await supabase.from("categories").update(payload).eq("id", id);
  else await supabase.from("categories").insert(payload);
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}

// ── BANNERS ──────────────────────────────────────────────────
export async function upsertBanner(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const payload = {
    placement: formData.get("placement") as string,
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    cta_label: formData.get("cta_label") as string,
    cta_link: formData.get("cta_link") as string,
    display_order: Number(formData.get("display_order")) || 0,
    is_active: formData.get("is_active") === "on",
  };

  let bannerId = id;
  if (id) {
    await supabase.from("banners").update(payload).eq("id", id);
  } else {
    const { data } = await supabase.from("banners").insert(payload).select().single();
    bannerId = data?.id;
  }

  const file = formData.get("image") as File;
  if (file && file.size > 0) {
    const path = `banners/${bannerId}-${Date.now()}.${file.name.split(".").pop()}`;
    await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
    await supabase.from("banners").update({ image_url: urlData.publicUrl }).eq("id", bannerId);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  const supabase = createAdminClient();
  await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

// ── COUPONS ──────────────────────────────────────────────────
export async function upsertCoupon(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const payload = {
    code: (formData.get("code") as string).toUpperCase(),
    description: formData.get("description") as string,
    discount_type: formData.get("discount_type") as string,
    discount_value: Number(formData.get("discount_value")) || 0,
    min_order_value: Number(formData.get("min_order_value")) || 0,
    usage_limit: Number(formData.get("usage_limit")) || null,
    is_active: formData.get("is_active") === "on",
  };
  if (id) await supabase.from("coupons").update(payload).eq("id", id);
  else await supabase.from("coupons").insert(payload);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient();
  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/coupons");
}

// ── REVIEWS ──────────────────────────────────────────────────
export async function setReviewApproval(id: string, approved: boolean) {
  const supabase = createAdminClient();
  await supabase.from("reviews").update({ is_approved: approved }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  const supabase = createAdminClient();
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
}

// ── ORDERS ───────────────────────────────────────────────────
export async function updateOrderStatus(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const tracking_number = formData.get("tracking_number") as string;
  const tracking_courier = formData.get("tracking_courier") as string;

  await supabase.from("orders").update({ status, tracking_number, tracking_courier }).eq("id", id);
  await supabase.from("order_status_history").insert({ order_id: id, status, note: "Updated by admin" });
  revalidatePath("/admin/orders");
}

// ── CUSTOMERS ────────────────────────────────────────────────
export async function toggleCustomerBlock(id: string, blocked: boolean) {
  const supabase = createAdminClient();
  await supabase.from("customers").update({ is_blocked: blocked }).eq("id", id);
  revalidatePath("/admin/customers");
}

// ── BLOG ─────────────────────────────────────────────────────
export async function upsertBlogPost(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const payload = {
    title,
    slug: slugify(title),
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    seo_title: formData.get("seo_title") as string,
    seo_description: formData.get("seo_description") as string,
    is_published: formData.get("is_published") === "on",
    published_at: new Date().toISOString(),
  };
  if (id) await supabase.from("blog_posts").update(payload).eq("id", id);
  else await supabase.from("blog_posts").insert(payload);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = createAdminClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
}

// ── SITE SETTINGS (logo, theme, contact, SEO, business hours) ─
export async function updateSiteSettings(formData: FormData) {
  const supabase = createAdminClient();
  const payload = {
    brand_name: formData.get("brand_name") as string,
    tagline: formData.get("tagline") as string,
    theme_primary: formData.get("theme_primary") as string,
    theme_secondary: formData.get("theme_secondary") as string,
    default_mode: formData.get("default_mode") as string,
    phone: formData.get("phone") as string,
    whatsapp_number: formData.get("whatsapp_number") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    google_maps_embed: formData.get("google_maps_embed") as string,
    instagram_url: formData.get("instagram_url") as string,
    facebook_url: formData.get("facebook_url") as string,
    seo_title: formData.get("seo_title") as string,
    seo_description: formData.get("seo_description") as string,
    seo_keywords: formData.get("seo_keywords") as string,
    gst_number: formData.get("gst_number") as string,
    hallmark_license: formData.get("hallmark_license") as string,
    updated_at: new Date().toISOString(),
  };

  const logo = formData.get("logo") as File;
  let logo_url: string | undefined;
  if (logo && logo.size > 0) {
    const path = `logo-${Date.now()}.${logo.name.split(".").pop()}`;
    await supabase.storage.from("site-assets").upload(path, logo, { upsert: true });
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    logo_url = data.publicUrl;
  }

  await supabase.from("site_settings").update({ ...payload, ...(logo_url && { logo_url }) }).eq("id", 1);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
