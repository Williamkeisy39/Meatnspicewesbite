"use server";

import { prisma } from "@/lib/prisma";
import type { Banner, BannerInput, BannerQueryParams } from "@/lib/types/banner";

const toBanner = (banner: any): Banner => ({
  id: banner.id,
  title: banner.title ?? undefined,
  description: banner.description ?? undefined,
  image_url: banner.imageUrl ?? undefined,
  link_url: banner.linkUrl ?? undefined,
  status: (banner.status as Banner["status"]) ?? "active",
  placement: (banner.placement as Banner["placement"]) ?? "side",
  sort_order: banner.sortOrder ?? 0,
  created_at: banner.createdAt?.toISOString?.() ?? banner.createdAt,
  updated_at: banner.updatedAt?.toISOString?.() ?? banner.updatedAt,
});

export async function getBanners(params?: BannerQueryParams) {
  const items = await prisma.banner.findMany({
    where: {
      status: params?.status,
      placement: params?.placement,
    },
    orderBy: [{ placement: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return items.map(toBanner);
}

export async function createBanner(input: BannerInput) {
  const created = await prisma.banner.create({
    data: {
      title: input.title,
      description: input.description,
      imageUrl: input.image_url,
      linkUrl: input.link_url,
      status: input.status ?? "active",
      placement: input.placement ?? "side",
      sortOrder: input.sort_order ?? 0,
    },
  });

  return toBanner(created);
}

export async function updateBanner(id: string, input: BannerInput) {
  const updated = await prisma.banner.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      imageUrl: input.image_url,
      linkUrl: input.link_url,
      status: input.status,
      placement: input.placement,
      sortOrder: input.sort_order,
    },
  });

  return toBanner(updated);
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
}
