import { useState } from 'react'
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from './Components/HomePage'
import LoginPage from './Components/LoginPage'
import SignUpPage from './Components/SignUpPage'
import ProfilePage from './Components/ProfilePage'
import Sidebar from './Components/common/Sidebar'
import RightPanel from "./Components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from 'react-redux';

import './App.css'

function App() {

  const user=useSelector((state)=>{return state.user})
  let authUser = user.isloggedin;


  return (
    <>
      <BrowserRouter>
      <div className='flex max-w-6xl mx-auto'>
			{authUser && <Sidebar />}
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/profile/:id' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        </Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
      </BrowserRouter>
    </>
  )
}

export default App
