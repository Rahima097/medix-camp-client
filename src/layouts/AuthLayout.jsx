import { Outlet } from "react-router-dom"
import Navbar from "../pages/shared/Navbar/Navbar";


const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar></Navbar>
      <Outlet />
    </div>
  )
}

export default AuthLayout;