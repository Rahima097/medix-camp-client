import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Typography, Button } from "@material-tailwind/react"
import { FaHome, FaSearch } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Typography variant="h1" className="text-8xl md:text-9xl font-bold text-primary-500 opacity-20 select-none">
            404
          </Typography>
        </motion.div>

        {/* Medical Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Typography variant="h2" className="mb-4 font-heading text-primary-700">
            Page Not Found
          </Typography>
          <Typography variant="lead" className="text-gray-600 mb-6">
            Oops! The medical camp or page you're looking for seems to have moved to a different location. Don't worry,
            we'll help you find what you need.
          </Typography>
          <Typography className="text-gray-500">
            The page might have been removed, renamed, or is temporarily unavailable.
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 flex items-center gap-2">
              <FaHome />
              Back to Home
            </Button>
          </Link>
          <Link to="/available-camps">
            <Button size="lg" variant="outlined" color="blue-gray" className="flex items-center gap-2">
              <FaSearch />
              Browse Camps
            </Button>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <Typography variant="small" className="text-gray-500 mb-4">
            Looking for something specific? Try these popular pages:
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/available-camps" className="text-primary-500 hover:text-primary-700 text-sm">
              Available Camps
            </Link>
            <Link to="/join-us" className="text-primary-500 hover:text-primary-700 text-sm">
              Join Us
            </Link>
            <Link to="/register" className="text-primary-500 hover:text-primary-700 text-sm">
              Register
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound;
