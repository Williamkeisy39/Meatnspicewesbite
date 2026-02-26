"use server";

import { duka } from "@/lib/duka";
import type { InitializePaymentParams, VerifyPaymentParams } from "@valebytes/topduka-node";

export async function getPaymentConfig() {
  return await duka.payments.getConfig();
}

export async function initializePayment(params: InitializePaymentParams) {
  return await duka.payments.initialize(params);
}

export async function verifyPayment(params: VerifyPaymentParams) {
  return await duka.payments.verify(params);
}
