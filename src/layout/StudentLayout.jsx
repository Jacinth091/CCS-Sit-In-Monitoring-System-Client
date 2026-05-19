import { Outlet } from 'react-router';
import StudentNavbar from './Student/StudentNavbar';

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      <StudentNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
