import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-[var(--color-primary)] text-white hover:bg-[#c39263]",
            secondary: "bg-[var(--color-secondary)] text-white hover:bg-[#d08467]",
            outline: "border border-[var(--color-input)] bg-transparent hover:bg-[var(--color-muted)] text-[var(--foreground)]",
            ghost: "hover:bg-[var(--color-muted)] text-[var(--foreground)]",
        };

        const sizes = {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
