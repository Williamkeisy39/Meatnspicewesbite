"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { PaymentMethod as PrismaPaymentMethod } from "@prisma/client";
import type { CartSummary, CheckoutDetails, OrderReceipt } from "@/lib/cart/types";

const CART_SESSION_KEY = "meatnspice_cart_session";
const CHECKOUT_TAX_RATE = Number(process.env.CHECKOUT_TAX_RATE || 0);

type CartRecord = NonNullable<Awaited<ReturnType<typeof getCartRecord>>>;

async function setCartSession(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_SESSION_KEY, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function getCartRecord(sessionId: string) {
  return prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

function mapCart(record: CartRecord): CartSummary {
  const items = record.items.map((item) => {
    const { product } = item;
    const price = product.salesPrice ?? product.price;
    return {
      product_id: product.id,
      product_name: product.name,
      product_image: product.imageUrl,
      sku: product.sku,
      price: product.price,
      sales_price: product.salesPrice ?? null,
      quantity: item.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.sales_price ?? item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: record.id,
    session_id: record.sessionId,
    items,
    subtotal,
    total: subtotal + subtotal * (CHECKOUT_TAX_RATE / 100),
    item_count: itemCount,
  };
}

async function ensureCart(): Promise<CartRecord> {
  const sessionId = await getCartSessionId();
  if (sessionId) {
    const existing = await getCartRecord(sessionId);
    if (existing) {
      return existing;
    }
  }

  const newSessionId = randomUUID();
  const cart = await prisma.cart.create({ data: { sessionId: newSessionId } });
  await setCartSession(newSessionId);
  const fullCart = await getCartRecord(cart.sessionId);
  if (!fullCart) {
    throw new Error("Unable to load cart session");
  }
  return fullCart;
}

export async function getCart(): Promise<CartSummary | null> {
  const sessionId = await getCartSessionId();
  if (!sessionId) return null;
  const record = await getCartRecord(sessionId);
  if (!record) {
    await deleteCart();
    return null;
  }
  return mapCart(record);
}

export async function createCart(): Promise<CartSummary> {
  const sessionId = randomUUID();
  const cart = await prisma.cart.create({ data: { sessionId } });
  await setCartSession(sessionId);
  const record = await getCartRecord(cart.sessionId);
  if (!record) {
    throw new Error("Failed to initialize cart session");
  }
  return mapCart(record);
}

export async function updateCartProduct(productId: string, quantity: number): Promise<CartSummary> {
  const cart = await ensureCart();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found");
  }

  const safeQuantity = Math.max(0, Math.min(quantity, product.stock));

  if (safeQuantity === 0) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
  } else {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: safeQuantity },
      create: { cartId: cart.id, productId, quantity: safeQuantity },
    });
  }

  const refreshed = await getCartRecord(cart.sessionId);
  if (!refreshed) {
    throw new Error("Unable to load cart after update");
  }
  return mapCart(refreshed);
}

export async function completeCart(params: CheckoutDetails): Promise<OrderReceipt> {
  const cart = await ensureCart();
  if (!cart.items.length) {
    throw new Error("Cart is empty");
  }

  const summary = mapCart(cart);
  const tax = summary.subtotal * (CHECKOUT_TAX_RATE / 100);
  const total = summary.subtotal + tax;
  const reference = `MS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(-4).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      reference,
      cartId: cart.id,
      fullName: params.full_name,
      email: params.email,
      phoneNumber: params.phone_number,
      addressLine1: params.address_line1,
      addressLine2: params.address_line2,
      city: params.city,
      stateProvince: params.state_province,
      postalCode: params.postal_code,
      country: params.country,
      paymentMethod: params.payment_method === "paystack" ? PrismaPaymentMethod.PAYSTACK : PrismaPaymentMethod.CASH,
      subtotal: summary.subtotal,
      tax,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.imageUrl,
          sku: item.product.sku,
          price: item.product.price,
          salesPrice: item.product.salesPrice,
          quantity: item.quantity,
        })),
      },
    },
    select: { id: true, reference: true, total: true },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.delete({ where: { id: cart.id } }).catch(() => undefined);
  const cookieStore = await cookies();
  cookieStore.delete(CART_SESSION_KEY);

  return {
    order_id: order.id,
    reference: order.reference,
    total: order.total,
  };
}

export async function deleteCart(): Promise<void> {
  const sessionId = await getCartSessionId();
  if (!sessionId) return;
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });
  }
  const cookieStore = await cookies();
  cookieStore.delete(CART_SESSION_KEY);
}

export async function clearCart(): Promise<void> {
  await deleteCart();
}

export async function getCartSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_SESSION_KEY)?.value || null;
}
