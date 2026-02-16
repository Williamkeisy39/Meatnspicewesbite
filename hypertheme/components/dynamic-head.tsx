"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/providers/store-provider";

export function DynamicHead() {
  const { storeName, storeLogo } = useStore();

  useEffect(() => {
    document.title = storeName;

    if (storeLogo) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = storeLogo;
    }
  }, [storeName, storeLogo]);

  return null;
}
