import { NextResponse } from "next/server";

import { createProduct, getProducts } from "@/lib/actions/products";

export async function GET() {
  try {
    const products = await getProducts({ skip: 0 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("[admin/products][GET]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await createProduct({
      name: body.name,
      description: body.description,
      sku: body.sku,
      price: Number(body.price),
      sales_price: body.sales_price === "" || body.sales_price === undefined ? null : Number(body.sales_price),
      stock: Number(body.stock ?? 0),
      image_url: body.image_url,
      status: body.status || "active",
      is_featured: Boolean(body.is_featured),
      is_popular: Boolean(body.is_popular),
      category_id: body.category_id || null,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[admin/products][POST]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
