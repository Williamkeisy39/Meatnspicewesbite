import { cn } from "../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "sale" | "new" | "hot";
}

export function Badge({ className, variant = "sale", ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-sm px-2 py-[2px] text-[10px] font-bold uppercase text-white shadow-sm",
                {
                    "bg-danger": variant === "sale",
                    "bg-success": variant === "new",
                    "bg-secondary text-black": variant === "hot",
                },
                className
            )}
            {...props}
        />
    );
}
