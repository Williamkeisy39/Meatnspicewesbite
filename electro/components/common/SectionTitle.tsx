import { cn } from "../lib/utils";

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    title: string;
}

export function SectionTitle({ title, className, ...props }: SectionTitleProps) {
    return (
        <div className={cn("relative mb-6 border-b border-gray-200 mt-8", className)}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 inline-block bg-white pr-4 pb-2 relative z-10" {...props}>
                {/* Use :before for icon if needed */}
                <span className="mr-2 text-black">&#9829;</span> {/* Placeholder icon */}
                {title}
            </h2>
            <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-gray-200"></div>
        </div>
    );
}
