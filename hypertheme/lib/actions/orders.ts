"use server";

import { duka } from "@/lib/duka";

export async function getOrders(skip?: number) {
  return await duka.orders.list(skip);
}

export async function getOrder(orderId: string) {
  return await duka.orders.get(orderId);
}

export async function trackOrder(orderNumber: number) {
  return await duka.orders.track(orderNumber);
}
