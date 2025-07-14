"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Card, Typography, Button, Input } from "@material-tailwind/react"
import {
  FaSearch,
  FaBan,
  FaCommentDots,
  FaDollarSign,
} from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import useAuth from "../../hooks/useAuth"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import FeedbackModal from "./FeedbackModal"
import { useNavigate } from "react-router-dom"
import Pagination from "../../components/Pagination" 

const fetchRegisteredCamps = async (axios, email) => {
  if (!email) return []
  try {
    const res = await axios.get(`/registrations?email=${email}`)
    return res.data
  } catch (error) {
    console.error("Error fetching registered camps:", error)
    throw error
  }
}

const RegisteredCamps = () => {
  const axios = useAxios()
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState("")
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
  const [selectedCampForFeedback, setSelectedCampForFeedback] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    data: registrations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["participantRegistrations", user?.email],
    queryFn: () => fetchRegisteredCamps(axios, user?.email),
    enabled: !authLoading && !!user?.email,
    onError: () => {
      toast.error("Failed to load registered camps.")
    },
  })

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(
      (reg) =>
        (reg.campName || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (reg.healthcareProfessional || "").toLowerCase().includes(searchText.toLowerCase())
    )
  }, [registrations, searchText])

  const cancelRegistrationMutation = useMutation({
    mutationFn: (id) => axios.delete(`/registrations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["participantRegistrations", user?.email])
      queryClient.invalidateQueries(["camps"])
      toast.success("Registration cancelled successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel registration.")
    },
  })

  const submitFeedbackMutation = useMutation({
    mutationFn: (feedbackData) => axios.post("/feedbacks", feedbackData),
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks"])
      queryClient.invalidateQueries(["participantRegistrations", user?.email])
      toast.success("Feedback submitted successfully!")
      setOpenFeedbackModal(false)
      setSelectedCampForFeedback(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit feedback.")
    },
  })

  const handleCancelRegistration = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will cancel your registration.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelRegistrationMutation.mutate(id)
      }
    })
  }

  const handleOpenFeedbackModal = (camp) => {
    setSelectedCampForFeedback(camp)
    setOpenFeedbackModal(true)
  }

  if (authLoading || isLoading) return <Loading message="Loading registered camps..." />

  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading registered camps: {error?.message || "Unknown error"}
      </Typography>
    )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="space-y-8 w-11/12 mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" className="text-center font-bold text-gray-800 mb-2">
          Your Registered Camps
        </Typography>
        <Typography className="text-gray-600 text-center">
          View and manage the medical camps you have registered for.
        </Typography>
      </motion.div>

      <Card className="shadow-lg p-6">
        <div className="mb-6 flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full md:w-1/2">
          <FaSearch className="text-blue-600 mr-2" />
          <Input
            variant="static"
            placeholder="Search registered camps..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-none focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="p-4 bg-blue-gray-50">Camp Name</th>
                <th className="p-4 bg-blue-gray-50">Camp Fees</th>
                <th className="p-4 bg-blue-gray-50">Payment Status</th>
                <th className="p-4 bg-blue-gray-50">Confirmation</th>
                <th className="p-4 bg-blue-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((reg, index) => (
                  <tr key={reg._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-gray-50/50"}>
                    <td className="p-4">{reg.campName}</td>
                    <td className="p-4">${reg.campFees}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          reg.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {reg.paymentStatus || "unpaid"}
                      </span>
                      {reg.paymentStatus === "unpaid" && (
                        <button
                          onClick={() => navigate(`/dashboard/payment/${reg._id}`)}
                          className="mt-2 inline-flex items-center gap-1 text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          <FaDollarSign className="inline-block" /> Pay
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          reg.confirmationStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reg.confirmationStatus || "pending"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outlined"
                        color="red"
                        onClick={() => handleCancelRegistration(reg._id)}
                        disabled={reg.paymentStatus === "paid" || cancelRegistrationMutation.isLoading}
                        className="flex items-center gap-2"
                      >
                        <FaBan className="h-4 w-4" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="outlined"
                        color="green"
                        onClick={() => handleOpenFeedbackModal(reg)}
                        disabled={reg.paymentStatus !== "paid" || reg.hasFeedback}
                        className="flex items-center gap-2"
                      >
                        <FaCommentDots className="h-4 w-4" /> Feedback
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    <Typography variant="small" color="gray">
                      No registered camps found.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Reused shared Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            totalItems={filteredRegistrations.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {selectedCampForFeedback && (
        <FeedbackModal
          open={openFeedbackModal}
          handleOpen={() => setOpenFeedbackModal(!openFeedbackModal)}
          camp={selectedCampForFeedback}
          onSubmit={submitFeedbackMutation.mutate}
          isSubmitting={submitFeedbackMutation.isLoading}
        />
      )}
    </div>
  )
}

export default RegisteredCamps;
