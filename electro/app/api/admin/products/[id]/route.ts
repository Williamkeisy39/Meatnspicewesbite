import { NextResponse } from "next/server";

import { deleteProduct, getProduct, restockProduct, updateProduct } from "@/lib/actions/products";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("[admin/products/:id][GET]", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.restock_by !== undefined) {
      const restocked = await restockProduct(id, Number(body.restock_by));
      return NextResponse.json(restocked);
    }

    const updated = await updateProduct(id, {
      name: body.name,
      description: body.description,
      sku: body.sku,
      price: body.price !== undefined ? Number(body.price) : undefined,
      sales_price:
        body.sales_price === "" || body.sales_price === undefined
          ? undefined
          : body.sales_price === null
            ? null
            : Number(body.sales_price),
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      image_url: body.image_url,
      status: body.status,
      is_featured: body.is_featured,
      is_popular: body.is_popular,
      category_id: body.category_id,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[admin/products/:id][PATCH]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/products/:id][DELETE]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
