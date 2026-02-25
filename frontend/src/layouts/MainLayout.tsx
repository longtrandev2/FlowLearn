import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50/70 overflow-hidden">
      {/* Sidebar – fixed width */}
      <aside className="w-60 shrink-0 hidden md:block h-full">
        <Sidebar />
      </aside>

      {/* Right panel: Topbar + Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};