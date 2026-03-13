import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const AdminLayout = () => {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-700">Admin Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};