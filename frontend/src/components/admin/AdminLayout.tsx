import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-slate-100 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};