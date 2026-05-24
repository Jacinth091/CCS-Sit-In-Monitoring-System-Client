import { Outlet } from 'react-router';
import AdminNavbar from './Admin/AdminNavbar';
import ChatWidget from '../components/ChatWidget';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      <div className="print:hidden">
        <AdminNavbar />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      <div className="print:hidden">
        <ChatWidget />
      </div>
    </div>
  );
}
