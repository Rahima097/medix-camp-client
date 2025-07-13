"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Spinner,
  Avatar,
  CardHeader,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"
import { FaUser, FaUpload, FaEdit } from "react-icons/fa"
import { PhoneIcon, EnvelopeIcon as HeroIconEnvelope } from "@heroicons/react/24/solid" // Renamed to avoid conflict
import useAuth from "../../hooks/useAuth"
import useAxios from "../../hooks/useAxios"
import { toast } from "react-toastify"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Loading from "../../components/Loading"

const fetchUserProfile = async (axios, email) => {
  if (!email) return null
  const res = await axios.get(`/users?email=${email}`)
  return res.data
}

const ParticipantProfile = () => {
  const { user, loading: authLoading, updateUserProfile: updateFirebaseProfile } = useAuth()
  const axios = useAxios()
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false) // State for dialog
  const [formData, setFormData] = useState({
    // State for form data, like OrganizerProfile
    name: "",
    email: "",
    phone: "",
    photo: "",
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)

  const {
    data: dbUser,
    isLoading: isDbUserLoading,
    isError: isDbUserError,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: () => fetchUserProfile(axios, user?.email),
    enabled: !authLoading && !!user?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name || user?.displayName || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          photo: data.photo || user?.photoURL || "",
        })
      }
    },
    onError: (err) => {
      toast.error("Failed to load profile data.")
      console.error("Error fetching user profile:", err)
    },
  })

  useEffect(() => {
    // This effect ensures formData is updated if dbUser changes after initial load
    if (dbUser) {
      setFormData((prev) => ({
        ...prev,
        name: dbUser.name || user?.displayName || "",
        email: dbUser.email || user?.email || "",
        phone: dbUser.phone || "",
        photo: dbUser.photo || user?.photoURL || "",
      }))
    }
  }, [dbUser, user])

  const handleOpen = () => setOpen((cur) => !cur)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)

    setImageUploading(true)
    const uploadFormData = new FormData() // Use a different name to avoid conflict with component's formData
    uploadFormData.append("file", file)
    uploadFormData.append("upload_preset", "medix_unsigned")
    uploadFormData.append("folder", "medix/profiles")

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadFormData,
        },
      )
      const data = await res.json()
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, photo: data.secure_url }))
        toast.success("Profile picture uploaded!")
      } else {
        throw new Error("Image URL not returned")
      }
    } catch (error) {
      toast.error("Image upload failed")
      console.error("Cloudinary Upload Error:", error)
    } finally {
      setImageUploading(false)
    }
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      // Update Firebase profile
      await updateFirebaseProfile(updatedData.name, updatedData.photo)
      // Update MongoDB user profile using email as identifier
      const res = await axios.patch(`/users/${user.email}`, updatedData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", user?.email])
      toast.success("Profile updated successfully!")
      setOpen(false) // Close dialog on success
    },
    onError: (error) => {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile.")
    },
  })

  const handleSubmit = () => {
    updateProfileMutation.mutate(formData) // Use formData state for mutation
  }

  if (authLoading || isDbUserLoading) return <Loading message="Loading profile..." />
  if (isDbUserError || !dbUser)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading profile.
      </Typography>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4"
            >
              <FaUser className="h-8 w-8 text-white" />
            </motion.div>
            <Typography variant="h2" className="font-bold text-gray-800 mb-2">
              Participant Profile
            </Typography>
            <Typography className="text-gray-600 max-w-2xl mx-auto">
              Manage your personal information and contact details.
            </Typography>
          </div>
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader
              variant="gradient"
              className="mb-0 p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700"
            >
              <Typography variant="h4" color="white" className="flex items-center gap-3">
                <FaEdit className="h-6 w-6" />
                Your Profile
              </Typography>
              <Typography variant="small" color="white" className="opacity-80 mt-1">
                View your details below.
              </Typography>
            </CardHeader>
            <CardBody className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar
                  src={
                    dbUser.photo ||
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.name || "User")}&background=0ea5e9&color=fff`
                  }
                  alt="profile-picture"
                  size="xxl"
                  className="border-4 w-24 h-24 rounded-full border-white shadow-lg shadow-blue-gray-500/25"
                />
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {dbUser.name || user?.displayName || "Participant"}
              </Typography>
              <Typography color="gray" className="font-normal mb-4">
                Participant, MedixCare
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md text-left">
                <div className="flex items-center gap-2">
                  <HeroIconEnvelope className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="paragraph" color="blue-gray">
                    Email: {dbUser.email || user?.email}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="paragraph" color="blue-gray">
                    Phone: {dbUser.phone || "N/A"}
                  </Typography>
                </div>
              </div>

              <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={handleOpen}>
                Update Profile
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Dialog for updating profile, similar to OrganizerProfile */}
      <Dialog open={open} handler={handleOpen} size="md">
        <DialogHeader className="bg-blue-700 text-white">Update Profile</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col items-center mb-6">
            <Avatar
              src={
                formData.photo ||
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "User")}&background=0ea5e9&color=fff`
              }
              alt="current-image"
              size="lg"
              className="border-4 w-24 h-24 rounded-full border-white shadow-md mb-4"
            />
            <label
              htmlFor="profile-upload-dialog"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 cursor-pointer"
            >
              {imageUploading ? <Spinner size="sm" /> : <FaUpload />}
              <Typography variant="small">{imageUploading ? "Uploading..." : "Change Photo"}</Typography>
            </label>
            <input
              id="profile-upload-dialog"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              fullWidth
            />
            <Input label="Email" name="email" value={formData.email} disabled fullWidth />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleSubmit}
            disabled={updateProfileMutation.isLoading || imageUploading}
          >
            {updateProfileMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default ParticipantProfile;
