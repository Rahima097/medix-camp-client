import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
  Typography,
  Input,
  Spinner,
  Avatar,
} from "@material-tailwind/react";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaUpload,
  FaStethoscope,
  FaUserMd,
  FaShieldAlt,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const { createUser, googleSignIn, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 added
  const from = location.state?.from?.pathname || "/"; // 🟢 added
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "medix_unsigned");
    formData.append("folder", "medix/uploads");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setProfilePic(data.secure_url);
      } else {
        throw new Error("Image URL not returned");
      }
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Cloudinary Upload Error:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!profilePic) {
      toast.error("Please upload a profile picture.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createUser(data.email, data.password);
      await updateUserProfile(data.name, profilePic);

      const userInfo = {
        email: data.email,
        name: data.name,
        role: "user",
        photo: profilePic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userInfo);

      navigate(from, { replace: true });
    } catch (e) {
      console.error("Registration Error:", e);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await googleSignIn();
      const user = result.user;

      const userInfo = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // 🔎 Check if user already exists in DB
      let exists = false;
      try {
        const res = await axiosInstance.get(`/users?email=${user.email}`);
        if (res.data?.email) exists = true;
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error("Something went wrong");
          return;
        }
      }

      //  If user not found, add to DB
      if (!exists) {
        await axiosInstance.post("/users", userInfo);
      }
      toast.success("Google Register is successfully!")
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      toast.error("Google Sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { Icon: FaStethoscope, text: "Access Quality Healthcare" },
    { Icon: FaUserMd, text: "Connect with Professionals" },
    { Icon: FaShieldAlt, text: "Secure & Trusted Platform" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col items-start px-8"
        >
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl mb-6">
            <FaStethoscope className="h-10 w-10 text-white" />
          </div>
          <Typography variant="h1" className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Welcome to<br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Medix Care
            </span>
          </Typography>
          <Typography className="text-xl text-gray-600">
            Join thousands of healthcare professionals and participants in making quality healthcare accessible to everyone, everywhere.
          </Typography>
          <div className="mt-8 space-y-4">
            {features.map(({ Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <Typography className="text-gray-700 font-medium">{text}</Typography>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
            <CardHeader variant="gradient" className="mb-4 grid h-16 place-items-center mt-4">
              <Typography variant="h3" className="text-3xl text-blue-600 font-bold">
                Create Account
              </Typography>
            </CardHeader>

            <CardBody className="flex flex-col gap-2 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  {...register("name", { required: true })}
                  size="lg"
                  placeholder="Full Name"
                  className="rounded-xl"
                />
                {errors.name && <span className="text-red-500 text-sm">Name is required</span>}

                <div className="flex flex-col items-center">
                  <Avatar
                    src={profilePic || "https://ui-avatars.com/api/?name=User"}
                    size="lg"
                    className="border-4 border-white mb-3"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 cursor-pointer"
                  >
                    {imageUploading ? <Spinner size="sm" /> : <FaUpload />}
                    <Typography variant="small">{imageUploading ? "Uploading..." : "Upload Photo"}</Typography>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <Input
                  {...register("email", { required: true })}
                  size="lg"
                  type="email"
                  placeholder="Email Address"
                  className="rounded-xl"
                />
                {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true, minLength: 6 })}
                    size="lg"
                    placeholder="Password"
                    className="rounded-xl"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      Password is required (min 6 characters)
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <FaUserPlus /> Sign Up
                    </>
                  )}
                </button>
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
                fullWidth
                size="lg"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="flex items-center justify-center gap-2"
              >
                <FaGoogle className="text-blue-600 h-8" /> Sign up with Google
              </Button>
            </CardBody>

            <CardFooter className="pt-0 pb-6">
              <Typography variant="small" className="text-center text-gray-600">
                Already have an account?
                <Link to="/join-us" state={{ from: location.state?.from || location }} className="ml-2 font-bold text-blue-600 hover:text-blue-800">
                  Sign In
                </Link>
              </Typography>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
