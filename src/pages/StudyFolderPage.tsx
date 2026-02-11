import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import FolderCard from '@/features/library/components/FolderCard';
import CreateFolderModal from '@/features/library/components/CreateFolderModal';
import { useNavigate } from 'react-router-dom';

export const StudyFolderPage =() =>{
  const [isModalOpen, setIsModalOpen] = useState(false);

  const folders = [
    { id: 1, title: "Triết học Mác - Lênin", count: 12, date: "2 days ago", color: "bg-blue-100 text-blue-600" },
    { id: 2, title: "Lập trình Web (ReactJS)", count: 45, date: "Just now", color: "bg-indigo-100 text-indigo-600" },
    { id: 3, title: "Tiếng Anh TOEIC", count: 8, date: "1 week ago", color: "bg-orange-100 text-orange-600" },
    { id: 4, title: "Kỹ năng mềm", count: 3, date: "1 month ago", color: "bg-emerald-100 text-emerald-600" },
  ];
        const navigate = useNavigate();   
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Library 🗂️</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your datasets and learning materials</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search folders..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create New</span>
          </button>
        </div>
      </div>

      {folders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <FolderCard 
              key={folder.id}
              title={folder.title}
              count={folder.count}
              updatedAt={folder.date}
              color={folder.color}
              onClick={() => navigate(`/study-folder
                /${folder.id}`)}
            />
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all h-full min-h-[160px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-3 transition-colors shadow-sm">
                <Plus size={24} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <span className="font-medium text-slate-500 group-hover:text-indigo-600">Create New Folder</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-40 h-40 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/folder-is-empty-4064360-3363921.png" alt="Empty" className="w-32 opacity-80 mix-blend-multiply" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No folders found</h3>
            <p className="text-slate-500 max-w-sm mb-6">Create your first folder to start your learning journey!</p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-transform hover:-translate-y-1"
            >
                + Create Folder Now
            </button>
        </div>
      )}

      {/* Modal */}
      <CreateFolderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}