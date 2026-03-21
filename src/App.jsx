import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route, Link, Outlet} from "react-router";
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



function App() {
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path='about' element={<div>About</div> }/>
              <Route path='community/'>
                <Route path='forums' element={<div>Forums</div>}/>
                <Route path='events' element={<div>Events</div>}/>
                <Route path='members' element={<div>Members</div>}/>
              </Route>
            </Route>

            <Route path='/auth' element={<AuthLayout/>}>
              <Route path='login' element={<Login/>}/>
              <Route path='signup' element ={<SignUp/>}/>
              <Route path='forgot'/>
            </Route>

            <Route path='/admin' element={<AdminLayout/>}>
              <Route path='dashboard' element={<AdminDashboard/>}/>
              <Route path='announcements' element={<AdminAnnouncements/>}/>
              <Route path='students' element={<AdminStudents/>}/>
              <Route path='sit-in' element={<CurrentSitIn/>}/>
            </Route>

            <Route path='/student' element={<StudentLayout/>}>
              <Route path='dashboard' element={<StudentDashboard/>}/>
              <Route path='edit-profile' element={<EditProfile/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
