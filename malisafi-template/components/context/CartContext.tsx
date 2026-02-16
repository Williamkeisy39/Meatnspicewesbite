"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@valebytes/topduka-node";

export type { Product };

export interface CartItem {
    id: string;
    name: string;
    price: number;
    sales_price?: number;
    image: string;
    category: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedCart = localStorage.getItem("cart_items");
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart_items", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            const cartItem: CartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                sales_price: product.sales_price,
                image: product.images?.[0] || "",
                category: product.categories?.[0] || "",
                quantity: 1,
            };
            return [...prev, cartItem];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setItems([]);

    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = items.reduce((acc, item) => acc + (item.sales_price || item.price) * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                isCartOpen,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
