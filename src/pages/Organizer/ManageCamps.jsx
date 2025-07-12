"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion" // Import motion from framer-motion
import {
  Card,
  Typography,
  Button,
  Input,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Spinner,
} from "@material-tailwind/react"
import { FaSearch, FaEdit, FaTrash, FaTimes, FaImage, FaUpload, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useForm } from "react-hook-form"

const fetchCamps = async (axios) => {
  const res = await axios.get("/camps")
  return res.data
}

const ManageCamps = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const [searchText, setSearchText] = useState("")
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedCamp, setSelectedCamp] = useState(null)
  const [editImageUrl, setEditImageUrl] = useState("")
  const [imageUploading, setImageUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    data: camps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camps"],
    queryFn: () => fetchCamps(axios),
    onError: () => toast.error("Failed to load camps."),
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm()

  const filteredCamps = useMemo(() => {
    return camps.filter(
      (camp) =>
        (camp.title || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (camp.date || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (camp.healthcare_professional || "").toLowerCase().includes(searchText.toLowerCase()),
    )
  }, [camps, searchText])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCamps.slice(indexOfFirstItem, indexOfLastItem)

  const deleteCampMutation = useMutation({
    mutationFn: (id) => axios.delete(`/camps/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["camps"])
      queryClient.invalidateQueries(["popular-camps"])
      toast.success("Camp deleted successfully!")
    },
    onError: (error) => {
      console.error("Error deleting camp:", error)
      toast.error(error.response?.data?.message || "Failed to delete camp.")
    },
  })

  const updateCampMutation = useMutation({
    mutationFn: ({ id, updatedCamp }) => axios.put(`/camps/${id}`, updatedCamp),
    onSuccess: () => {
      queryClient.invalidateQueries(["camps"])
      queryClient.invalidateQueries(["popular-camps"])
      toast.success("Camp updated successfully!")
      setOpenEditModal(false)
      setSelectedCamp(null)
      setEditImageUrl("")
      reset()
    },
    onError: (error) => {
      console.error("Error updating camp:", error)
      toast.error(error.response?.data?.message || "Failed to update camp.")
    },
  })

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCampMutation.mutate(id)
      }
    })
  }

  const handleEdit = (camp) => {
    setSelectedCamp(camp)
    setEditImageUrl(camp.images?.[0] || "")
    setValue("campName", camp.title)
    setValue("campFees", camp.fees)
    setValue("dateTime", `${camp.date}T${camp.time}`)
    setValue("location", camp.venue)
    setValue("healthcareProfessional", camp.healthcare_professional)
    setValue("capacity", camp.capacity)
    setValue("description", camp.description)
    setOpenEditModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "medix_unsigned")
    formData.append("folder", "medix/camps")

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )
      const data = await res.json()
      if (data.secure_url) {
        setEditImageUrl(data.secure_url)
        toast.success("Image uploaded successfully!")
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

  const removeEditImage = () => {
    setEditImageUrl("")
  }

  const onEditSubmit = (data) => {
    if (!editImageUrl) {
      toast.error("Please upload a camp image.")
      return
    }
    const updatedCampData = {
      title: data.campName,
      images: [editImageUrl],
      fees: Number(data.campFees),
      date: data.dateTime.split("T")[0],
      time: data.dateTime.split("T")[1],
      venue: data.location,
      healthcare_professional: data.healthcareProfessional,
      description: data.description,
      capacity: Number(data.capacity),
    }
    updateCampMutation.mutate({ id: selectedCamp._id, updatedCamp: updatedCampData })
  }

  if (isLoading) return <Loading message="Loading camps..." />
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading camps.
      </Typography>
    )

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" className="font-bold text-gray-800 mb-2">
          Manage Your Camps
        </Typography>
        <Typography className="text-gray-600">Edit or delete medical camps you have created.</Typography>
      </motion.div>

      <Card className="shadow-lg p-6">
        <div className="mb-6 flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full md:w-1/2">
          <FaSearch className="text-blue-600 mr-2" />
          <Input
            variant="static"
            placeholder="Search camps..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-none focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Camp Name
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Date & Time
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Location
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Professional
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Participants
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((camp, index) => (
                  <tr key={camp._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-gray-50/50"}>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {camp.title}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {camp.date} at {camp.time}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {camp.venue}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {camp.healthcare_professional}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {camp.participant_count || 0} / {camp.capacity}
                      </Typography>
                    </td>
                    <td className="p-4 flex gap-2">
                      <IconButton
                        variant="outlined"
                        color="blue"
                        size="sm"
                        onClick={() => handleEdit(camp)}
                        disabled={updateCampMutation.isLoading}
                      >
                        <FaEdit className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        color="red"
                        size="sm"
                        onClick={() => handleDelete(camp._id)}
                        disabled={deleteCampMutation.isLoading}
                      >
                        <FaTrash className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    <Typography variant="small" color="gray">
                      No camps created yet.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-8">
            <Pagination
              totalItems={filteredCamps.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>

      {selectedCamp && (
        <Dialog
          open={openEditModal}
          handler={() => setOpenEditModal(false)}
          size="lg"
          className="rounded-2xl shadow-xl" 
          overlayProps={{
            className: "bg-black/50", 
          }}
        >
          <DialogHeader className="flex justify-between items-center px-6 pt-6 border-b border-gray-200">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Edit Camp: {selectedCamp.title}
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={() => setOpenEditModal(false)}>
              <FaTimes className="h-5 w-5" />
            </IconButton>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)}>
            <DialogBody divider className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6">
              <Input
                label="Camp Name"
                type="text"
                {...register("campName", { required: "Camp name is required" })}
                error={!!errors.campName}
              />
              <Input
                label="Camp Fees ($)"
                type="number"
                {...register("campFees", { required: "Camp fees is required", min: 0 })}
                error={!!errors.campFees}
              />
              <Input
                label="Date & Time"
                type="datetime-local"
                {...register("dateTime", { required: "Date and time is required" })}
                error={!!errors.dateTime}
              />
              <Input
                label="Location"
                type="text"
                {...register("location", { required: "Location is required" })}
                error={!!errors.location}
              />
              <Input
                label="Healthcare Professional Name"
                type="text"
                {...register("healthcareProfessional", { required: "Professional name is required" })}
                error={!!errors.healthcareProfessional}
              />
              <Input
                label="Maximum Participants"
                type="number"
                {...register("capacity", { required: "Capacity is required", min: 1 })}
                error={!!errors.capacity}
              />
              <Textarea
                label="Camp Description"
                rows={4}
                className="md:col-span-2"
                {...register("description", { required: "Description is required" })}
                error={!!errors.description}
              />

              {/* Image Upload for Edit */}
              <div className="space-y-4 md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                  <FaImage className="h-5 w-5" />
                  Camp Image
                </Typography>
                {!editImageUrl ? (
                  <label
                    htmlFor="edit-camp-image"
                    className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="edit-camp-image"
                    />
                    <FaImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <Typography variant="h6" className="mb-2">
                      Upload Camp Image
                    </Typography>
                    <Typography variant="small" color="gray" className="mb-4">
                      Click anywhere in this box to upload
                    </Typography>
                    <Button
                      type="button"
                      variant="outlined"
                      size="sm"
                      className="flex items-center gap-2 mx-auto pointer-events-none"
                      disabled={imageUploading}
                    >
                      {imageUploading ? <Spinner size="sm" /> : <FaUpload />}
                      {imageUploading ? "Uploading..." : "Choose Image"}
                    </Button>
                  </label>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={editImageUrl || "/placeholder.svg"}
                      alt="Camp preview"
                      className="w-full max-w-md h-48 object-cover rounded-xl border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeEditImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-end gap-4 px-6 pb-6 border-t border-gray-200">
              <Button
                variant="outlined"
                color="gray"
                onClick={() => setOpenEditModal(false)}
                disabled={updateCampMutation.isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" color="blue" disabled={updateCampMutation.isLoading || imageUploading}>
                {updateCampMutation.isLoading ? <Spinner size="sm" /> : "Update Camp"}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
    </div>
  )
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const getPageNumbers = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default ManageCamps;
