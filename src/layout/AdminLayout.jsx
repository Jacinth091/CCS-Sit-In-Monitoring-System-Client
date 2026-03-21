import { Outlet } from 'react-router';
import AdminNavbar from './Admin/AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAD8B1]/10">
      <AdminNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
