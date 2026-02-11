import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  CloudUpload,
  FileText,
  MoreVertical,
} from "lucide-react";
import UploadModal from "@/features/library/components/UploadModal";

export default function FolderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const folderName = id === "1" ? "Triết học Mác - Lênin" : "Tài liệu học tập";

  const files = [
    {
      id: 1,
      name: "Chuong_1_Vat_Chat.pdf",
      size: "2.4 MB",
      date: "2 mins ago",
      type: "PDF",
    },
    {
      id: 2,
      name: "Cau_hoi_on_tap.docx",
      size: "1.1 MB",
      date: "1 hour ago",
      type: "DOC",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate("/library")}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition"
          >
            <ChevronLeft size={16} /> Back to Library
          </button>

          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            📂 {folderName}
          </h1>
          <p className="text-slate-500 text-sm">
            Manage document files in this folder.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-0.5"
          >
            <CloudUpload size={20} />
            Upload File
          </button>
        </div>
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    file.type === "PDF"
                      ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  <FileText size={24} />
                </div>
                <button className="text-slate-300 hover:text-slate-600">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3
                className="font-bold text-slate-700 truncate mb-1"
                title={file.name}
              >
                {file.name}
              </h3>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>

              <Link
                to={`/study/${file.id}`}
                className="absolute inset-0"
              ></Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 mb-4">
            Chưa có file nào trong thư mục này.
          </p>
        </div>
      )}

      {/* Modal Upload */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
