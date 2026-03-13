import { NavLink } from "react-router-dom";

export const AdminSidebar = () => {
  return (
    <aside className="h-full w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Admin Panel</div>
      <nav className="flex-1 px-4 space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`
          }
        >
          Users Management
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};