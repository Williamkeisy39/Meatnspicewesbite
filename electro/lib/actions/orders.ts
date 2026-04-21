"use server";

import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

export async function getOrders(skip: number = 0) {
  return prisma.order.findMany({
    skip,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });
}

export async function getOrder(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });
}

export async function trackOrder(reference: string) {
  return prisma.order.findUnique({
    where: { reference },
    include: {
      items: true,
    },
  });
}
