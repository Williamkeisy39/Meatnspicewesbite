"use server";

import { duka } from "@/lib/duka";

export async function getStoreConfig() {
  return await duka.config.get();
}

export async function getStoreInfo() {
  return await duka.store.get();
}
