import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react"
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserMd,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa"
import useAxios from "../../../hooks/useAxios"
import Loading from "../../../components/Loading"

const PopularCamps = () => {
  const axios = useAxios()
  const navigate = useNavigate()

  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["popular-camps"],
    queryFn: async () => {
      const res = await axios.get("/camps")
      // Sort by participant count and get top 6
      return res.data
        .sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
        .slice(0, 6)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (isLoading) return <Loading message="Loading popular camps..." />

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Typography variant="h2" className="font-bold text-gray-800 mb-4">
            Popular Medical Camps
          </Typography>
          <Typography className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of participants in our most popular medical camps offering quality healthcare services
          </Typography>
        </motion.div>

        {camps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {camps.map((camp, index) => (
              <motion.div
                key={camp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img
                      src={camp.images?.[0] || "/placeholder.svg?height=200&width=400"}
                      alt={camp.title}
                      className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <FaUsers className="h-4 w-4 mr-2" />
                        {`${camp.participant_count || 0} joined`}
                      </span>
                    </div>
                  </div>

                  <CardBody className="flex-grow">
                    <Typography variant="h5" className="font-bold text-gray-800 mb-3">
                      {camp.title}
                    </Typography>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-blue-600" />
                        <span className="font-semibold">${camp.fees}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>
                          {camp.date} at {camp.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>{camp.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserMd className="text-blue-500" />
                        <span>{camp.healthcare_professional}</span>
                      </div>
                    </div>

                    <Typography className="text-gray-600 text-sm line-clamp-3">
                      {camp.description}
                    </Typography>
                  </CardBody>

                  <CardFooter className="pt-0">
                    <Button
                      fullWidth
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                      onClick={() => navigate(`/camp-details/${camp._id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography className="text-gray-500">No popular camps available yet.</Typography>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/available-camps">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 ease-in-out px-8 py-3 shadow-md hover:shadow-lg"
            >
              See All Camps
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default PopularCamps
