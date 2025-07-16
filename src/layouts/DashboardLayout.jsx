import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  IconButton,
  Drawer
} from "@material-tailwind/react"
import {
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
import useAxios from "../hooks/useAxios"
import { useQuery } from "@tanstack/react-query"
import MedixCampLogo from "../pages/shared/MedixCampLogo/MedixCampLogo"
import Loading from "../components/Loading"

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logOut } = useAuth()
  const { userRole, isLoading } = useUserRole()
  const axiosSecure = useAxios()
  const navigate = useNavigate()

  const toggleMobile = () => setMobileOpen(!mobileOpen)

  const isOrganizer = userRole === "organizer"
  const isParticipant = userRole === "participant" || userRole === "user"

  const {
    data: registrations = [],
    isLoading: regLoading
  } = useQuery({
    queryKey: ["sidebar-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations?email=${user.email}`)
      return res.data
    },
    enabled: !!user?.email && isParticipant
  })

  if (isLoading || regLoading) {
    return <Loading message="Loading dashboard..." />
  }

  const hasRegistered = registrations.length > 0

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
        <Link to="/">
          <ListItem>
            <ListItemPrefix>
              <GlobeAltIcon className="h-5 w-5" />
            </ListItemPrefix>
            Homepage
          </ListItem>
        </Link>

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

        {isParticipant && hasRegistered && (
          <>
            <Link to="/dashboard/participant-profile">
              <ListItem>
                <ListItemPrefix>
                  <UsersIcon className="h-5 w-5" />
                </ListItemPrefix>
                Profile
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

        {isParticipant && (
          <Link to="/available-camps">
            <ListItem>
              <ListItemPrefix>
                <CalendarDaysIcon className="h-5 w-5" />
              </ListItemPrefix>
              Join A Camp
            </ListItem>
          </Link>
        )}

        <ListItem
          onClick={async () => {
            try {
              await logOut()
              navigate("/")
            } catch (err) {
              console.error("Logout failed:", err)
            }
          }}
        >
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
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-2 left-2 z-50">
        <IconButton variant="text" onClick={toggleMobile}>
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
      </div>

      {/* Mobile Sidebar Drawer (Scrollable) */}
      <Drawer open={mobileOpen} onClose={toggleMobile} className="p-0">
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <MedixCampLogo />
          <IconButton variant="text" onClick={toggleMobile}>
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-60px)] px-4">
          <SidebarContent />
        </div>
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

export default DashboardLayout
