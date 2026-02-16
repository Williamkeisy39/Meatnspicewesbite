"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/providers/store-provider";

export default function DynamicHead() {
    const { storeName, storeLogo } = useStore();

    useEffect(() => {
        if (storeName && storeName !== "Store") {
            document.title = storeName;
        }
    }, [storeName]);

    useEffect(() => {
        if (!storeLogo) return;

        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = storeLogo;

        let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
        if (!appleLink) {
            appleLink = document.createElement("link");
            appleLink.rel = "apple-touch-icon";
            document.head.appendChild(appleLink);
        }
        appleLink.href = storeLogo;
    }, [storeLogo]);

    return null;
}
