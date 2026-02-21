import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route, Link, Outlet} from "react-router";
import Login from './pages/Login';
import Layout from './layout/Layout';
// import { BrowserRouter } from 'react-router';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<div>Home</div>}/>
          <Route path='about' element={<div>About</div> }/>
        </Route>

        <Route path='/auth'>
          <Route path='login' element={<Login/>}/>
          <Route path='register' element ={<div>Register</div>}/>
          <Route path='forgot'/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
