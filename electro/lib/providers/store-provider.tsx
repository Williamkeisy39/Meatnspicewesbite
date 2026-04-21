"use client";

import { createContext, useContext } from "react";

interface StoreConfig {
    currency_code: string;
    vat_enabled?: boolean;
    vat_rate?: number;
}

interface StoreInfo {
    name: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    tiktok?: string;
}

interface StoreContextValue {
    config: StoreConfig | null;
    store: StoreInfo | null;
    isLoading: boolean;
    currency: string;
    storeName: string;
    storeLogo: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextValue>({
    config: null,
    store: null,
    isLoading: true,
    currency: "USD",
    storeName: "Store",
    storeLogo: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    formatPrice: (amount: number) => amount.toFixed(2),
});

const currencySymbols: Record<string, string> = {
    usd: "$", eur: "€", gbp: "£", jpy: "¥", cny: "¥",
    chf: "CHF", cad: "C$", mxn: "MX$", brl: "R$",
    inr: "₹", pkr: "₨", krw: "₩", thb: "฿",
    aud: "A$", nzd: "NZ$", sgd: "S$", hkd: "HK$",
    aed: "د.إ", sar: "﷼", ils: "₪", zar: "R",
    ngn: "₦", kes: "KSh", egp: "E£", php: "₱",
    myr: "RM", idr: "Rp", vnd: "₫", sek: "kr",
    nok: "kr", dkk: "kr", pln: "zł", czk: "Kč",
    huf: "Ft", ron: "lei",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const config: StoreConfig = {
        currency_code: "KES",
        vat_enabled: true,
        vat_rate: 16,
    };

    const store: StoreInfo = {
        name: "Meat & Spice Ltd",
        logo: "/meatnspiceicon.png",
        email: "meatnspiceltd@gmail.com",
        phone: "+254743467191",
        address: "Nairobi, Kenya",
        instagram: "https://instagram.com",
        twitter: undefined,
        tiktok: "https://www.tiktok.com/@meat.spice.limited",
        whatsapp: "254743467191",
    };

    const isLoading = false;
    const currency = config?.currency_code?.toUpperCase() || "USD";
    const currencyCode = config?.currency_code?.toLowerCase() || "";
    const symbol = currencySymbols[currencyCode] || config?.currency_code?.toUpperCase() || "$";

    const formatPrice = (amount: number) => `${symbol}${amount.toFixed(2)}`;

    const storeName = store.name;
    const storeLogo = store.logo;
    const storeEmail = store.email;
    const storePhone = store.phone;
    const storeAddress = store.address;

    return (
        <StoreContext.Provider value={{
            config,
            store,
            isLoading,
            currency,
            storeName,
            storeLogo,
            storeEmail,
            storePhone,
            storeAddress,
            formatPrice,
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    return useContext(StoreContext);
}
