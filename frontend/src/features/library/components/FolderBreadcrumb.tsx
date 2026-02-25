import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "@/features/library/types";
import { cn } from "@/lib/utils";

interface FolderBreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
}

export default function FolderBreadcrumb({
  items,
  onNavigate,
}: FolderBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isRoot = index === 0;

        return (
          <div key={item.id ?? "root"} className="flex items-center gap-1">
            {/* Separator */}
            {index > 0 && (
              <ChevronRight size={14} className="text-slate-300 shrink-0" />
            )}

            {/* Breadcrumb item */}
            <button
              onClick={() => !isLast && onNavigate(item.id)}
              disabled={isLast}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200",
                isLast
                  ? "text-slate-800 font-semibold cursor-default"
                  : "text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 cursor-pointer"
              )}
            >
              {isRoot && (
                <Home
                  size={14}
                  className={cn(
                    "shrink-0",
                    isLast ? "text-slate-600" : "text-slate-400"
                  )}
                />
              )}
              <span className="max-w-40 truncate">{item.name}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
