export type MetalType = "gold" | "silver" | "diamond" | "platinum";
export type StockStatus = "in_stock" | "made_to_order" | "out_of_stock";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  metal_type: MetalType | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  media_type: "image" | "video";
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  description: string | null;
  short_description: string | null;
  metal_type: MetalType;
  purity: string | null;
  hallmark_number: string | null;
  gross_weight_grams: number | null;
  net_weight_grams: number | null;
  stone_weight_grams: number | null;
  gold_rate_per_gram: number | null;
  making_charges_type: "percentage" | "flat";
  making_charges_value: number;
  wastage_percentage: number;
  stone_charges: number;
  gst_percentage: number;
  base_price: number | null;
  discount_percentage: number;
  tags: string[];
  gender: "women" | "men" | "kids" | "unisex";
  occasion: string | null;
  stock_status: StockStatus;
  stock_quantity: number;
  is_featured: boolean;
  is_published: boolean;
  media?: ProductMedia[];
  category?: Category;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  image_url: string | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  gst_amount: number;
  total: number;
  shipping_address: Record<string, string>;
  tracking_number: string | null;
  tracking_courier: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name_snapshot: string;
  quantity: number;
  price_snapshot: number;
  weight_snapshot: number | null;
  purity_snapshot: string | null;
}

export interface Banner {
  id: string;
  placement: "hero" | "strip" | "shop_top" | "festival";
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_link: string | null;
  image_url: string | null;
  image_url_mobile: string | null;
  display_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  theme_primary: string;
  theme_secondary: string;
  default_mode: "light" | "dark";
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string;
  google_maps_embed: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  business_hours: Record<string, string>;
  seo_title: string;
  seo_description: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
