"use client"
import { Typography, Button } from "@material-tailwind/react"
import { FaSearch, FaClipboardList } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function ParticipantDashboard() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h2" className="text-3xl font-bold mb-4">
        Participant Dashboard
      </Typography>
      <Typography className="mb-4">
        Welcome to your personalized dashboard. Here you can manage your camp registrations and view important
        information.
      </Typography>

      <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
        <Typography variant="h5" className="font-semibold text-gray-800 mb-3">
          Welcome to Your Dashboard!
        </Typography>
        <Typography className="text-gray-600 mb-4">
          Here you can manage your registered camps, view payment history, and provide feedback.
        </Typography>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            color="blue"
            onClick={() => navigate("/available-camps")}
            className="flex items-center justify-center gap-2"
          >
            <FaSearch className="h-4 w-4" /> Explore Available Camps
          </Button>
          <Button
            color="light-blue"
            onClick={() => navigate("/dashboard/registered-camps")}
            className="flex items-center justify-center gap-2"
          >
            <FaClipboardList className="h-4 w-4" /> View Registered Camps
          </Button>
        </div>
      </div>

      {/* Add analytics cards or other dashboard components here */}
    </div>
  )
}

export default ParticipantDashboard;
