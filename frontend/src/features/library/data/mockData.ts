import type { Folder, DocumentFile } from "../types";

// ─── Mock Folders (Nested 3 cấp) ───────────────────────────────
// ROOT (parentId: null)
//  ├── Triết học Mác-Lênin
//  │   ├── Chương 1: Chủ nghĩa duy vật biện chứng
//  │   │   └── (files)
//  │   ├── Chương 2: Phép biện chứng duy vật
//  │   │   └── (files)
//  │   └── (files)
//  ├── Lập trình Web (ReactJS)
//  │   ├── Module 1: Fundamentals
//  │   └── Module 2: Advanced Hooks
//  ├── Tiếng Anh TOEIC
//  └── Kỹ năng mềm

export const mockFolders: Folder[] = [
  // ───── Root Level ─────
  {
    id: "folder-1",
    parentId: null,
    name: "Triết học Mác - Lênin",
    description: "Tài liệu ôn thi cuối kỳ môn Triết học Mác-Lênin, bao gồm giáo trình và câu hỏi ôn tập.",
    coverImage: null,
    color: "ocean",
    subfolderCount: 2,
    fileCount: 3,
    createdAt: "2026-02-24T10:00:00Z",
    updatedAt: "2026-02-24T14:30:00Z",
  },
  {
    id: "folder-2",
    parentId: null,
    name: "Lập trình Web (ReactJS)",
    description: "Khóa học React từ cơ bản đến nâng cao, bao gồm hooks, state management và project thực tế.",
    coverImage: null,
    color: "indigo",
    subfolderCount: 2,
    fileCount: 1,
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-02-26T09:00:00Z",
  },
  {
    id: "folder-3",
    parentId: null,
    name: "Tiếng Anh TOEIC",
    description: "Luyện thi TOEIC 4 kỹ năng, target 750+.",
    coverImage: null,
    color: "amber",
    subfolderCount: 0,
    fileCount: 8,
    createdAt: "2026-02-19T12:00:00Z",
    updatedAt: "2026-02-19T12:00:00Z",
  },
  {
    id: "folder-4",
    parentId: null,
    name: "Kỹ năng mềm",
    description: "Tài liệu về thuyết trình, làm việc nhóm và quản lý thời gian.",
    coverImage: null,
    color: "emerald",
    subfolderCount: 0,
    fileCount: 3,
    createdAt: "2026-01-26T08:00:00Z",
    updatedAt: "2026-01-26T08:00:00Z",
  },

  // ───── Level 2: Triết học > Chương 1, 2 ─────
  {
    id: "folder-1-1",
    parentId: "folder-1",
    name: "Chương 1: Chủ nghĩa duy vật biện chứng",
    description: "Vật chất, ý thức và mối quan hệ giữa vật chất và ý thức.",
    coverImage: null,
    color: "ocean",
    subfolderCount: 1,
    fileCount: 4,
    createdAt: "2026-02-24T10:30:00Z",
    updatedAt: "2026-02-25T09:00:00Z",
  },
  {
    id: "folder-1-2",
    parentId: "folder-1",
    name: "Chương 2: Phép biện chứng duy vật",
    description: "Hai nguyên lý, ba quy luật và sáu cặp phạm trù cơ bản.",
    coverImage: null,
    color: "violet",
    subfolderCount: 0,
    fileCount: 3,
    createdAt: "2026-02-24T11:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },

  // ───── Level 2: React > Module 1, 2 ─────
  {
    id: "folder-2-1",
    parentId: "folder-2",
    name: "Module 1: Fundamentals",
    description: "JSX, Components, Props, State cơ bản.",
    coverImage: null,
    color: "indigo",
    subfolderCount: 0,
    fileCount: 5,
    createdAt: "2026-02-20T08:30:00Z",
    updatedAt: "2026-02-22T14:00:00Z",
  },
  {
    id: "folder-2-2",
    parentId: "folder-2",
    name: "Module 2: Advanced Hooks",
    description: "useReducer, useContext, useMemo, useCallback và custom hooks.",
    coverImage: null,
    color: "rose",
    subfolderCount: 0,
    fileCount: 3,
    createdAt: "2026-02-22T09:00:00Z",
    updatedAt: "2026-02-25T16:00:00Z",
  },

  // ───── Level 3: Triết > Chương 1 > Bài tập ─────
  {
    id: "folder-1-1-1",
    parentId: "folder-1-1",
    name: "Bài tập & Câu hỏi ôn tập",
    description: "Tổng hợp câu hỏi tự luận và trắc nghiệm chương 1.",
    coverImage: null,
    color: "rose",
    subfolderCount: 0,
    fileCount: 2,
    createdAt: "2026-02-25T08:00:00Z",
    updatedAt: "2026-02-25T15:00:00Z",
  },
];

// ─── Mock Documents ─────────────────────────────────────────────

export const mockDocuments: DocumentFile[] = [
  // ── Files in Triết học (root) ──
  {
    id: "doc-1",
    folderId: "folder-1",
    name: "Giao_trinh_Triet_hoc_ML.pdf",
    type: "PDF",
    size: "12.4 MB",
    status: "ready",
    uploadedAt: "2026-02-24T10:05:00Z",
    updatedAt: "2026-02-24T10:05:00Z",
  },
  {
    id: "doc-2",
    folderId: "folder-1",
    name: "De_cuong_on_tap.docx",
    type: "DOCX",
    size: "1.8 MB",
    status: "ready",
    uploadedAt: "2026-02-24T11:00:00Z",
    updatedAt: "2026-02-24T11:00:00Z",
  },
  {
    id: "doc-3",
    folderId: "folder-1",
    name: "Slide_tong_hop.pptx",
    type: "PPTX",
    size: "5.2 MB",
    status: "processing",
    uploadedAt: "2026-02-24T14:30:00Z",
    updatedAt: "2026-02-24T14:30:00Z",
  },

  // ── Files in Chương 1 ──
  {
    id: "doc-4",
    folderId: "folder-1-1",
    name: "Chuong_1_Vat_Chat.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "ready",
    uploadedAt: "2026-02-24T10:35:00Z",
    updatedAt: "2026-02-24T10:35:00Z",
  },
  {
    id: "doc-5",
    folderId: "folder-1-1",
    name: "Chuong_1_Y_Thuc.pdf",
    type: "PDF",
    size: "1.9 MB",
    status: "ready",
    uploadedAt: "2026-02-24T10:40:00Z",
    updatedAt: "2026-02-24T10:40:00Z",
  },
  {
    id: "doc-6",
    folderId: "folder-1-1",
    name: "Ghi_chu_bai_giang.docx",
    type: "DOCX",
    size: "0.8 MB",
    status: "ready",
    uploadedAt: "2026-02-25T08:00:00Z",
    updatedAt: "2026-02-25T08:00:00Z",
  },
  {
    id: "doc-7",
    folderId: "folder-1-1",
    name: "Mind_map_chuong_1.pdf",
    type: "PDF",
    size: "3.1 MB",
    status: "uploading",
    uploadedAt: "2026-02-25T09:00:00Z",
    updatedAt: "2026-02-25T09:00:00Z",
  },

  // ── Files in Chương 2 ──
  {
    id: "doc-8",
    folderId: "folder-1-2",
    name: "Bien_chung_duy_vat.pdf",
    type: "PDF",
    size: "4.5 MB",
    status: "ready",
    uploadedAt: "2026-02-24T11:10:00Z",
    updatedAt: "2026-02-24T11:10:00Z",
  },
  {
    id: "doc-9",
    folderId: "folder-1-2",
    name: "6_cap_pham_tru.docx",
    type: "DOCX",
    size: "2.1 MB",
    status: "ready",
    uploadedAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "doc-10",
    folderId: "folder-1-2",
    name: "Bai_tap_chuong_2.pdf",
    type: "PDF",
    size: "1.3 MB",
    status: "ready",
    uploadedAt: "2026-02-25T10:30:00Z",
    updatedAt: "2026-02-25T10:30:00Z",
  },

  // ── Files in Bài tập (Level 3) ──
  {
    id: "doc-11",
    folderId: "folder-1-1-1",
    name: "Trac_nghiem_chuong_1.pdf",
    type: "PDF",
    size: "0.6 MB",
    status: "ready",
    uploadedAt: "2026-02-25T08:10:00Z",
    updatedAt: "2026-02-25T08:10:00Z",
  },
  {
    id: "doc-12",
    folderId: "folder-1-1-1",
    name: "Tu_luan_chuong_1.docx",
    type: "DOCX",
    size: "0.4 MB",
    status: "ready",
    uploadedAt: "2026-02-25T15:00:00Z",
    updatedAt: "2026-02-25T15:00:00Z",
  },

  // ── Files in React Module 1 ──
  {
    id: "doc-13",
    folderId: "folder-2-1",
    name: "React_JSX_Basics.pdf",
    type: "PDF",
    size: "3.2 MB",
    status: "ready",
    uploadedAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-20T09:00:00Z",
  },
  {
    id: "doc-14",
    folderId: "folder-2-1",
    name: "Component_Props_State.pdf",
    type: "PDF",
    size: "2.8 MB",
    status: "ready",
    uploadedAt: "2026-02-20T09:30:00Z",
    updatedAt: "2026-02-20T09:30:00Z",
  },
  {
    id: "doc-15",
    folderId: "folder-2-1",
    name: "Bai_tap_module_1.docx",
    type: "DOCX",
    size: "1.5 MB",
    status: "ready",
    uploadedAt: "2026-02-22T14:00:00Z",
    updatedAt: "2026-02-22T14:00:00Z",
  },
  {
    id: "doc-16",
    folderId: "folder-2-1",
    name: "Event_Handling.pdf",
    type: "PDF",
    size: "2.0 MB",
    status: "ready",
    uploadedAt: "2026-02-21T10:00:00Z",
    updatedAt: "2026-02-21T10:00:00Z",
  },
  {
    id: "doc-17",
    folderId: "folder-2-1",
    name: "Conditional_Rendering.pdf",
    type: "PDF",
    size: "1.7 MB",
    status: "processing",
    uploadedAt: "2026-02-22T11:00:00Z",
    updatedAt: "2026-02-22T11:00:00Z",
  },

  // ── Files in React Module 2 ──
  {
    id: "doc-18",
    folderId: "folder-2-2",
    name: "useReducer_useContext.pdf",
    type: "PDF",
    size: "4.1 MB",
    status: "ready",
    uploadedAt: "2026-02-22T09:30:00Z",
    updatedAt: "2026-02-22T09:30:00Z",
  },
  {
    id: "doc-19",
    folderId: "folder-2-2",
    name: "Custom_Hooks_Guide.pdf",
    type: "PDF",
    size: "3.5 MB",
    status: "ready",
    uploadedAt: "2026-02-23T10:00:00Z",
    updatedAt: "2026-02-23T10:00:00Z",
  },
  {
    id: "doc-20",
    folderId: "folder-2-2",
    name: "Performance_Optimization.docx",
    type: "DOCX",
    size: "2.3 MB",
    status: "ready",
    uploadedAt: "2026-02-25T16:00:00Z",
    updatedAt: "2026-02-25T16:00:00Z",
  },

  // ── Files in React root ──
  {
    id: "doc-21",
    folderId: "folder-2",
    name: "React_Roadmap_2026.pdf",
    type: "PDF",
    size: "1.1 MB",
    status: "ready",
    uploadedAt: "2026-02-26T09:00:00Z",
    updatedAt: "2026-02-26T09:00:00Z",
  },

  // ── Files in TOEIC ──
  {
    id: "doc-22",
    folderId: "folder-3",
    name: "TOEIC_Listening_Part1.pdf",
    type: "PDF",
    size: "5.6 MB",
    status: "ready",
    uploadedAt: "2026-02-19T12:10:00Z",
    updatedAt: "2026-02-19T12:10:00Z",
  },
  {
    id: "doc-23",
    folderId: "folder-3",
    name: "TOEIC_Reading_Part5.pdf",
    type: "PDF",
    size: "3.8 MB",
    status: "ready",
    uploadedAt: "2026-02-19T12:20:00Z",
    updatedAt: "2026-02-19T12:20:00Z",
  },
  {
    id: "doc-24",
    folderId: "folder-3",
    name: "600_Essential_Words.xlsx",
    type: "XLSX",
    size: "0.9 MB",
    status: "ready",
    uploadedAt: "2026-02-19T12:30:00Z",
    updatedAt: "2026-02-19T12:30:00Z",
  },

  // ── Files in Kỹ năng mềm ──
  {
    id: "doc-25",
    folderId: "folder-4",
    name: "Ky_nang_thuyet_trinh.pdf",
    type: "PDF",
    size: "2.0 MB",
    status: "ready",
    uploadedAt: "2026-01-26T08:10:00Z",
    updatedAt: "2026-01-26T08:10:00Z",
  },
  {
    id: "doc-26",
    folderId: "folder-4",
    name: "Lam_viec_nhom.docx",
    type: "DOCX",
    size: "1.4 MB",
    status: "ready",
    uploadedAt: "2026-01-26T08:20:00Z",
    updatedAt: "2026-01-26T08:20:00Z",
  },
  {
    id: "doc-27",
    folderId: "folder-4",
    name: "Quan_ly_thoi_gian.txt",
    type: "TXT",
    size: "0.2 MB",
    status: "ready",
    uploadedAt: "2026-01-26T08:30:00Z",
    updatedAt: "2026-01-26T08:30:00Z",
  },
];

// ─── Helper Functions ───────────────────────────────────────────

/** Lấy subfolders trực tiếp của một folder (hoặc root nếu parentId = null) */
export function getSubfolders(parentId: string | null): Folder[] {
  return mockFolders.filter((f) => f.parentId === parentId);
}

/** Lấy documents trực tiếp trong một folder */
export function getDocumentsByFolder(folderId: string): DocumentFile[] {
  return mockDocuments.filter((d) => d.folderId === folderId);
}

/** Tìm folder theo id */
export function getFolderById(id: string): Folder | undefined {
  return mockFolders.find((f) => f.id === id);
}

/** Xây dựng breadcrumb path từ một folder đến root */
export function buildBreadcrumb(
  folderId: string | null
): { id: string | null; name: string }[] {
  const path: { id: string | null; name: string }[] = [
    { id: null, name: "My Library" },
  ];

  let currentId = folderId;
  const segments: { id: string; name: string }[] = [];

  while (currentId) {
    const folder = getFolderById(currentId);
    if (!folder) break;
    segments.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return [...path, ...segments];
}
