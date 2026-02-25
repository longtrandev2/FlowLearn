import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Layers, LogOut, Droplets, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="h-full w-full flex flex-col bg-white border-r border-ocean-100 shadow-sm relative overflow-hidden">
      {/* ── Logo ── */}
      <div className="h-16 flex items-center px-6 border-b border-ocean-50 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200">
            <Droplets size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ocean-600 to-ocean-800">
            FlowLearn
          </span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        <NavItem to="/" icon={<LayoutDashboard size={19} />} label="Overview" />
        <NavItem to="/study-folder" icon={<Layers size={19} />} label="Study" />
        <NavItem to="/setting" icon={<Cog size={19} />} label="Setting" />
      </div>

      {/* ── Logout ── */}
      <div className="p-3 border-t border-ocean-50 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

// ── Nav Item ──

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
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-ocean-50 text-ocean-700 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "transition-colors duration-200",
              isActive
                ? "text-ocean-600"
                : "text-slate-400 group-hover:text-slate-600",
            )}
          >
            {icon}
          </span>

          <span>{label}</span>

          {isActive && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-ocean-500 rounded-l-full" />
          )}
        </>
      )}
    </NavLink>
  );
}
