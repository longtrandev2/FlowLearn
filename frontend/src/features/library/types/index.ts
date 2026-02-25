// ─── Folder & Document Types ────────────────────────────────────
// Hỗ trợ nested folders, custom thumbnail, description.
// Dùng chung cho cả UI components và API service layer.

/** Loại file được hỗ trợ */
export type FileType = "PDF" | "DOCX" | "TXT" | "PPTX" | "XLSX";

/** Trạng thái xử lý của document */
export type DocumentStatus = "uploading" | "processing" | "ready" | "error";

/** Preset màu gradient cho folder (khi không có ảnh custom) */
export type FolderColor =
  | "ocean"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "violet";

/** Mapping màu gradient tương ứng với FolderColor */
export const FOLDER_COLOR_MAP: Record<
  FolderColor,
  { bg: string; text: string; gradient: string }
> = {
  ocean: {
    bg: "bg-ocean-50",
    text: "text-ocean-600",
    gradient: "from-ocean-400 to-ocean-600",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    gradient: "from-indigo-400 to-indigo-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    gradient: "from-emerald-400 to-emerald-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    gradient: "from-amber-400 to-amber-600",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    gradient: "from-rose-400 to-rose-600",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    gradient: "from-violet-400 to-violet-600",
  },
};

/** File icon mapping theo loại file */
export const FILE_TYPE_STYLE: Record<
  FileType,
  { bg: string; text: string; label: string }
> = {
  PDF: { bg: "bg-red-50", text: "text-red-500", label: "PDF" },
  DOCX: { bg: "bg-blue-50", text: "text-blue-500", label: "DOC" },
  TXT: { bg: "bg-slate-50", text: "text-slate-500", label: "TXT" },
  PPTX: { bg: "bg-orange-50", text: "text-orange-500", label: "PPT" },
  XLSX: { bg: "bg-green-50", text: "text-green-500", label: "XLS" },
};

// ─── Core Interfaces ────────────────────────────────────────────

export interface DocumentFile {
  id: string;
  folderId: string;
  name: string;
  type: FileType;
  /** Kích thước hiển thị, VD: "2.4 MB" */
  size: string;
  status: DocumentStatus;
  uploadedAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  /** null = root level (hiển thị ở trang My Library) */
  parentId: string | null;
  name: string;
  description: string;
  /** URL ảnh cover custom. Nếu null → dùng gradient theo `color` */
  coverImage: string | null;
  color: FolderColor;
  /** Tổng số subfolder trực tiếp */
  subfolderCount: number;
  /** Tổng số file trực tiếp (không tính file trong subfolder) */
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Breadcrumb ─────────────────────────────────────────────────

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}
