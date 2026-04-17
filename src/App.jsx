import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from "react-router";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Layout from './layout/Layout';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import AuthLayout from './layout/AuthLayout';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAnnouncements from './pages/Admin/AdminAnnouncements';
import AdminStudents from './pages/Admin/AdminStudents';
import CurrentSitIn from './pages/Admin/CurrentSitIn';
import StudentLayout from './layout/StudentLayout';
import StudentDashboard from './pages/Student/StudentDashboard';
import EditProfile from './pages/Student/EditProfile';
import MyHistory from './pages/Student/MyHistory';
import StudentAnnouncements from './pages/Student/Announcements';
import Notifications from './pages/Student/Notifications';
import SitInRecord from './pages/Admin/SitInRecords';
import SitInHistory from './pages/Admin/SitInHistory';
import About from './pages/About';
import Forums from './pages/Community/Forums';
import Events from './pages/Community/Events';
import Members from './pages/Community/Members';



function App() {
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='home' element={<Navigate to="/" replace />} />
              <Route path='about' element={<About />} />
              <Route path='community/'>
                <Route path='forums' element={<Forums />} />
                <Route path='events' element={<Events />} />
                <Route path='members' element={<Members />} />
              </Route>
            </Route>
            <Route path='/auth' element={<AuthLayout />}>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<SignUp />} />
              <Route path='forgot' />
            </Route>

            <Route path='/admin' element={<AdminLayout />}>
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path='announcements' element={<AdminAnnouncements />} />
              <Route path='students' element={<AdminStudents />} />
              <Route path="sit-in">
                <Route index element={<CurrentSitIn />} />
                <Route path="records" element={<SitInRecord />} />
                <Route path="history" element={<SitInHistory />} />
              </Route>
            </Route>

            <Route path='/student' element={<StudentLayout />}>
              <Route path='dashboard' element={<StudentDashboard />} />
              <Route path='edit-profile' element={<EditProfile />} />
              <Route path='history' element={<MyHistory />} />
              <Route path='announcements' element={<StudentAnnouncements />} />
              <Route path='notifications' element={<Notifications />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider >
    </>
  )
}

export default App
