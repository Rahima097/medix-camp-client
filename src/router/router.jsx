import { createBrowserRouter } from "react-router-dom"
import RootLayout from "../layouts/RootLayout"
import Home from "../pages/Home/Home/Home"
import AuthLayout from "../layouts/AuthLayout"
import Register from "../pages/Authentication/Register/Register"
import JoinUs from "../pages/Authentication/JoinUs/JoinUs"
import AvailableCamps from "../pages/AvailableCamps/AvailableCamps"
import CampDetails from "./../pages/CampDetails/CampDetails"
import NotFound from "./../pages/NotFound/NotFound"
import Forbidden from "./../pages/Forbidden/Forbidden"

// Dashboard Layouts and Components
import DashboardLayout from "../layouts/DashboardLayout"
import DashboardHome from "../pages/Dashboard/DashboardHome"
import OrganizerDashboard from "../pages/Organizer/OrganizerDashboard"
import OrganizerProfile from "../pages/Organizer/OrganizerProfile"
import AddCamp from "../pages/Organizer/AddCamp"
import ManageCamps from "../pages/Organizer/ManageCamps"
import ManageRegisteredCamps from "../pages/Organizer/ManageRegisteredCamps"

import ParticipantDashboard from "../pages/Participant/ParticipantDashboard"
import ParticipantProfile from "../pages/Participant/ParticipantProfile"
import RegisteredCamps from "../pages/Participant/RegisteredCamps"
import PaymentHistory from "../pages/Participant/PaymentHistory"
import Analytics from "../pages/Participant/Analytics"
import PaymentPage from "../pages/Participant/PaymentPage"

// Protected Routes
import PrivateRoute from "../routes/PrivateRoute"
import OrganizerRoute from "../routes/OrganizerRoute"
import ParticipantRoute from "../routes/ParticipantRoute"


export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "available-camps",
        element: <AvailableCamps />,
      },
      {
        path: "camp-details/:campId",
        element: <CampDetails />,
      },
    ],
  },
  // Auth Routes 
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "join-us",
        element: <JoinUs />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  // Dashboard Routes 
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Common Dashboard Home 
      {
        index: true,
        element: <DashboardHome />,
      },
      // Organizer Routes
      {
        path: "organizer-dashboard", 
        element: (
          <OrganizerRoute>
            <OrganizerDashboard />
          </OrganizerRoute>
        ),
      },
      {
        path: "organizer-profile",
        element: (
          <OrganizerRoute>
            <OrganizerProfile />
          </OrganizerRoute>
        ),
      },
      {
        path: "add-camp",
        element: (
          <OrganizerRoute>
            <AddCamp />
          </OrganizerRoute>
        ),
      },
      {
        path: "manage-camps",
        element: (
          <OrganizerRoute>
            <ManageCamps />
          </OrganizerRoute>
        ),
      },
      {
        path: "manage-registered-camps",
        element: (
          <OrganizerRoute>
            <ManageRegisteredCamps />
          </OrganizerRoute>
        ),
      },
      // Participant Routes
      {
        path: "participant-dashboard", 
        element: (
          <ParticipantRoute>
            <ParticipantDashboard />
          </ParticipantRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ParticipantRoute>
            <Analytics />
          </ParticipantRoute>
        ),
      },
      {
        path: "participant-profile",
        element: (
          <ParticipantRoute>
            <ParticipantProfile />
          </ParticipantRoute>
        ),
      },
      {
        path: "registered-camps",
        element: (
          <ParticipantRoute>
            <RegisteredCamps />
          </ParticipantRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <ParticipantRoute>
            <PaymentHistory />
          </ParticipantRoute>
        ),
      },
      {
        path: "payment/:registrationId",
        element: (
          <ParticipantRoute>
            <PaymentPage />
          </ParticipantRoute>
        ),
      },
    ],
  },
  // Error and Forbidden Pages
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
