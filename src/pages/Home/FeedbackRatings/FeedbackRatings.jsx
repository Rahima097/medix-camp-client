"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Card, CardBody, Typography, Avatar } from "@material-tailwind/react"
import { FaQuoteLeft, FaStar } from "react-icons/fa"
import useAxios from "../../../hooks/useAxios"
import Loading from "../../../components/Loading"

const FeedbackRatings = () => {
  const axios = useAxios()

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const res = await axios.get("/feedbacks")
      return res.data.slice(0, 6) // Show latest 6 feedbacks
    },
  })

  if (isLoading) return <Loading message="Loading feedback..." />

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Typography variant="h2" className="font-bold text-gray-800 mb-4">
            Participant Feedback & Ratings
          </Typography>
          <Typography className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real experiences from our community members who have participated in our medical camps
          </Typography>
        </motion.div>

        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardBody className="relative">
                    <FaQuoteLeft className="absolute top-4 right-4 text-blue-200 text-2xl" />

                    <div className="flex items-center gap-4 mb-4">
                      <Avatar
                        src={
                          feedback.participantPhoto ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.participantName)}&background=0ea5e9&color=fff`
                        }
                        alt={feedback.participantName}
                        size="md"
                      />
                      <div>
                        <Typography variant="h6" className="font-semibold">
                          {feedback.participantName}
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          {feedback.campName}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <Typography variant="small" className="text-gray-600">
                        ({feedback.rating}/5)
                      </Typography>
                    </div>

                    <Typography className="text-gray-700 leading-relaxed">"{feedback.comment}"</Typography>

                    <Typography variant="small" className="text-gray-500 mt-3">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography className="text-gray-500">
              No feedback available yet. Be the first to share your experience!
            </Typography>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeedbackRatings;
