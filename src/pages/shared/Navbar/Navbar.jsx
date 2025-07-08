import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Navbar as MTNavbar,
  Typography,
  Button,
  IconButton,
  Collapse,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react"
import { Bars3Icon, XMarkIcon, Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline"
import { FaCalendarAlt, FaUsers } from "react-icons/fa"
import MedixCampLogo from "../MedixCampLogo/MedixCampLogo"
import useAuth from "../../../hooks/useAuth"


const Navbar = () => {
  const [openNav, setOpenNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false))
  }, [])

  const handleLogout = async () => {
    try {
      await logOut()
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    { name: "Home", path: "/", icon: null },
    { name: "Available Camps", path: "/available-camps", icon: FaCalendarAlt },
  ]

  const navList = (
    <ul className="flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8">
      {navItems.map((item) => (
        <Typography key={item.name} as="li" variant="small" className="p-1 font-medium">
          <Link
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50 ${
              location.pathname === item.path
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.name}
          </Link>
        </Typography>
      ))}
    </ul>
  )

  const profileMenu = (
    <Menu>
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 hover:bg-blue-50 transition-colors"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt={user?.displayName || "User"}
            className="border-2 border-blue-500 p-0.5"
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=0ea5e9&color=fff`
            }
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-2 shadow-xl border-0">
        {/* Username - Not clickable */}
        <div className="px-3 py-2 border-b border-gray-200 mb-2">
          <Typography variant="small" className="font-semibold text-gray-800">
            {user?.displayName || "User"}
          </Typography>
        </div>

        {/* Dashboard */}
        <MenuItem
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 rounded-lg hover:bg-blue-50 focus:bg-blue-50 p-3"
        >
          <Cog6ToothIcon className="h-5 w-5 text-blue-600" strokeWidth={2} />
          <Typography variant="small" className="font-semibold text-gray-800">
            Dashboard
          </Typography>
        </MenuItem>

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg hover:bg-red-50 focus:bg-red-50 p-3"
        >
          <PowerIcon className="h-5 w-5 text-red-500" strokeWidth={2} />
          <Typography variant="small" className="font-semibold text-red-500">
            Logout
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  )

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <MTNavbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-3 lg:px-8 lg:py-4 bg-transparent shadow-none border-none">
        <div className="flex items-center justify-between text-blue-gray-900">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <MedixCampLogo className="h-10 w-10 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div>
              <Typography className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Medix Care
              </Typography>
              <Typography variant="small" className="text-gray-500 text-xs">
                Healthcare for All
              </Typography>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            <div className="mr-4 hidden lg:block">{navList}</div>

            {user ? (
              profileMenu
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/join-us">
                  <Button
                    variant="text"
                    size="sm"
                    className="hidden lg:inline-block text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="hidden lg:inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaUsers className="mr-2 h-4 w-4" />
                    Join Us
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-blue-50 focus:bg-blue-50 active:bg-blue-50 lg:hidden rounded-lg"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              )}
            </IconButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {openNav && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden"
            >
              <Collapse open={openNav}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-4 p-4">
                  {navList}
                  {!user && (
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                      <Link to="/join-us" className="w-full">
                        <Button
                          variant="outlined"
                          size="sm"
                          fullWidth
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register" className="w-full">
                        <Button fullWidth size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
                          <FaUsers className="mr-2 h-4 w-4" />
                          Join Us
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Collapse>
            </motion.div>
          )}
        </AnimatePresence>
      </MTNavbar>
    </motion.div>
  )
}

export default Navbar;
