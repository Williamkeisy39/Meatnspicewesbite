import { NextResponse } from "next/server";

import { getBanners } from "@/lib/actions/banners";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as "active" | "inactive" | null;
    const placement = searchParams.get("placement") as "main" | "side" | null;

    const banners = await getBanners({
      status: status ?? undefined,
      placement: placement ?? undefined,
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("[banners][GET]", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
