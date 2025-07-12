"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useAxios from "../../hooks/useAxios"
import { Card, CardBody, Typography, Button, Chip } from "@material-tailwind/react"
import { FaCalendarAlt, FaMapMarkerAlt, FaUserMd, FaUsers } from "react-icons/fa"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Loading from "../../components/Loading"
import JoinCampModal from "./JoinCampModal"
import useAuth from "../../hooks/useAuth"

const CampDetails = () => {
  const { campId } = useParams()
  const axios = useAxios()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()

  const {
    data: camp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camp", campId],
    queryFn: async () => {
      const res = await axios.get(`/camps/${campId}`)
      return res.data
    },
    enabled: !!campId,
  })

  const joinMutation = useMutation({
    mutationFn: (info) => axios.post("/registrations", info),
    onSuccess: () => {
      toast.success("Successfully joined the camp!")
      queryClient.invalidateQueries(["camp", campId]) // Invalidate to refetch updated participant count
      queryClient.invalidateQueries(["registrations", user?.email]) // Invalidate participant's registrations
      setShowModal(false)
    },
    onError: (error) => {
      console.error("Failed to join camp:", error)
      toast.error(error.response?.data?.message || "Failed to join camp. Please try again.")
    },
  })

  if (isLoading) return <Loading message="Loading camp details..." />

  if (isError || !camp) {
    return (
      <Typography className="text-center py-20 text-red-600 font-semibold text-lg">
        Failed to load camp details.
      </Typography>
    )
  }

  // Format date nicely
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <Card className="shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <motion.img
            src={camp.images?.[0] || "/placeholder.svg?height=400&width=800"}
            alt={camp.title}
            className="w-full h-72 md:h-96 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
          <CardBody className="space-y-8 p-8 bg-white">
            <Typography variant="h2" className="font-extrabold text-indigo-900 leading-tight">
              {camp.title}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-gray-700">
              <div className="flex items-center gap-4">
                <FaCalendarAlt className="text-indigo-600 text-2xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500 font-medium">
                    Date & Time
                  </Typography>
                  <Typography className="font-semibold text-lg">
                    {formatDate(camp.date)} at {camp.time}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-indigo-600 text-2xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500 font-medium">
                    Location
                  </Typography>
                  <Typography className="font-semibold text-lg">{camp.venue}</Typography>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaUserMd className="text-indigo-600 text-2xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500 font-medium">
                    Healthcare Professional
                  </Typography>
                  <Typography className="font-semibold text-lg">{camp.healthcare_professional || "N/A"}</Typography>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaUsers className="text-indigo-600 text-2xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500 font-medium">
                    Participants
                  </Typography>
                  <Typography className="font-semibold text-lg">
                    {camp.participant_count || 0} / {camp.capacity}
                  </Typography>
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h5" className="text-indigo-900 font-bold mb-3">
                About the Camp
              </Typography>
              <Typography className="text-gray-700 leading-relaxed text-base">{camp.description}</Typography>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
              <Chip
                value={`Fees: $${camp.fees}`}
                className="bg-indigo-600 text-white font-semibold text-lg px-4 py-2 rounded-full"
              />
              <Button
                variant="gradient"
                fullWidth
                className="md:w-auto px-10 py-3 text-base bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                onClick={() => setShowModal(true)} 
                disabled={camp.capacity <= (camp.participant_count || 0) || joinMutation.isLoading}
                ripple={true}
              >
                {joinMutation.isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : camp.capacity <= (camp.participant_count || 0) ? (
                  "Camp Full"
                ) : (
                  <>
                    <FaUsers className="text-xl" /> Join Camp
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      {showModal && ( 
        <JoinCampModal
          camp={camp}
          isSubmitting={joinMutation.isLoading}
          onSubmit={(info) => joinMutation.mutate(info)}
          onClose={() => setShowModal(false)}
          user={user}
        />
      )}
    </motion.div>
  )
}

export default CampDetails
