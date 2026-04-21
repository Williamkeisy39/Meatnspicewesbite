import { NextResponse } from "next/server";

import { createCategory, getCategories } from "@/lib/actions/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[admin/categories][GET]", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await createCategory({
      name: body.name,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[admin/categories][POST]", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
