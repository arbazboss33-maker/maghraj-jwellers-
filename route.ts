import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import Razorpay from "razorpay";

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MJ${Date.now().toString().slice(-6)}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, paymentMethod, shippingAddress } = body as {
      items: { productId: string; quantity: number }[];
      paymentMethod: string;
      shippingAddress: Record<string, string>;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", items.map((i) => i.productId));

    if (productsError || !products) {
      return NextResponse.json({ error: "Could not verify products" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsPayload = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const linePrice = (product?.base_price ?? 0) * item.quantity;
      subtotal += linePrice;
      return {
        product_id: item.productId,
        product_name_snapshot: product?.name,
        quantity: item.quantity,
        price_snapshot: product?.base_price ?? 0,
        weight_snapshot: product?.net_weight_grams,
        purity_snapshot: product?.purity,
      };
    });

    const gstAmount = subtotal * 0.03;
    const total = subtotal + gstAmount;
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        status: "pending",
        payment_status: paymentMethod === "cod" ? "cod" : "pending",
        payment_method: paymentMethod,
        subtotal,
        gst_amount: gstAmount,
        total,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    await supabase.from("order_items").insert(
      orderItemsPayload.map((item) => ({ ...item, order_id: order.id }))
    );

    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      note: "Order placed by customer",
    });

    // For online payment methods, create a Razorpay order for the client to complete payment.
    let razorpayOrderId: string | null = null;
    if (paymentMethod !== "cod" && process.env.RAZORPAY_KEY_ID) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });
      const rpOrder = await razorpay.orders.create({
        amount: Math.round(total * 100),
        currency: "INR",
        receipt: orderNumber,
      });
      razorpayOrderId = rpOrder.id;
    }

    return NextResponse.json({ orderNumber, razorpayOrderId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
