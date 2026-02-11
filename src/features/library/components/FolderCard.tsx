
import { Folder, MoreVertical, FileText, Clock } from 'lucide-react';

type FolderProps = {
  title: string;
  count: number;
  updatedAt: string;
  color?: string;
  onClick: () => void
}

export default function FolderCard({ title, count, updatedAt, color = "bg-indigo-100 text-indigo-600",onClick }: FolderProps) {
  return (
    <div onClick={onClick} className=" group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} transition-colors`}>
          <Folder size={24} fill="currentColor" className="opacity-80" />
        </div>
        <button className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={18} />
        </button>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1">
          <FileText size={14} />
          <span>{count} files</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{updatedAt}</span>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/0 group-hover:ring-indigo-500/10 transition-all pointer-events-none"></div>
    </div>
  );
}