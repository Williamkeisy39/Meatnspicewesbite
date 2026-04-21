import { NextResponse } from "next/server";

import { deleteCategory, updateCategory } from "@/lib/actions/categories";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateCategory(id, {
      name: body.name,
      is_active: body.is_active,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[admin/categories/:id][PATCH]", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/categories/:id][DELETE]", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
