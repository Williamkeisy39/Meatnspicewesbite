"use client";

import React, { createContext, useContext, useState } from "react";

interface CartDrawerContextType {
    isCartOpen: boolean;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextType>({
    isCartOpen: false,
    toggleCart: () => {},
    openCart: () => {},
    closeCart: () => {},
});

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartDrawerContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart }}>
            {children}
        </CartDrawerContext.Provider>
    );
}

export function useCartDrawer() {
    return useContext(CartDrawerContext);
}
