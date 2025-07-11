import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Typography, Button } from "@material-tailwind/react"
import { FaHome, FaLock, FaSignInAlt } from "react-icons/fa"

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* 403 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Typography variant="h1" className="text-8xl md:text-9xl font-bold text-red-500 opacity-20 select-none">
            403
          </Typography>
        </motion.div>

        {/* Lock Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <FaLock className="w-12 h-12 text-red-500" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Typography variant="h2" className="mb-4 font-heading text-red-700">
            Access Forbidden
          </Typography>
          <Typography variant="lead" className="text-gray-600 mb-6">
            Sorry, you don't have permission to access this page. This area is restricted to authorized users only.
          </Typography>
          <Typography className="text-gray-500">
            If you believe this is an error, please contact the administrator or try logging in with appropriate
            credentials.
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
          <Link to="/join-us">
            <Button size="lg" variant="outlined" color="red" className="flex items-center gap-2">
              <FaSignInAlt />
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <Typography variant="small" className="text-gray-500 mb-4">
            Need help? Contact our support team:
          </Typography>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <span className="text-gray-600">Email: support@medixcare.com</span>
            <span className="text-gray-600">Phone: +1 (555) 123-4567</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Forbidden;
