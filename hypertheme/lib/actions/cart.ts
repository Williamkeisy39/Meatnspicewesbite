"use server";

import { duka } from "@/lib/duka";
import { cookies } from "next/headers";
import type { CartCreateParams, CartCompleteParams } from "@valebytes/topduka-node";

const CART_SESSION_KEY = "topduka_cart_session";

export async function getCart() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_SESSION_KEY)?.value;
  if (!sessionId) return null;
  
  return await duka.cart.get();
}

export async function createCart(params?: CartCreateParams) {
  const result = await duka.cart.create(params);
  const cookieStore = await cookies();
  cookieStore.set(CART_SESSION_KEY, result.session_id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return result;
}

export async function updateCartProduct(productId: string, quantity: number) {
  return await duka.cart.updateProduct({ product_id: productId, quantity });
}

export async function completeCart(params: Omit<CartCompleteParams, "session_id">) {
  const result = await duka.cart.complete(params);
  const cookieStore = await cookies();
  cookieStore.delete(CART_SESSION_KEY);
  return result;
}

export async function deleteCart() {
  await duka.cart.delete();
  const cookieStore = await cookies();
  cookieStore.delete(CART_SESSION_KEY);
}

export async function clearCart() {
  return await duka.cart.clear();
}

export async function getCartSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_SESSION_KEY)?.value || null;
}
