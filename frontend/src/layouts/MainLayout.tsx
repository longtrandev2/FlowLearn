import { Outlet } from 'react-router-dom';
import {Sidebar} from './Sidebar'; // Nhớ import đúng đường dẫn
import {Header} from './Header';   // Nhớ import đúng đường dẫn

export const MainLayout = () => {
  return (
    <div className='flex h-screen bg-[#F8F7FA]'>
      <aside className='w-64 shrink-0 hidden md:block h-full'>
        <Sidebar />
      </aside>
      <div className='flex-1 flex flex-col h-full overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-y-auto p-6 scroll-smooth'>
           <Outlet />
        </main>
        
      </div>
    </div>
  )
}