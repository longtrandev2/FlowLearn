import { FileText } from 'lucide-react';
interface Props {
  title: string;
  type: string;
  date: string;
  progress: number;
  colorClass: string; 
}
export default function DocumentCard({ title, type, date, progress, colorClass }: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <FileText size={20} />
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
          {type}
        </span>
      </div>
      
      <h3 className="font-bold text-slate-700 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-slate-400 mb-4">{date}</p>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs font-bold text-slate-600">{progress}%</span>
      </div>
    </div>
  );
}