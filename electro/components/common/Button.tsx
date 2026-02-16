import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    fullWidth?: boolean;
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    fullWidth = false,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl font-extrabold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                {
                    "bg-primary text-white hover:bg-accent hover:shadow-lg focus:ring-primary/30": variant === "primary",
                    "bg-secondary text-white hover:bg-secondary-hover shadow-lg shadow-secondary/20 focus:ring-secondary/30": variant === "secondary",
                    "bg-danger text-white hover:opacity-90 focus:ring-danger/30": variant === "danger",
                    "border-2 border-border bg-transparent text-gray-700 hover:bg-gray-50 hover:border-secondary/30": variant === "outline",
                    "bg-transparent hover:bg-gray-100 text-gray-700": variant === "ghost",

                    "h-8 px-3 text-xs rounded-lg": size === "sm",
                    "h-10 px-5 text-sm": size === "md",
                    "h-12 px-8 text-sm": size === "lg",
                    "h-10 w-10 p-0": size === "icon",

                    "w-full": fullWidth,
                },
                className
            )}
            {...props}
        />
    );
}
