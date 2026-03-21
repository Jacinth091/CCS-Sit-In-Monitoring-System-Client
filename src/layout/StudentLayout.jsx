import { Outlet } from 'react-router';
import StudentNavbar from './Student/StudentNavbar';

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAD8B1]/10">
      <StudentNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
