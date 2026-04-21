import { NextResponse } from "next/server";

import { deleteBanner, updateBanner } from "@/lib/actions/banners";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const banner = await updateBanner(id, {
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      link_url: body.link_url,
      status: body.status,
      placement: body.placement,
      sort_order: typeof body.sort_order === "number" ? body.sort_order : undefined,
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("[admin/banners/:id][PATCH]", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/banners/:id][DELETE]", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
