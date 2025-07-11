import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
} from '@material-tailwind/react'
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserMd,
  FaUsers,
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import Loading from '../../components/Loading'
import { toast } from 'react-toastify'
import JoinCampModal from './JoinCampModal'

const CampDetails = () => {
  const { campId } = useParams()
  const axios = useAxios()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  const {
    data: camp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['camp', campId],
    queryFn: async () => {
      const res = await axios.get(`/camps/${campId}`)
      return res.data
    },
    enabled: !!campId,
  })

  const joinMutation = useMutation({
    mutationFn: (info) => axios.post(`/camps/${campId}/join`, info),
    onSuccess: () => {
      toast.success('Successfully joined the camp!')
      queryClient.invalidateQueries(['camp', campId])
      setShowModal(false)
    },
    onError: () => toast.error('Failed to join camp.'),
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
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <motion.img
            src={camp.images?.[0] || '/placeholder.svg'}
            alt={camp.title}
            className="w-full h-72 md:h-96 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />

          <CardBody className="space-y-6 p-8 bg-white">
            <Typography variant="h2" className="font-bold text-indigo-900">
              {camp.title}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-indigo-600 text-xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500">
                    Date & Time
                  </Typography>
                  <Typography className="font-semibold">
                    {formatDate(camp.date)} at {camp.time}
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-indigo-600 text-xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500">
                    Location
                  </Typography>
                  <Typography className="font-semibold">{camp.venue}</Typography>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUserMd className="text-indigo-600 text-xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500">
                    Healthcare Professional
                  </Typography>
                  <Typography className="font-semibold">
                    {camp.healthcare_professional || 'N/A'}
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUsers className="text-indigo-600 text-xl" />
                <div>
                  <Typography variant="small" className="block text-gray-500">
                    Participants
                  </Typography>
                  <Typography className="font-semibold">
                    {camp.participant_count || 0} / {camp.capacity}
                  </Typography>
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h5" className="text-indigo-900 font-semibold mb-2">
                Description
              </Typography>
              <Typography className="text-gray-700 leading-relaxed">
                {camp.description}
              </Typography>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-3 mt-6">
              <Chip
                value={`$${camp.fees}`}
                className="bg-indigo-600 text-white font-semibold"
              />
              <Button
                variant="gradient"
                fullWidth
                className="md:w-auto px-10"
                onClick={() => setShowModal(true)}
                disabled={camp.capacity <= (camp.participant_count || 0)}
                ripple={true}
              >
                {camp.capacity <= (camp.participant_count || 0) ? 'Camp Full' : 'Join Camp'}
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
        />
      )}
    </motion.div>
  )
}

export default CampDetails;
