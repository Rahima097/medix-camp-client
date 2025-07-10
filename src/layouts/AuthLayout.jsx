import { Outlet } from "react-router-dom"
import NavBar from '../pages/shared/Navbar/Navbar'

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <NavBar></NavBar>
      <Outlet />
    </div>
  )
}

export default AuthLayout;