"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { duka } from "@/lib/duka";
import type { Cart } from "@valebytes/topduka-node";

interface CartContextValue {
    cart: Cart | null;
    isLoading: boolean;
    itemCount: number;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    addingProductId: string | null;
}

const CartContext = createContext<CartContextValue>({
    cart: null,
    isLoading: false,
    itemCount: 0,
    addToCart: async () => { },
    updateQuantity: async () => { },
    removeFromCart: async () => { },
    addingProductId: null,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const [addingProductId, setAddingProductId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: cart, isLoading, error } = useQuery({
        queryKey: ["cart"],
        queryFn: () => duka.cart.get(),
        enabled: ready,
        staleTime: 1000 * 60 * 2,
        retry: false,
    });

    useEffect(() => {
        const sid = duka.cart.getSessionId();
        if (sid) {
            setReady(true);
        } else {
            duka.cart.create().then(() => {
                setReady(true);
            }).catch((e) => {
                console.error("[Cart] Failed to create initial session:", e);
            });
        }
    }, []);

    useEffect(() => {
        if (error && ready) {
            const axiosError = error as any;
            if (axiosError?.response?.status === 400) {
                duka.cart.delete().then(() => {
                    return duka.cart.create();
                }).then(() => {
                    queryClient.invalidateQueries({ queryKey: ["cart"] });
                });
            }
        }
    }, [error, ready, queryClient]);

    const invalidateCart = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
    }, [queryClient]);

    const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
        setAddingProductId(productId);
        try {
            if (!duka.cart.getSessionId()) {
                await duka.cart.create();
            }
            await duka.cart.updateProduct({ product_id: productId, quantity });
            invalidateCart();
        } catch (error) {
            console.error("[Cart] Failed to add to cart:", error);
        } finally {
            setAddingProductId(null);
        }
    }, [invalidateCart]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        try {
            await duka.cart.updateProduct({ product_id: productId, quantity });
            invalidateCart();
        } catch (error) {
            console.error("[Cart] Failed to update quantity:", error);
        }
    }, [invalidateCart]);

    const removeFromCart = useCallback(async (productId: string) => {
        try {
            await duka.cart.updateProduct({ product_id: productId, quantity: 0 });
            invalidateCart();
        } catch (error) {
            console.error("[Cart] Failed to remove from cart:", error);
        }
    }, [invalidateCart]);

    const itemCount = cart?.item_count ?? cart?.items?.length ?? 0;

    return (
        <CartContext.Provider value={{ cart: cart ?? null, isLoading, itemCount, addToCart, updateQuantity, removeFromCart, addingProductId }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    return useContext(CartContext);
}
