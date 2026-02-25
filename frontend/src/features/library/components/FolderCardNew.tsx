import { Folder, FolderOpen, MoreVertical, FileText, Layers } from "lucide-react";
import type { Folder as FolderType } from "@/features/library/types";
import { FOLDER_COLOR_MAP } from "@/features/library/types";
import { cn } from "@/lib/utils";

interface FolderCardProps {
  folder: FolderType;
  onClick: () => void;
}

export default function FolderCard({ folder, onClick }: FolderCardProps) {
  const colorStyle = FOLDER_COLOR_MAP[folder.color];

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* ── Cover / Gradient Area ── */}
      <div className="relative h-28 overflow-hidden">
        {folder.coverImage ? (
          <img
            src={folder.coverImage}
            alt={folder.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-linear-to-br flex items-center justify-center",
              colorStyle.gradient
            )}
          >
            <FolderOpen
              size={40}
              className="text-white/40 group-hover:text-white/60 group-hover:scale-110 transition-all duration-300"
            />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />

        {/* Color dot indicator */}
        <div
          className={cn(
            "absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm",
            colorStyle.text
          )}
        >
          <Folder size={16} fill="currentColor" />
        </div>

        {/* More button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: context menu
          }}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-slate-500 hover:text-slate-800 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-ocean-700 transition-colors duration-200">
          {folder.name}
        </h3>

        {/* Description */}
        {folder.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {folder.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50">
          {folder.subfolderCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Layers size={12} className="shrink-0" />
              <span>{folder.subfolderCount}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <FileText size={12} className="shrink-0" />
            <span>
              {folder.fileCount} {folder.fileCount === 1 ? "file" : "files"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Hover ring ── */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-ocean-500/0 group-hover:ring-ocean-500/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
