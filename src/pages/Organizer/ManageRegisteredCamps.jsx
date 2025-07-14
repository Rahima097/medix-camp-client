import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Card,
  Typography,
  Button,
  Input,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
  IconButton,
} from "@material-tailwind/react"
import { FaSearch, FaTimesCircle, FaBan, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { motion } from "framer-motion"

const fetchRegistrations = async (axios) => {
  const res = await axios.get("/registrations")
  return res.data
}

const ManageRegisteredCamps = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const [searchText, setSearchText] = useState("")
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allRegistrations"],
    queryFn: () => fetchRegistrations(axios),
    onError: () => toast.error("Failed to load registrations."),
  })

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(
      (reg) =>
        (reg.campName || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (reg.participantName || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (reg.participantEmail || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (reg.healthcareProfessional || "").toLowerCase().includes(searchText.toLowerCase()),
    )
  }, [registrations, searchText])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem)

  const updateConfirmationStatusMutation = useMutation({
    mutationFn: ({ id, status }) => axios.patch(`/registrations/${id}/confirm`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["allRegistrations"])
      toast.success("Confirmation status updated!")
      setOpenConfirmDialog(false)
      setSelectedRegistration(null)
    },
    onError: (error) => {
      console.error("Error updating confirmation status:", error)
      toast.error(error.response?.data?.message || "Failed to update confirmation status.")
    },
  })

  const cancelRegistrationMutation = useMutation({
    mutationFn: (id) => axios.delete(`/registrations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["allRegistrations"])
      queryClient.invalidateQueries(["camps"])
      toast.success("Registration cancelled successfully!")
    },
    onError: (error) => {
      console.error("Error cancelling registration:", error)
      toast.error(error.response?.data?.message || "Failed to cancel registration.")
    },
  })

  const handleConfirmStatus = (registration) => {
    setSelectedRegistration(registration)
    setOpenConfirmDialog(true)
  }

  const confirmAction = () => {
    if (selectedRegistration) {
      updateConfirmationStatusMutation.mutate({ id: selectedRegistration._id, status: "confirmed" })
    }
  }

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

  if (isLoading) return <Loading message="Loading registered camps..." />
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading registered camps.
      </Typography>
    )

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
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 w-11/12 mx-auto my-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" className="font-bold text-gray-800 mb-2 text-center">
          Manage Registered Camps
        </Typography>
        <Typography className="text-gray-600 text-center">Oversee all participant registrations for medical camps.</Typography>
      </motion.div>

      <Card className="shadow-lg p-6">
        <div className="mb-6 flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full md:w-1/2">
          <FaSearch className="text-blue-600 mt-2 mr-2" />
          <Input
            variant="static"
            placeholder="Search registrations..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-none pb-2 ps-4 rounded-full focus:ring-0"
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
                    Participant Name
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
                        {reg.participantName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        ${reg.campFees}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize 
      ${reg.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant={reg.confirmationStatus === "confirmed" ? "filled" : "outlined"}
                        color={reg.confirmationStatus === "confirmed" ? "green" : "blue-gray"}
                        onClick={() => handleConfirmStatus(reg)}
                        disabled={reg.confirmationStatus === "confirmed" || updateConfirmationStatusMutation.isLoading}
                        className="capitalize text-blue-600 border border-blue-600"
                      >
                        {updateConfirmationStatusMutation.isLoading && selectedRegistration?._id === reg._id ? (
                          <Spinner size="sm" />
                        ) : (
                          reg.confirmationStatus
                        )}
                      </Button>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outlined"
                        color="red"
                        onClick={() => handleCancelRegistration(reg._id)}
                        disabled={
                          (reg.paymentStatus === "paid" && reg.confirmationStatus === "confirmed") ||
                          cancelRegistrationMutation.isLoading
                        }
                        className="flex items-center gap-2"
                      >
                        <FaBan className="h-4 w-4" /> Cancel
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    <Typography variant="small" color="gray">
                      No registered camps found.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-8">
            <Pagination
              totalItems={filteredRegistrations.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>

      {selectedRegistration && (
        <Dialog open={openConfirmDialog} handler={() => setOpenConfirmDialog(false)} size="xs">
          <DialogHeader className="flex justify-between items-center">
            <Typography variant="h5" color="blue-gray">
              Confirm Registration
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={() => setOpenConfirmDialog(false)}>
              <FaTimesCircle className="h-5 w-5" />
            </IconButton>
          </DialogHeader>
          <DialogBody divider>
            <Typography className="mb-4">Are you sure you want to confirm the registration for:</Typography>
            <Typography variant="h6" className="font-semibold">
              {selectedRegistration.campName} by {selectedRegistration.participantName}?
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              Current Status:{" "}
              <Chip value={selectedRegistration.confirmationStatus} color="blue-gray" className="capitalize" />
            </Typography>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setOpenConfirmDialog(false)}
              disabled={updateConfirmationStatusMutation.isLoading}
            >
              Cancel
            </Button>
            <Button color="green" onClick={confirmAction} disabled={updateConfirmationStatusMutation.isLoading}>
              {updateConfirmationStatusMutation.isLoading ? <Spinner size="sm" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  )
}

export default ManageRegisteredCamps;
