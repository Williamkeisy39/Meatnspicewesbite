export interface CartItemSummary {
  product_id: string;
  product_name: string;
  product_image: string | null;
  sku: string | null;
  price: number;
  sales_price: number | null;
  quantity: number;
}

export interface CartSummary {
  id: string;
  session_id: string;
  items: CartItemSummary[];
  subtotal: number;
  total: number;
  item_count: number;
}

export interface CheckoutDetails {
  full_name: string;
  email: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province?: string;
  postal_code?: string;
  country: string;
  payment_method: "cash" | "paystack";
}

export interface OrderReceipt {
  order_id: string;
  reference: string;
  total: number;
}
