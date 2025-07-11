import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/Authentication/Register/Register";
import JoinUs from "../pages/Authentication/JoinUs/JoinUs";
import UserDashboard from "../pages/User/UserDashboard";
import AddCamp from "../pages/Organizer/AddCamp";
import AvailableCamps from "../pages/AvailableCamps/AvailableCamps";
import CampDetails from './../pages/CampDetails/CampDetails';

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
      { path: "available-camps",
        element: <AvailableCamps /> 
      },
      { path: "camp-details/:campId",
        element: <CampDetails />
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
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
   {
    path: "/add-camp",
    element: <AddCamp />,
  },
  
]);

