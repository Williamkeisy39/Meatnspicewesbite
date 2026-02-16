import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    ({ className = "", label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full px-3 py-2 border border-[var(--color-input)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white ${error ? "border-red-500" : ""
                        } ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

TextField.displayName = "TextField";
