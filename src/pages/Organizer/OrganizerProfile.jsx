"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Avatar,
  Spinner,
} from "@material-tailwind/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useAuth from "../../hooks/useAuth"
import useAxios from "../../hooks/useAxios"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FaUpload, FaEnvelope, FaPhone, FaEdit } from "react-icons/fa"

const fetchUserProfile = async (axios, email) => {
  if (!email) return null
  const res = await axios.get(`/users/${email}`)
  return res.data
}

const OrganizerProfile = () => {
  const { user } = useAuth()
  const axios = useAxios()
  const queryClient = useQueryClient()
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  // Fetch user profile data
  const {
    data: dbUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organizerProfile", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/users/${user?.email}`)
      return res.data
    },
    enabled: !!user?.email, // Only run if user email is available
  })

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axios.put(`/users/${dbUser._id}`, updatedData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["organizerProfile", user?.email])
      toast.success("Profile updated successfully!")
      setShowUpdateModal(false)
    },
    onError: (err) => {
      toast.error("Failed to update profile: " + (err.response?.data?.message || err.message))
    },
  })

  // Effect to pre-fill form when modal opens or dbUser changes
  useEffect(() => {
    if (dbUser && showUpdateModal) {
      setValue("name", dbUser.name || "")
      setValue("email", dbUser.email || "")
      setValue("phone", dbUser.phone || "") // Pre-fill phone number
      setValue("photo", dbUser.photo || "")
    }
  }, [dbUser, setValue, showUpdateModal])

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true)
  }

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false)
    reset() // Reset form fields when closing
  }

  const onSubmit = async (data) => {
    setImageUploading(true)
    let photoURL = data.photo
    if (data.photo && data.photo[0]) {
      const imageFile = data.photo[0]
      const formData = new FormData()
      formData.append("image", imageFile)

      try {
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )
        photoURL = imgbbResponse.data.data.url
      } catch (imgbbError) {
        toast.error("Failed to upload image. Please try again.")
        setImageUploading(false)
        return
      }
    }
    setImageUploading(false)

    const updatedData = {
      name: data.name,
      email: data.email, // Email is read-only but included for consistency
      phone: data.phone, // Include phone in update payload
      photo: photoURL,
    }
    updateProfileMutation.mutate(updatedData)
  }

  if (isLoading) {
    return <Spinner className="h-12 w-12 mx-auto mt-20" />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="red">
          Error loading profile: {error.message}
        </Typography>
      </div>
    )
  }

  if (!dbUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="blue-gray">
          No profile data found.
        </Typography>
      </div>
    )
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden">
        <CardHeader
          color="blue"
          className="relative h-56 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 p-6"
        >
          <Avatar
            src={dbUser?.photo || "/placeholder.svg?height=150&width=150"}
            alt="profile-picture"
            size="xxl"
            className="rounded-full border-4 border-white shadow-lg mb-4"
          />
          <Typography variant="h3" color="white" className="font-bold">
            {dbUser?.name || "Organizer Name"}
          </Typography>
        </CardHeader>
        <CardBody className="p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <FaEnvelope className="h-6 w-6 text-blue-gray-500" />
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Email:
                </Typography>
                <Typography variant="paragraph" color="gray">
                  {dbUser?.email}
                </Typography>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaPhone className="h-6 w-6 text-blue-gray-500" />
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Phone:
                </Typography>
                <Typography variant="paragraph" color="gray">
                  {dbUser?.phone || "N/A"}
                </Typography>
              </div>
            </div>
          </div>
          <Button color="blue" onClick={handleOpenUpdateModal} className="shadow-md hover:shadow-lg">
            <FaEdit className="inline-block mr-2 h-5 w-5" /> Update Profile
          </Button>
        </CardBody>
      </Card>

      {/* Update Profile Modal */}
      <Dialog open={showUpdateModal} handler={handleCloseUpdateModal} size="md" className="mx-auto ">
        <DialogHeader className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
          <Typography variant="h5" color="white">
            Update Profile
          </Typography>
          <Button variant="text" color="white" onClick={handleCloseUpdateModal} className="!p-0 text-lg">
            X
          </Button>
        </DialogHeader>
        <DialogBody divider className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar
                src={
                  dbUser?.photo ||
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser?.name || "User")}&background=0ea5e9&color=fff`
                }
                size="xl"
                className="border-4 w-20 h-20 border-white shadow-md mb-4 rounded-full"
              />
              <label
                htmlFor="profile-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 cursor-pointer"
              >
                {imageUploading ? <Spinner size="sm" /> : <FaUpload />}
                <Typography variant="small">{imageUploading ? "Uploading..." : "Change Photo"}</Typography>
              </label>
              <input id="profile-upload" type="file" accept="image/*" {...register("photo")} className="hidden" />
            </div>
            <div>
              <Input
                label="Name"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                className="mb-2"
              />
              {errors.name && (
                <Typography color="red" className="text-sm">
                  {errors.name.message}
                </Typography>
              )}
            </div>
            <div>
              <Input label="Email" {...register("email")} disabled className="mb-2" />
              <Typography color="gray" className="text-xs mt-1">
                Email cannot be changed.
              </Typography>
            </div>
            <div>
              <Input
                label="Phone Number"
                {...register("phone", { required: "Phone number is required" })}
                error={!!errors.phone}
                className="mb-2"
              />
              {errors.phone && (
                <Typography color="red" className="text-sm">
                  {errors.phone.message}
                </Typography>
              )}
            </div>
          </form>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 p-4">
          <Button variant="text" color="red" onClick={handleCloseUpdateModal}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleSubmit(onSubmit)}
            disabled={updateProfileMutation.isPending || imageUploading}
          >
            {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default OrganizerProfile
