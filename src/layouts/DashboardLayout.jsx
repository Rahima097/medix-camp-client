import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  IconButton,
  Drawer
} from "@material-tailwind/react"
import {
  HomeIcon,
  PowerIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/solid"
import useAuth from "../hooks/useAuth"
import useUserRole from "../hooks/useUserRole"
import MedixCampLogo from "../pages/shared/MedixCampLogo/MedixCampLogo"
import Loading from "../components/Loading"

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logOut } = useAuth()
  const { userRole, isLoading } = useUserRole()

  const isOrganizer = userRole === "organizer"
  const isParticipant = userRole === "participant"

  const toggleMobile = () => setMobileOpen(!mobileOpen)

  if (isLoading) {
    return <Loading message="Loading dashboard..." />
  }

  const SidebarContent = () => (
    <div className="p-4">
      <div className="text-center mb-4">
        <MedixCampLogo />
        <Avatar
          src={
            user?.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0ea5e9&color=fff`
          }
          alt="profile"
          size="lg"
          className="h-20 w-20 mx-auto border-2 border-blue-gray-100 my-4"
        />
        <Typography variant="h6">{user?.displayName?.split(" ")[0] || "User"}</Typography>
        <Typography variant="small" color="gray">
          Role: {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
        </Typography>
      </div>
      <List>
        {/* Common Links */}
        <Link to="/dashboard">
          <ListItem>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard Home
          </ListItem>
        </Link>
        <Link to="/">
          <ListItem>
            <ListItemPrefix>
              <GlobeAltIcon className="h-5 w-5" />
            </ListItemPrefix>
            Homepage
          </ListItem>
        </Link>

        {/* Organizer Links */}
        {isOrganizer && (
          <>
            <Link to="/dashboard/organizer-profile">
              <ListItem>
                <ListItemPrefix>
                  <UsersIcon className="h-5 w-5" />
                </ListItemPrefix>
                Profile
              </ListItem>
            </Link>
            <Link to="/dashboard/add-camp">
              <ListItem>
                <ListItemPrefix>
                  <PlusCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Add A Camp
              </ListItem>
            </Link>
            <Link to="/dashboard/manage-camps">
              <ListItem>
                <ListItemPrefix>
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                </ListItemPrefix>
                Manage Camps
              </ListItem>
            </Link>
            <Link to="/dashboard/manage-registered-camps">
              <ListItem>
                <ListItemPrefix>
                  <UsersIcon className="h-5 w-5" />
                </ListItemPrefix>
                Manage Registered Camps
              </ListItem>
            </Link>
          </>
        )}

        {/* Participant Links */}
        {isParticipant && (
          <>
            <Link to="/dashboard/participant-profile">
              <ListItem>
                <ListItemPrefix>
                  <UsersIcon className="h-5 w-5" />
                </ListItemPrefix>
                Profile
              </ListItem>
            </Link>
            <Link to="/available-camps">
              <ListItem>
                <ListItemPrefix>
                  <CalendarDaysIcon className="h-5 w-5" />
                </ListItemPrefix>
                Join A Camp
              </ListItem>
            </Link>
            <Link to="/dashboard/registered-camps">
              <ListItem>
                <ListItemPrefix>
                  <CalendarDaysIcon className="h-5 w-5" />
                </ListItemPrefix>
                Registered Camps
              </ListItem>
            </Link>
            <Link to="/dashboard/payment-history">
              <ListItem>
                <ListItemPrefix>
                  <CurrencyDollarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Payment History
              </ListItem>
            </Link>
            <Link to="/dashboard/analytics">
              <ListItem>
                <ListItemPrefix>
                  <ChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Analytics
              </ListItem>
            </Link>
          </>
        )}

        {/* Logout */}
        <ListItem onClick={logOut}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-2 left-2 z-50">
        <IconButton variant="text" onClick={toggleMobile}>
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
      </div>

      <Drawer open={mobileOpen} onClose={toggleMobile} className="p-4">
        <div className="flex justify-between items-center mb-4">
          <MedixCampLogo />
          <IconButton variant="text" onClick={toggleMobile}>
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        <SidebarContent />
      </Drawer>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white shadow-lg border-r sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout;
