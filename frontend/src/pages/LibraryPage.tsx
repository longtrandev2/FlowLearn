import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import FolderBreadcrumb from "@/features/library/components/FolderBreadcrumb";
import FolderActions from "@/features/library/components/FolderActions";
import FolderCard from "@/features/library/components/FolderCardNew";
import FileCard from "@/features/library/components/FileCard";
import CreateFolderModal from "@/features/library/components/CreateFolderModal";
import UploadModal from "@/features/library/components/UploadModal";
import {
  getSubfolders,
  getDocumentsByFolder,
  buildBreadcrumb,
  getFolderById,
} from "@/features/library/data/mockData";

export default function LibraryPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  // ── State ──
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // ── Derived data ──
  const currentFolderId = folderId ?? null;
  const isRoot = currentFolderId === null;
  const currentFolder = currentFolderId
    ? getFolderById(currentFolderId)
    : null;
  const breadcrumbItems = buildBreadcrumb(currentFolderId);

  const subfolders = useMemo(
    () => getSubfolders(currentFolderId),
    [currentFolderId]
  );

  const documents = useMemo(
    () => (currentFolderId ? getDocumentsByFolder(currentFolderId) : []),
    [currentFolderId]
  );

  // ── Search filter ──
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return subfolders;
    const q = searchQuery.toLowerCase();
    return subfolders.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [subfolders, searchQuery]);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((d) => d.name.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  const hasContent = filteredFolders.length > 0 || filteredDocuments.length > 0;
  const hasAnyData = subfolders.length > 0 || documents.length > 0;

  // ── Navigation ──
  function handleNavigateFolder(id: string | null) {
    if (id === null) {
      navigate("/library");
    } else {
      navigate(`/library/${id}`);
    }
  }

  function handleFolderClick(id: string) {
    navigate(`/library/${id}`);
  }

  function handleFileClick(fileId: string) {
    navigate(`/study/${fileId}`);
  }

  function handleStudyFolder() {
    if (currentFolderId) {
      navigate(`/study?scope=folder&folderId=${currentFolderId}`);
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header: Title + Description ── */}
      <div className="shrink-0 mb-1">
        {isRoot ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              My Library 📂
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your datasets and learning materials
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentFolder?.name ?? "Folder"}
            </h1>
            {currentFolder?.description && (
              <p className="text-sm text-slate-500 mt-1 max-w-2xl line-clamp-1">
                {currentFolder.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Breadcrumb + Actions ── */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 mt-3">
        <FolderBreadcrumb
          items={breadcrumbItems}
          onNavigate={handleNavigateFolder}
        />
        <FolderActions
          folderName={currentFolder?.name ?? "My Library"}
          isRoot={isRoot}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUpload={() => setIsUploadOpen(true)}
          onStudyFolder={handleStudyFolder}
          onCreateFolder={() => setIsCreateOpen(true)}
        />
      </div>

      {/* ── Grid Content ── */}
      <div className="flex-1 overflow-y-auto pr-1">
        {hasContent ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Subfolders first */}
            {filteredFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onClick={() => handleFolderClick(folder.id)}
              />
            ))}

            {/* Then files */}
            {filteredDocuments.map((doc) => (
              <FileCard
                key={doc.id}
                file={doc}
                onClick={() => handleFileClick(doc.id)}
              />
            ))}

            {/* Create New Folder card — luôn hiện cuối */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-ocean-400 hover:bg-ocean-50/50 transition-all duration-300 min-h-50"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-3 transition-colors shadow-sm">
                <Plus
                  size={24}
                  className="text-slate-400 group-hover:text-ocean-600 transition-colors"
                />
              </div>
              <span className="text-sm font-medium text-slate-500 group-hover:text-ocean-600 transition-colors">
                Create New Folder
              </span>
            </button>
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-ocean-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">
                {hasAnyData ? "🔍" : "📁"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {hasAnyData
                ? "No results found"
                : isRoot
                  ? "Your library is empty"
                  : "This folder is empty"}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              {hasAnyData
                ? `No folders or files match "${searchQuery}"`
                : isRoot
                  ? "Create your first folder to start organizing your learning materials!"
                  : "Upload files or create subfolders to get started."}
            </p>
            {!hasAnyData && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-6 py-3 bg-ocean-600 text-white rounded-xl font-semibold hover:bg-ocean-700 shadow-lg shadow-ocean-200 transition-all hover:-translate-y-0.5"
              >
                + Create Folder
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <CreateFolderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
