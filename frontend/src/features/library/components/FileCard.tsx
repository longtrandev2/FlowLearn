import {
  FileText,
  MoreVertical,
  Loader2,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import type { DocumentFile } from "@/features/library/types";
import { FILE_TYPE_STYLE } from "@/features/library/types";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: DocumentFile;
  onClick: () => void;
}

/** Format relative time từ ISO string */
function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  return `${Math.floor(diffDay / 30)}mo ago`;
}

/** Status badge nhỏ */
function StatusIndicator({ status }: { status: DocumentFile["status"] }) {
  switch (status) {
    case "uploading":
      return (
        <div className="flex items-center gap-1 text-ocean-500">
          <CloudUpload size={12} className="animate-pulse" />
          <span className="text-[10px] font-medium">Uploading</span>
        </div>
      );
    case "processing":
      return (
        <div className="flex items-center gap-1 text-amber-500">
          <Loader2 size={12} className="animate-spin" />
          <span className="text-[10px] font-medium">Processing</span>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center gap-1 text-red-500">
          <AlertCircle size={12} />
          <span className="text-[10px] font-medium">Error</span>
        </div>
      );
    default:
      return null;
  }
}

export default function FileCard({ file, onClick }: FileCardProps) {
  const typeStyle = FILE_TYPE_STYLE[file.type];
  const isClickable = file.status === "ready";

  return (
    <div
      onClick={() => isClickable && onClick()}
      className={cn(
        "group relative bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all duration-200",
        isClickable
          ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "opacity-75 cursor-not-allowed"
      )}
    >
      {/* Top row: icon + more */}
      <div className="flex justify-between items-start mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200",
            typeStyle.bg,
            typeStyle.text
          )}
        >
          <FileText size={20} />
        </div>

        {isClickable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: context menu
            }}
            className="p-1 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <MoreVertical size={14} />
          </button>
        )}
      </div>

      {/* File name */}
      <h4
        className="text-sm font-semibold text-slate-700 truncate group-hover:text-ocean-700 transition-colors duration-200"
        title={file.name}
      >
        {file.name}
      </h4>

      {/* Bottom row: meta + status */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-bold",
              typeStyle.bg,
              typeStyle.text
            )}
          >
            {typeStyle.label}
          </span>
          <span>{file.size}</span>
        </div>

        {file.status === "ready" ? (
          <span className="text-[11px] text-slate-400">
            {formatRelativeTime(file.updatedAt)}
          </span>
        ) : (
          <StatusIndicator status={file.status} />
        )}
      </div>

      {/* Upload progress bar (for uploading status) */}
      {file.status === "uploading" && (
        <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-ocean-400 rounded-full animate-pulse w-3/5" />
        </div>
      )}

      {/* Processing shimmer */}
      {file.status === "processing" && (
        <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full w-4/5" />
        </div>
      )}

      {/* Hover ring */}
      {isClickable && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-ocean-500/0 group-hover:ring-ocean-500/10 transition-all duration-300 pointer-events-none" />
      )}
    </div>
  );
}
