import { FileText, Clock } from 'lucide-react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-ocean-200 transition-all duration-200 cursor-pointer group flex flex-col justify-between min-w-0">
      {/* Top row: Icon + Type badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${course.bgColor} ${course.color}`}
        >
          <FileText size={18} />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
          {course.type}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm text-slate-700 mb-1 line-clamp-1 group-hover:text-ocean-600 transition-colors duration-200">
        {course.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
        <Clock size={12} />
        <span>{course.lastAccessed}</span>
        <span className="text-slate-300">·</span>
        <span>
          {course.currentPage}/{course.totalPages} pages
        </span>
      </div>

      {/* Progress bar – Ocean gradient */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ocean-400 to-ocean-600 transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <span className="text-[11px] font-bold text-slate-500">
          {course.progress}%
        </span>
      </div>
    </div>
  );
}
