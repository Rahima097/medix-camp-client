import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion" // Import motion from framer-motion
import { Card, Typography, Button, Input, Chip } from "@material-tailwind/react"
import { FaSearch, FaBan, FaCommentDots, FaDollarSign, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import useAuth from "../../hooks/useAuth"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import FeedbackModal from "./FeedbackModal"
import { useNavigate } from "react-router-dom"

const fetchRegisteredCamps = async (axios, email) => {
  if (!email) return []
  const res = await axios.get(`/registrations?email=${email}`)
  return res.data
}

const RegisteredCamps = () => {
  const axios = useAxios()
  const { user } = useAuth()
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
  } = useQuery({
    queryKey: ["participantRegistrations", user?.email],
    queryFn: () => fetchRegisteredCamps(axios, user?.email),
    enabled: !!user?.email,
    onError: () => toast.error("Failed to load registered camps."),
  })

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(
      (reg) =>
        (reg.campName || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (reg.healthcareProfessional || "").toLowerCase().includes(searchText.toLowerCase()),
    )
  }, [registrations, searchText])

  const cancelRegistrationMutation = useMutation({
    mutationFn: (id) => axios.delete(`/registrations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["participantRegistrations", user?.email])
      queryClient.invalidateQueries(["camps"]) // Invalidate camps to update participant count
      toast.success("Registration cancelled successfully!")
    },
    onError: (error) => {
      console.error("Error cancelling registration:", error)
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
      console.error("Error submitting feedback:", error)
      toast.error(error.response?.data?.message || "Failed to submit feedback.")
    },
  })

  const handleCancelRegistration = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel this registration. This action cannot be undone.",
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

  if (isLoading) return <Loading message="Loading registered camps..." />
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading registered camps.
      </Typography>
    )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem)

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
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" className="font-bold text-gray-800 mb-2">
          Your Registered Camps
        </Typography>
        <Typography className="text-gray-600">View and manage the medical camps you have registered for.</Typography>
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
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Camp Name
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Camp Fees
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Payment Status
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Confirmation
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
                currentItems.map((reg, index) => (
                  <tr key={reg._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-gray-50/50"}>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {reg.campName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        ${reg.campFees}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Chip
                        value={reg.paymentStatus}
                        color={reg.paymentStatus === "paid" ? "green" : "red"}
                        className="capitalize"
                      />
                      {reg.paymentStatus === "unpaid" && (
                        <Button
                          size="sm"
                          color="blue"
                          className="mt-2"
                          onClick={() => navigate(`/dashboard/payment/${reg._id}`)}
                        >
                          <FaDollarSign className="inline-block mr-1" /> Pay
                        </Button>
                      )}
                    </td>
                    <td className="p-4">
                      <Chip
                        value={reg.confirmationStatus}
                        color={reg.confirmationStatus === "confirmed" ? "green" : "blue-gray"}
                        className="capitalize"
                      />
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
                        disabled={reg.paymentStatus !== "paid" || reg.hasFeedback} // Disable if not paid or already given feedback
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
        <div className="flex justify-center mt-8">
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
