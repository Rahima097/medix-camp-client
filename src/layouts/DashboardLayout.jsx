import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react"
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  HomeIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import useAuth from "../hooks/useAuth"
import useUserRole from "../hooks/useUserRole"
import MedixCampLogo from "../pages/shared/MedixCampLogo/MedixCampLogo"
import Loading from "../components/Loading"

const DashboardLayout = () => {
  const [open, setOpen] = useState(0)
  const { user, logOut } = useAuth()
  const { userRole, isLoading } = useUserRole()

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  if (isLoading) {
    return <Loading message="Loading dashboard..." />
  }

  const isOrganizer = userRole === "organizer"
  const isParticipant = userRole === "user" // Assuming 'user' role is participant

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 sticky top-4 left-4">
        <div className="mb-2 p-4">
          <MedixCampLogo />
          <Typography variant="h5" color="blue-gray" className="mt-4">
            {user?.displayName || "Dashboard"}
          </Typography>
          <Typography color="gray" className="text-sm">
            Role: {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
          </Typography>
        </div>
        <List>
          {/* Common Dashboard Home */}
          <Link to="/dashboard">
            <ListItem>
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard Home
            </ListItem>
          </Link>

          {/* Organizer Specific Links */}
          {isOrganizer && (
            <>
              <Accordion
                open={open === 1}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === 1}>
                  <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      Organizer Panel
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    <Link to="/dashboard/organizer-profile">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Profile
                      </ListItem>
                    </Link>
                    <Link to="/dashboard/add-camp">
                      <ListItem>
                        <ListItemPrefix>
                          <PlusCircleIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Add A Camp
                      </ListItem>
                    </Link>
                    <Link to="/dashboard/manage-camps">
                      <ListItem>
                        <ListItemPrefix>
                          <ClipboardDocumentListIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Manage Camps
                      </ListItem>
                    </Link>
                    <Link to="/dashboard/manage-registered-camps">
                      <ListItem>
                        <ListItemPrefix>
                          <UsersIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Manage Registered Camps
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
            </>
          )}

          {/* Participant Specific Links */}
          {isParticipant && (
            <>
              <Accordion
                open={open === 2}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === 2}>
                  <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <ShoppingBagIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      Participant Panel
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    <Link to="/dashboard/participant-profile">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Profile
                      </ListItem>
                    </Link>
                    <Link to="/dashboard/registered-camps">
                      <ListItem>
                        <ListItemPrefix>
                          <CalendarDaysIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Registered Camps
                      </ListItem>
                    </Link>
                    <Link to="/dashboard/payment-history">
                      <ListItem>
                        <ListItemPrefix>
                          <CurrencyDollarIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Payment History
                      </ListItem>
                    </Link>
                    <Link to="/dashboard/analytics">
                      <ListItem>
                        <ListItemPrefix>
                          <ChartBarIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Analytics
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
            </>
          )}

          {/* Common Settings and Logout */}
          <hr className="my-2 border-blue-gray-50" />
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem onClick={logOut}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout;
