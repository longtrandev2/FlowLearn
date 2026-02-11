import { useState } from 'react';
import { X, CloudUpload, FileText, CheckCircle, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: Props) {
  const [files, setFiles] = useState<any[]>([
    { name: "Giao_trinh_Triet_hoc.pdf", size: "2.5 MB", progress: 100, status: "completed" },
    { name: "Tai_lieu_tham_khao.docx", size: "1.2 MB", progress: 45, status: "uploading" },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Upload Files</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Drag & Drop Area (Figma Style) */}
        <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <CloudUpload size={28} className="text-indigo-600" />
          </div>
          <p className="text-slate-700 font-medium text-lg">
            <span className="text-indigo-600 font-bold hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-slate-400 text-sm mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        </div>

        {/* Uploading List */}
        <div className="mt-6 space-y-3 max-h-40 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100">
                <FileText size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{file.name}</span>
                  <span className="text-xs text-slate-400">{file.size}</span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${file.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Icon */}
              <button className="text-slate-400 hover:text-red-500 transition">
                {file.status === 'completed' ? <CheckCircle size={20} className="text-green-500" /> : <Trash2 size={18} />}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
            Upload
          </button>
        </div>

      </div>
    </div>
  );
}