import type { Product } from "@/types";

export interface PriceBreakdown {
  metalValue: number;
  wastageAmount: number;
  makingCharges: number;
  stoneCharges: number;
  taxableValue: number;
  gst: number;
  total: number;
  mrp: number;
  youSave: number;
}

/**
 * Transparent, hallmark-jewellery-standard price computation —
 * shown on the Product Details page so customers can verify every rupee,
 * a key trust signal for a "Trusted Hallmark" brand promise.
 */
export function computePrice(product: Product): PriceBreakdown {
  const weight = product.net_weight_grams ?? 0;
  const rate = product.gold_rate_per_gram ?? 0;
  const metalValue = weight * rate;
  const wastageAmount = metalValue * ((product.wastage_percentage ?? 0) / 100);

  const makingCharges =
    product.making_charges_type === "percentage"
      ? metalValue * ((product.making_charges_value ?? 0) / 100)
      : product.making_charges_value ?? 0;

  const stoneCharges = product.stone_charges ?? 0;
  const taxableValue = metalValue + wastageAmount + makingCharges + stoneCharges;
  const gst = taxableValue * ((product.gst_percentage ?? 3) / 100);
  const total = taxableValue + gst;

  const mrp = total / (1 - (product.discount_percentage ?? 0) / 100);
  const youSave = mrp - total;

  return {
    metalValue,
    wastageAmount,
    makingCharges,
    stoneCharges,
    taxableValue,
    gst,
    total,
    mrp,
    youSave,
  };
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
