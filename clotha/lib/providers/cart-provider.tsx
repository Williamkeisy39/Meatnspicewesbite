"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, createCart, updateCartProduct, deleteCart, getCartSessionId } from "@/lib/actions/cart";
import type { Cart } from "@valebytes/topduka-node";

interface CartContextValue {
    cart: Cart | null;
    isLoading: boolean;
    isOpen: boolean;
    itemCount: number;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    toggleCart: () => void;
    addingProductId: string | null;
}

const CartContext = createContext<CartContextValue>({
    cart: null,
    isLoading: false,
    isOpen: false,
    itemCount: 0,
    addToCart: async () => { },
    updateQuantity: async () => { },
    removeFromCart: async () => { },
    toggleCart: () => { },
    addingProductId: null,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [addingProductId, setAddingProductId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: cart, isLoading, error } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(),
        enabled: ready,
        staleTime: 1000 * 60 * 2,
        retry: false,
    });

    useEffect(() => {
        getCartSessionId().then((sid) => {
            if (sid) {
                setReady(true);
            } else {
                createCart().then(() => {
                    setReady(true);
                }).catch((e) => {
                    console.error("[Cart] Failed to create initial session:", e);
                });
            }
        });
    }, []);

    useEffect(() => {
        if (error && ready) {
            const axiosError = error as any;
            if (axiosError?.response?.status === 400) {
                deleteCart().then(() => {
                    return createCart();
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
            const sid = await getCartSessionId();
            if (!sid) {
                await createCart();
            }
            await updateCartProduct(productId, quantity);
            invalidateCart();
            setIsOpen(true);
        } catch (error) {
            console.error("[Cart] Failed to add to cart:", error);
        } finally {
            setAddingProductId(null);
        }
    }, [invalidateCart]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        try {
            await updateCartProduct(productId, quantity);
            invalidateCart();
        } catch (error) {
            console.error("[Cart] Failed to update quantity:", error);
        }
    }, [invalidateCart]);

    const removeFromCart = useCallback(async (productId: string) => {
        try {
            await updateCartProduct(productId, 0);
            invalidateCart();
        } catch (error) {
            console.error("[Cart] Failed to remove from cart:", error);
        }
    }, [invalidateCart]);

    const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

    const itemCount = cart?.item_count ?? cart?.items?.length ?? 0;

    return (
        <CartContext.Provider value={{
            cart: cart ?? null,
            isLoading,
            isOpen,
            itemCount,
            addToCart,
            updateQuantity,
            removeFromCart,
            toggleCart,
            addingProductId,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    return useContext(CartContext);
}
