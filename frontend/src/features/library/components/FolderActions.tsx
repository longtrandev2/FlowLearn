import { CloudUpload, BookOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FolderActionsProps {
  /** Tên folder hiện tại (hiển thị trong tooltip nút Study) */
  folderName: string;
  /** Có đang ở root level không (root thì ẩn nút Study & Upload) */
  isRoot: boolean;
  /** Giá trị search hiện tại */
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpload: () => void;
  onStudyFolder: () => void;
  onCreateFolder: () => void;
}

export default function FolderActions({
  folderName,
  isRoot,
  searchQuery,
  onSearchChange,
  onUpload,
  onStudyFolder,
  onCreateFolder,
}: FolderActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative w-full sm:w-56">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          type="text"
          placeholder={isRoot ? "Search folders..." : "Search..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 rounded-xl border-slate-200 focus:border-ocean-400 focus:ring-ocean-200 text-sm transition-all duration-200"
        />
      </div>

      {/* Filter button */}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 shrink-0"
      >
        <SlidersHorizontal size={16} className="text-slate-500" />
      </Button>

      {/* Upload — chỉ hiện khi đang trong folder (không phải root) */}
      {!isRoot && (
        <Button
          variant="outline"
          onClick={onUpload}
          className="h-10 rounded-xl border-slate-200 hover:bg-ocean-50 hover:border-ocean-300 hover:text-ocean-700 gap-2 text-sm font-medium transition-all duration-200 shrink-0"
        >
          <CloudUpload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      )}

      {/* Study This Folder — chỉ hiện khi đang trong folder */}
      {!isRoot && (
        <Button
          onClick={onStudyFolder}
          className="h-10 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white gap-2 text-sm font-semibold shadow-md shadow-ocean-200 transition-all duration-200 shrink-0"
          title={`Study all files in "${folderName}"`}
        >
          <BookOpen size={16} />
          <span className="hidden sm:inline">Study This Folder</span>
        </Button>
      )}

      {/* Create New Folder — luôn hiện */}
      <Button
        onClick={onCreateFolder}
        className="h-10 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white gap-2 text-sm font-semibold shadow-md shadow-ocean-200 transition-all duration-200 shrink-0"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Create New</span>
      </Button>
    </div>
  );
}
