"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStoreConfig, getStoreInfo } from "@/lib/actions/store";
import type { StoreConfig, StoreInfo } from "@valebytes/topduka-node";

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
    const { data: config, isLoading: configLoading } = useQuery({
        queryKey: ["store-config"],
        queryFn: () => getStoreConfig(),
        staleTime: 1000 * 60 * 10,
    });

    const { data: store, isLoading: storeLoading } = useQuery({
        queryKey: ["store-info"],
        queryFn: () => getStoreInfo(),
        staleTime: 1000 * 60 * 10,
    });

    const isLoading = configLoading || storeLoading;
    const currency = config?.currency_code?.toUpperCase() || "USD";
    const currencyCode = config?.currency_code?.toLowerCase() || "";
    const symbol = currencySymbols[currencyCode] || config?.currency_code?.toUpperCase() || "$";

    const formatPrice = (amount: number) => `${symbol}${amount.toFixed(2)}`;

    const storeName = store?.name || "Megastore";
    const storeLogo = store?.logo || "";
    const storeEmail = store?.email || "";
    const storePhone = store?.phone || "";
    const storeAddress = store?.address || "";

    return (
        <StoreContext.Provider value={{
            config: config ?? null,
            store: store ?? null,
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
