import { useState } from 'react'

import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import DashBoardPage from './pages/DashBoardPage.jsx'

function App() {
  const {isSignedIn,isLoaded} = useUser()

  if(!isLoaded) return null;

  return (
    <>
    <Routes>
      <Route path="/" element={!isSignedIn? <HomePage/> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn? <DashBoardPage/> : <Navigate to={"/"} />} />
    </Routes>

    </>
  )
}

export default App
