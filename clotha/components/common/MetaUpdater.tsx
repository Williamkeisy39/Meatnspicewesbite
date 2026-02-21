"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/providers/store-provider";

export function MetaUpdater() {
    const { storeName, storeLogo } = useStore();

    useEffect(() => {
        if (storeName && storeName !== "Store") {
            document.title = storeName;
        }
    }, [storeName]);

    useEffect(() => {
        if (!storeLogo) return;
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = storeLogo;
    }, [storeLogo]);

    return null;
}
