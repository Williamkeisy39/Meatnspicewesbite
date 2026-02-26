"use server";

import { duka } from "@/lib/duka";
import type { BannerGetParams } from "@valebytes/topduka-node";

export async function getBanners(params?: BannerGetParams) {
  return await duka.banners.list(params);
}
