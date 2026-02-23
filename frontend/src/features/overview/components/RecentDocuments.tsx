// src/features/overview/components/RecentDocuments.tsx
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentCard from './DocumentCard';

export default function RecentDocuments() {
  const docs = [
    { id: 1, title: "Triết học Mác - Lênin", type: "PDF", date: "Just now", progress: 75, color: "bg-blue-50 text-blue-600" },
    { id: 2, title: "Tư tưởng Hồ Chí Minh", type: "DOCX", date: "2h ago", progress: 30, color: "bg-orange-50 text-orange-600" },
    { id: 3, title: "Lịch sử Đảng CSVN", type: "PDF", date: "Yesterday", progress: 10, color: "bg-red-50 text-red-600" },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Continue Learning 📚</h2>
        <Link to="/library" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <DocumentCard 
            key={doc.id}
            title={doc.title}
            type={doc.type}
            date={doc.date}
            progress={doc.progress}
            colorClass={doc.color}
          />
        ))}
      </div>
    </section>
  );
}