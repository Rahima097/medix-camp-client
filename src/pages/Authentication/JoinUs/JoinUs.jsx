import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Button, Spinner } from "@material-tailwind/react"
import { FaGoogle, FaEye, FaEyeSlash, FaSignInAlt, FaStethoscope, FaUserMd, FaShieldAlt } from "react-icons/fa"
import useAuth from "../../../hooks/useAuth"

const JoinUs = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, googleSignIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await googleSignIn()
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: FaStethoscope, text: "Access Quality Healthcare" },
    { icon: FaUserMd, text: "Connect with Professionals" },
    { icon: FaShieldAlt, text: "Secure & Trusted Platform" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl mb-6">
                <FaStethoscope className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography variant="h1" className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Welcome to
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block">
                  Medix Care
                </span>
              </Typography>

              <Typography className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of healthcare professionals and participants in making quality healthcare accessible to
                everyone, everywhere.
              </Typography>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Typography className="text-gray-700 font-medium">{feature.text}</Typography>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
            <CardHeader
              className="pt-3 mt-4 grid h-16 text-center"
            >
              <Typography className="text-3xl shadow-white text-blue-600 font-bold">
                Sign In
              </Typography>
            </CardHeader>

            <CardBody className="flex flex-col gap-2 p-6">
              <Typography variant="paragraph" className="text-center text-gray-600 mb-4">
                Access your medical camp dashboard and continue your healthcare journey
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    size="lg"
                    className="!border-gray-300 focus:!border-blue-500 rounded-xl"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                      {errors.email.message}
                    </Typography>
                  )}
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    size="lg"
                    className="!border-gray-300 focus:!border-blue-500 rounded-xl"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    error={!!errors.password}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                  {errors.password && (
                    <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                      {errors.password.message}
                    </Typography>
                  )}
                </div>

                <Button
                  type="submit"
                  className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  fullWidth
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <Spinner size="sm" className="mx-auto" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaSignInAlt className="h-10 w-5" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outlined"
                color="blue-gray"
                className="flex items-center justify-center gap-3 border-2 hover:bg-gray-50 transition-all duration-300"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                size="lg"
              >
                <FaGoogle className="text-blue-600 h-8 w-5" />
                <span className="font-medium">Sign in with Google</span>
              </Button>
            </CardBody>

            <CardFooter className="pt-0 pb-6">
              <Typography variant="small" className="mt-6 flex justify-center text-gray-600">
                Don't have an account?
                <Link to="/register" className="ml-2  font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Create Account
                </Link>
              </Typography>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default JoinUs;
