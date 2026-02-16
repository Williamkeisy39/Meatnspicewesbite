import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-[#f5f5f5] py-3 mb-6">
      <div className="container mx-auto px-8">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
              {index === items.length - 1 ? (
                <span className="text-gray-600 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#1D349A] hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
