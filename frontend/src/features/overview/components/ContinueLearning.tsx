import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { mockCourses } from '../data/mockData';

export default function ContinueLearning() {
  return (
    <section className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-base font-bold text-slate-800">
          Continue Learning 📚
        </h2>
        <Link
          to="/library"
          className="text-xs text-ocean-600 font-medium hover:text-ocean-700 hover:underline flex items-center gap-1 transition-colors duration-200"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Horizontal card grid – single row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 min-h-0">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
