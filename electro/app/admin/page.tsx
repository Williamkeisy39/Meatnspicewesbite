"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Tags,
  RefreshCcw,
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  ClipboardList,
  ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import type { Category, Product } from "@/lib/catalog/types";
import type { Banner } from "@/lib/types/banner";
import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductFormState {
  name: string;
  description: string;
  sku: string;
  price: string;
  sales_price: string;
  stock: string;
  image_url: string;
  category_id: string;
  status: "active" | "draft";
  is_featured: boolean;
  is_popular: boolean;
}

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ConfirmDialogState {
  title: string;
  description: string;
  actionLabel: string;
  onConfirm: () => Promise<void> | void;
}

type AdminModule = "overview" | "products" | "categories" | "inventory" | "banners";

const ADMIN_MODULES: { id: AdminModule; label: string; description: string; icon: LucideIcon }[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Snapshot & alerts",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Products",
    description: "Add or update items",
    icon: Package,
  },
  {
    id: "categories",
    label: "Categories",
    description: "Organize catalog",
    icon: Tags,
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Restock & audit stock",
    icon: ClipboardList,
  },
  {
    id: "banners",
    label: "Banners",
    description: "Homepage hero & promos",
    icon: ImageIcon,
  },
];

const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  description: "",
  sku: "",
  price: "",
  sales_price: "",
  stock: "0",
  image_url: "",
  category_id: "",
  status: "active",
  is_featured: false,
  is_popular: false,
};

interface BannerFormState {
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  placement: "main" | "side";
  status: "active" | "inactive";
  sort_order: string;
}

const INITIAL_BANNER_FORM: BannerFormState = {
  title: "",
  description: "",
  image_url: "",
  link_url: "",
  placement: "main",
  status: "active",
  sort_order: "0",
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [productForm, setProductForm] = useState<ProductFormState>(INITIAL_PRODUCT_FORM);
  const [categoryName, setCategoryName] = useState("");
  const [restockAmount, setRestockAmount] = useState<Record<string, string>>({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bannerForm, setBannerForm] = useState<BannerFormState>(INITIAL_BANNER_FORM);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [activeModule, setActiveModule] = useState<AdminModule>("overview");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState("all");

  function showToast(message: string, type: "success" | "error" = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function hydrateBannerForm(banner: Banner) {
    setBannerForm({
      title: banner.title ?? "",
      description: banner.description ?? "",
      image_url: banner.image_url ?? "",
      link_url: banner.link_url ?? "",
      placement: (banner.placement as "main" | "side") ?? "side",
      status: (banner.status as "active" | "inactive") ?? "active",
      sort_order: String(banner.sort_order ?? 0),
    });
  }

  async function onSubmitBanner(e: React.FormEvent) {
    e.preventDefault();
    setBannerSaving(true);

    try {
      const payload = {
        ...bannerForm,
        sort_order: Number(bannerForm.sort_order || 0),
      };

      const url = editingBannerId ? `/api/admin/banners/${editingBannerId}` : "/api/admin/banners";
      const method = editingBannerId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast("Failed to save banner.", "error");
        return;
      }

      setBannerForm(INITIAL_BANNER_FORM);
      setBannerImageFile(null);
      setEditingBannerId(null);
      await fetchAll();
      showToast(editingBannerId ? "Banner updated." : "Banner created.");
    } finally {
      setBannerSaving(false);
    }
  }

  function onEditBanner(banner: Banner) {
    setEditingBannerId(banner.id);
    setActiveModule("banners");
    hydrateBannerForm(banner);
  }

  function onDeleteBanner(id: string) {
    setConfirmDialog({
      title: "Delete banner",
      description: "This banner will be removed from the homepage.",
      actionLabel: "Delete Banner",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
        if (!res.ok) {
          showToast("Failed to delete banner.", "error");
          return;
        }
        await fetchAll();
        showToast("Banner deleted.");
      },
    });
  }

  const stats = useMemo(() => {
    return {
      products: products.length,
      categories: categories.length,
      stockUnits: products.reduce((sum, item) => sum + item.stock, 0),
    };
  }, [products, categories]);

  async function fetchAll() {
    const [productsRes, categoriesRes, bannersRes] = await Promise.all([
      fetch("/api/admin/products", { cache: "no-store" }),
      fetch("/api/admin/categories", { cache: "no-store" }),
      fetch("/api/admin/banners", { cache: "no-store" }),
    ]);

    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    const bannersData = await bannersRes.json();

    if (productsRes.ok) setProducts(productsData);
    if (categoriesRes.ok) setCategories(categoriesData);
    if (bannersRes.ok) setBanners(bannersData);
  }

  const lowStockProducts = useMemo(() => {
    return products
      .filter((item) => item.stock <= 15)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = inventoryQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.sku ?? "").toLowerCase().includes(query) ||
        product.categories?.some((cat) => cat.toLowerCase().includes(query));

      const matchesCategory =
        inventoryCategory === "all" || (product.category_id ?? "") === inventoryCategory;

      return matchesQuery && matchesCategory;
    });
  }, [products, inventoryQuery, inventoryCategory]);

  const sortedBanners = useMemo(() => {
    return [...banners].sort((a, b) => {
      const placementRank = (placement?: string) => (placement === "main" ? 0 : 1);
      const rankDiff = placementRank(a.placement) - placementRank(b.placement);
      if (rankDiff !== 0) return rankDiff;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
  }, [banners]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAll();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function onSubmitProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price || 0),
        sales_price: productForm.sales_price === "" ? "" : Number(productForm.sales_price),
        stock: Number(productForm.stock || 0),
        category_id: productForm.category_id || null,
      };

      const url = editingProductId ? `/api/admin/products/${editingProductId}` : "/api/admin/products";
      const method = editingProductId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast("Failed to save product.", "error");
        return;
      }

      setProductForm(INITIAL_PRODUCT_FORM);
      setSelectedImageFile(null);
      setEditingProductId(null);
      await fetchAll();
      showToast(editingProductId ? "Product updated." : "Product created.");
    } finally {
      setLoading(false);
    }
  }

  async function onConfirmDialogAction() {
    if (!confirmDialog) return;

    await confirmDialog.onConfirm();
    setConfirmDialog(null);
  }

  async function onEditProduct(product: Product) {
    setEditingProductId(product.id);
    setActiveModule("products");
    setProductForm({
      name: product.name,
      description: product.description ?? "",
      sku: product.sku ?? "",
      price: String(product.price),
      sales_price: product.sales_price ? String(product.sales_price) : "",
      stock: String(product.stock),
      image_url: product.images?.[0] ?? "",
      category_id: product.category_id ?? "",
      status: product.status === "draft" ? "draft" : "active",
      is_featured: product.is_featured,
      is_popular: product.is_popular,
    });
  }

  async function onDeleteProduct(id: string) {
    setConfirmDialog({
      title: "Delete product",
      description: "This action will permanently remove this product from inventory.",
      actionLabel: "Delete Product",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
          showToast("Failed to delete product.", "error");
          return;
        }
        await fetchAll();
        showToast("Product deleted.");
      },
    });
  }

  async function onRestockProduct(id: string) {
    const restockBy = Number(restockAmount[id] || 0);
    if (!restockBy || restockBy < 1) {
      showToast("Enter a valid restock quantity.", "error");
      return;
    }

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restock_by: restockBy }),
    });

    if (!res.ok) {
      showToast("Failed to restock product.", "error");
      return;
    }

    setRestockAmount((prev) => ({ ...prev, [id]: "" }));
    await fetchAll();
    showToast("Stock updated.");
  }

  async function onSubmitCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const url = editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : "/api/admin/categories";
    const method = editingCategoryId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName, is_active: true }),
    });

    if (!res.ok) {
      showToast("Failed to save category.", "error");
      return;
    }

    setCategoryName("");
    setEditingCategoryId(null);
    await fetchAll();
    showToast(editingCategoryId ? "Category updated." : "Category created.");
  }

  async function onDeleteCategory(id: string) {
    setConfirmDialog({
      title: "Delete category",
      description: "This will remove the category. Existing products will become uncategorized.",
      actionLabel: "Delete Category",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
        if (!res.ok) {
          showToast("Failed to delete category.", "error");
          return;
        }
        await fetchAll();
        showToast("Category deleted.");
      },
    });
  }

  async function onUploadImage() {
    if (!selectedImageFile) {
      showToast("Pick an image to upload.", "error");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImageFile);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        showToast("Image upload failed.", "error");
        return;
      }

      const data = await res.json();
      setProductForm((prev) => ({ ...prev, image_url: data.image_url }));
      setSelectedImageFile(null);
      showToast("Image uploaded.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function onUploadBannerImage() {
    if (!bannerImageFile) {
      showToast("Pick an image to upload.", "error");
      return;
    }

    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", bannerImageFile);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        showToast("Image upload failed.", "error");
        return;
      }

      const data = await res.json();
      setBannerForm((prev) => ({ ...prev, image_url: data.image_url }));
      setBannerImageFile(null);
      showToast("Image uploaded.");
    } finally {
      setBannerUploading(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const renderOverviewModule = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="flex items-center gap-2"><Package size={18} /> {stats.products}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Categories</CardDescription>
            <CardTitle className="flex items-center gap-2"><Tags size={18} /> {stats.categories}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Stock Units</CardDescription>
            <CardTitle>{stats.stockUnits}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily operations</CardTitle>
          <CardDescription>Quick pointers to keep WhatsApp orders flowing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-sm font-semibold text-gray-900">Add or update SKUs</p>
              <p className="text-xs text-gray-500">Keep pricing, units, and promo images fresh under the Products module.</p>
            </div>
            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-sm font-semibold text-gray-900">Align WhatsApp menu</p>
              <p className="text-xs text-gray-500">Inventory updates flow straight to the storefront WhatsApp cart.</p>
            </div>
            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-sm font-semibold text-gray-900">Organize categories</p>
              <p className="text-xs text-gray-500">Rename or hide categories to match promotions.</p>
            </div>
            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-sm font-semibold text-gray-900">Monitor fulfilment</p>
              <p className="text-xs text-gray-500">Inventory module highlights low stock for Matangi dispatch.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low stock alerts</CardTitle>
          <CardDescription>Restock these items before the next delivery window.</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length ? (
            <div className="space-y-3">
              {lowStockProducts.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.categories?.[0] ?? "Uncategorized"}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", item.stock <= 5 ? "border-danger text-danger" : "border-warning text-warning")}>{item.stock} in stock</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">All products have comfortable stock levels right now.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderProductsModule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingProductId ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmitProduct}>
            <div className="md:col-span-2">
              <Label>Product Name</Label>
              <Input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label>SKU (auto)</Label>
              <Input
                value={productForm.sku || ""}
                readOnly
                placeholder="Generated on save"
                className="bg-gray-50"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                {productForm.sku ? "Existing SKU for this product." : "Leave blank—SKU will be generated when you save."}
              </p>
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="h-10 w-full rounded-md border border-border px-3 text-sm"
                value={productForm.category_id}
                onChange={(e) => setProductForm((p) => ({ ...p, category_id: e.target.value }))}
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} required />
            </div>
            <div>
              <Label>Sale Price</Label>
              <Input type="number" step="0.01" value={productForm.sales_price} onChange={(e) => setProductForm((p) => ({ ...p, sales_price: e.target.value }))} />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} required />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={productForm.image_url}
                onChange={(e) => setProductForm((p) => ({ ...p, image_url: e.target.value }))}
              />
            </div>
            <div>
              <Label>Upload Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImageFile(e.target.files?.[0] ?? null)}
                />
                <Button type="button" variant="outline" onClick={onUploadImage} disabled={uploadingImage}>
                  {uploadingImage ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="h-10 w-full rounded-md border border-border px-3 text-sm"
                value={productForm.status}
                onChange={(e) => setProductForm((p) => ({ ...p, status: e.target.value as "active" | "draft" }))}
              >
                <option value="active">active</option>
                <option value="draft">draft</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            {productForm.image_url && (
              <div className="md:col-span-2">
                <Label>Image Preview</Label>
                <div className="relative mt-2 h-40 w-40 overflow-hidden rounded-md border border-border">
                  <Image
                    src={productForm.image_url}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
            )}
            <div className="md:col-span-2 flex items-center gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={productForm.is_featured} onChange={(e) => setProductForm((p) => ({ ...p, is_featured: e.target.checked }))} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={productForm.is_popular} onChange={(e) => setProductForm((p) => ({ ...p, is_popular: e.target.checked }))} />
                Popular
              </label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}><Plus size={16} /> {editingProductId ? "Update Product" : "Create Product"}</Button>
              {editingProductId && (
                <Button type="button" variant="outline" onClick={() => { setEditingProductId(null); setProductForm(INITIAL_PRODUCT_FORM); }}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderCategoriesModule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingCategoryId ? "Edit Category" : "Add Category"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitCategory} className="space-y-3">
            <div>
              <Label>Category Name</Label>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingCategoryId ? "Update" : "Create"}</Button>
              {editingCategoryId && (
                <Button type="button" variant="outline" onClick={() => { setEditingCategoryId(null); setCategoryName(""); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
          <div className="mt-6 space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{cat.name}</span>
                  {cat.is_active ? <Badge variant="success">active</Badge> : <Badge variant="outline">inactive</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setEditingCategoryId(cat.id); setCategoryName(cat.name); }}>
                    <Pencil size={14} />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => onDeleteCategory(cat.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBannersModule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingBannerId ? "Edit Banner" : "Add Banner"}</CardTitle>
          <CardDescription>Control the hero (placement: main) and the two side promos (placement: side).</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmitBanner}>
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input value={bannerForm.title} onChange={(e) => setBannerForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea value={bannerForm.description} onChange={(e) => setBannerForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input value={bannerForm.link_url} onChange={(e) => setBannerForm((p) => ({ ...p, link_url: e.target.value }))} placeholder="/search" />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={bannerForm.sort_order} onChange={(e) => setBannerForm((p) => ({ ...p, sort_order: e.target.value }))} />
              <p className="text-[11px] text-gray-400 mt-1">Lower numbers appear first within each placement.</p>
            </div>
            <div>
              <Label>Placement</Label>
              <select
                className="h-10 w-full rounded-md border border-border px-3 text-sm"
                value={bannerForm.placement}
                onChange={(e) => setBannerForm((p) => ({ ...p, placement: e.target.value as "main" | "side" }))}
              >
                <option value="main">Main hero</option>
                <option value="side">Sidebar promo</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="h-10 w-full rounded-md border border-border px-3 text-sm"
                value={bannerForm.status}
                onChange={(e) => setBannerForm((p) => ({ ...p, status: e.target.value as "active" | "inactive" }))}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Image URL</Label>
              <Input value={bannerForm.image_url} onChange={(e) => setBannerForm((p) => ({ ...p, image_url: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Upload Image</Label>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Input type="file" accept="image/*" onChange={(e) => setBannerImageFile(e.target.files?.[0] ?? null)} />
                <Button type="button" variant="outline" onClick={onUploadBannerImage} disabled={bannerUploading}>
                  {bannerUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
            {bannerForm.image_url && (
              <div className="md:col-span-2">
                <Label>Preview</Label>
                <div className="relative mt-2 h-48 w-full overflow-hidden rounded-xl border border-border">
                  <Image src={bannerForm.image_url} alt="Banner preview" fill className="object-cover" sizes="100vw" />
                </div>
              </div>
            )}
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={bannerSaving}>
                <Plus size={16} /> {editingBannerId ? "Update Banner" : "Create Banner"}
              </Button>
              {editingBannerId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingBannerId(null);
                    setBannerForm(INITIAL_BANNER_FORM);
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing banners</CardTitle>
          <CardDescription>Adjust up to one main hero and two side promos.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedBanners.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedBanners.map((banner) => (
                <div key={banner.id} className="border border-border rounded-2xl overflow-hidden">
                  <div className="relative h-40 w-full">
                    {banner.image_url ? (
                      <Image src={banner.image_url} alt={banner.title || "Banner"} fill className="object-cover" sizes="100vw" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-50 text-xs text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wide">
                      <Badge variant={banner.placement === "main" ? "success" : "outline"}>{banner.placement}</Badge>
                      <Badge variant={banner.status === "active" ? "success" : "outline"}>{banner.status}</Badge>
                      <span className="text-gray-400">Order #{banner.sort_order ?? 0}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">{banner.title || "Untitled"}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{banner.description || "No description"}</p>
                    {banner.link_url && <p className="text-xs text-secondary break-all">Link: {banner.link_url}</p>}
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => onEditBanner(banner)}>
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => onDeleteBanner(banner.id)}>
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No banners yet. Add one above to replace the homepage hero.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderInventoryModule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Restock, edit, or remove existing stock items.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <Input
              placeholder="Search by name or SKU"
              value={inventoryQuery}
              onChange={(e) => setInventoryQuery(e.target.value)}
              className="w-full md:max-w-sm"
            />
            <select
              className="h-10 rounded-md border border-border px-3 text-sm"
              value={inventoryCategory}
              onChange={(e) => setInventoryCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Restock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categories?.[0] ?? "Uncategorized"}</TableCell>
                  <TableCell>{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "active" ? "success" : "outline"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="h-8 w-20"
                        value={restockAmount[product.id] ?? ""}
                        onChange={(e) => setRestockAmount((prev) => ({ ...prev, [product.id]: e.target.value }))}
                      />
                      <Button type="button" size="sm" onClick={() => onRestockProduct(product.id)}>
                        Restock
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => onEditProduct(product)}>
                        <Pencil size={14} />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => onDeleteProduct(product.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderModuleContent = () => {
    switch (activeModule) {
      case "products":
        return renderProductsModule();
      case "categories":
        return renderCategoriesModule();
      case "inventory":
        return renderInventoryModule();
      case "banners":
        return renderBannersModule();
      default:
        return renderOverviewModule();
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[240px] rounded-md border px-3 py-2 text-sm shadow-lg ${toast.type === "success"
              ? "border-success/20 bg-success/10 text-green-800"
              : "border-danger/20 bg-danger/10 text-red-800"
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Meat & Spice Admin Panel</h1>
          <p className="text-sm text-gray-500">Manage stock, products, and categories for the storefront.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchAll}>
            <RefreshCcw size={16} /> Refresh
          </Button>
          <Button variant="ghost" onClick={onLogout}>Logout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white border border-border rounded-2xl p-5 space-y-4 h-fit">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Modules</p>
            <p className="text-sm text-gray-400">Switch between admin tasks.</p>
          </div>
          <div className="space-y-2">
            {ADMIN_MODULES.map((module) => {
              const isActive = activeModule === module.id;
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModule(module.id)}
                  className={cn(
                    "w-full flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
                    isActive ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-gray-600 hover:border-secondary/40 hover:bg-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5 mt-0.5", isActive ? "text-secondary" : "text-gray-400")} />
                  <div>
                    <p className="text-sm font-semibold">{module.label}</p>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        <section className="space-y-6">
          {renderModuleContent()}
        </section>
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle>{confirmDialog.title}</CardTitle>
              <CardDescription>{confirmDialog.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmDialog(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={onConfirmDialogAction}>
                {confirmDialog.actionLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
