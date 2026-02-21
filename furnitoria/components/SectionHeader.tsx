
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    linkText?: string;
    linkHref?: string;
    centered?: boolean;
}

export default function SectionHeader({ title, subtitle, linkText, linkHref, centered }: SectionHeaderProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className={cn("flex flex-col gap-4 mb-12", centered ? "items-center text-center" : "items-start")}>
            {subtitle && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-xs font-bold uppercase tracking-widest text-accent"
                >
                    {subtitle}
                </motion.span>
            )}
            <div className="flex justify-between items-end w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
                >
                    {title}
                </motion.h2>
                {linkText && linkHref && (
                    <motion.a
                        href={linkHref}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="hidden md:flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors pb-1 border-b border-transparent hover:border-accent"
                    >
                        {linkText} <ArrowRight className="w-4 h-4" />
                    </motion.a>
                )}
            </div>
        </div>
    );
}
