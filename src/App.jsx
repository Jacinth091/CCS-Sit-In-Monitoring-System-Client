import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route, Link, Outlet} from "react-router";
import Login from './pages/Login';
import Layout from './layout/Layout';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import AuthLayout from './layout/AuthLayout';
// import { BrowserRouter } from 'react-router';



function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
