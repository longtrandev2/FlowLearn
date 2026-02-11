import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Layers, LogOut, Bubbles, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout)
  const handleLogout = () =>{
      logout()
  }
  return (
    <aside className="h-full w-full flex flex-col bg-white border-r border-purple-100 shadow-sm relative overflow-hidden">
      <div className="h-20 flex items-center px-6 border-b border-purple-50 shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            <Bubbles size={18} fill="currentColor" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
            JellyLearn
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </div>
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
        <NavItem to="/study-folder" icon={<Layers size={20} />} label="Study" />
        <NavItem to="/setting" icon={<Cog size={20} />} label="Setting" />
      </div>

      <div className="p-4 border-t border-purple-50 shrink-0">
        <button onClick={() => handleLogout()} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-purple-100/50 text-indigo-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "transition-colors",
              isActive
                ? "text-indigo-600"
                : "text-gray-400 group-hover:text-gray-600",
            )}
          >
            {icon}
          </span>

          <span>{label}</span>

          {isActive && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full" />
          )}
        </>
      )}
    </NavLink>
  );
}
