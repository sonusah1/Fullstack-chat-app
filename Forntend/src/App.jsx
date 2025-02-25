import { Navigate, Route, Router, Routes } from "react-router-dom"
import Navbar from "./component/Navbar"
import HomePage from "./pages/HomePage"
import LoginingPage from "./pages/LoginingPage"
import SigningUpPage from "./pages/SigningUpPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import {Toaster} from 'react-hot-toast'
import {useThemeStore} from "./store/useThemeStore"

function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUser} = useAuthStore();
  const {theme} =useThemeStore();

  console.log(onlineUser);
  

  useEffect(() =>{
    checkAuth();
  },[checkAuth]);

  console.log({authUser});
  
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  

  return (
    <div data-theme={theme}>
     <Navbar/>

     <Routes>
        <Route path="/" element={authUser? <HomePage/> : <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser?<LoginingPage/>: <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser?<SigningUpPage/> : <Navigate to="/"/>} />
        <Route path="/setting" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser?<ProfilePage/>: <Navigate to="/login"/>} />
     </Routes>

     <Toaster />
    </div>
  )
}

export default App
