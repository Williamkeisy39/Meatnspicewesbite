import { NextResponse } from "next/server";

import { createBanner, getBanners } from "@/lib/actions/banners";

export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error("[admin/banners][GET]", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const banner = await createBanner({
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      link_url: body.link_url,
      status: body.status || "active",
      placement: body.placement || "side",
      sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("[admin/banners][POST]", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
