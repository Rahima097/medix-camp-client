import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "../../hooks/useAxios"
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react"
import {
  FaThLarge,
  FaTh,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserMd,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa"
import { motion } from "framer-motion"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import { useQuery } from "@tanstack/react-query"

const fetchCamps = async (axios) => {
  const res = await axios.get("/camps")
  return res.data
}

const AvailableCamps = () => {
  const axios = useAxios()
  const navigate = useNavigate()
  const [layout, setLayout] = useState("grid-3") // Default to 3 columns
  const [searchText, setSearchText] = useState("")
  const [sortOption, setSortOption] = useState("")

  // React Query for fetching camps
  const {
    data: camps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camps"],
    queryFn: () => fetchCamps(axios),
    onError: () => toast.error("Failed to load camps"),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  })

  const filtered = useMemo(() => {
    if (!Array.isArray(camps)) return []
    const arr = camps.filter((c) =>
      [c.title, c.venue, c.healthcare_professional].join(" ").toLowerCase().includes(searchText.toLowerCase()),
    )

    if (sortOption === "most-registered") {
      arr.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
    } else if (sortOption === "fees-low-high") {
      arr.sort((a, b) => (a.fees || 0) - (b.fees || 0))
    } else if (sortOption === "name-az") {
      arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    }
    return arr
  }, [camps, searchText, sortOption])

  if (isLoading) return <Loading message="Loading available camps..." />
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading camps.
      </Typography>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 mb-3"
          >
            Discover Medical Camps
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 text-lg max-w-2xl mx-auto"
          >
            Find and register for health camps tailored to your needs.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 p-4 bg-white rounded-xl shadow-lg">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 w-full md:w-1/2 lg:w-2/5">
            {" "}
            <FaSearch className="text-blue-600 mr-3 text-lg" />
            <Input
              variant="static"
              placeholder="Search by camp name, venue, or doctor..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none focus:ring-0 mb-3 text-gray-800 placeholder-gray-500"
              containerProps={{ className: "min-w-0" }}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-3/5 justify-end">
            {" "}

            <Select
              label="Sort by"
              value={sortOption}
              onChange={(v) => setSortOption(v)}
              className="bg-gray-50 rounded-lg shadow-sm text-gray-800 w-full md:w-48 lg:w-64"
              labelProps={{ className: "text-gray-600" }}
            >
              <Option value="">Default</Option>
              <Option value="most-registered">Most Registered</Option>
              <Option value="fees-low-high">Fees: Low to High</Option>
              <Option value="name-az">Name: A to Z</Option>
            </Select>
            <div className="flex gap-2">
              <IconButton
                variant={layout === "grid-3" ? "filled" : "outlined"}
                color={layout === "grid-3" ? "blue" : "blue-gray"}
                onClick={() => setLayout("grid-3")}
                className="rounded-md"
              >
                <FaTh className="text-lg" />
              </IconButton>
              <IconButton
                variant={layout === "grid-2" ? "filled" : "outlined"}
                color={layout === "grid-2" ? "blue" : "blue-gray"}
                onClick={() => setLayout("grid-2")}
                className="rounded-md"
              >
                <FaThLarge className="text-lg" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Camps Grid */}
        <div
          className={`grid gap-8 ${layout === "grid-3" ? "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-1 md:grid-cols-2"
            }`}
        >
          {filtered.length > 0 ? (
            filtered.map((camp) => (
              <Card
                key={camp._id}
                shadow={true}
                className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <img
                  src={camp.images?.[0] || "/placeholder.svg?height=200&width=400"}
                  alt={camp.title}
                  className="h-48 w-full object-cover"
                />
                <CardBody className="pb-2 px-6 pt-5">
                  <Typography variant="h5" className="font-bold mb-2 text-gray-900">
                    {camp.title}
                  </Typography>
                  <div className="text-gray-600 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-blue-600 text-base" /> {/* Changed to blue */}
                      <span className="font-semibold text-base">${camp.fees}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500 text-base" /> {/* Changed to blue */}
                      <span>
                        {new Date(camp.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {camp.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500 text-base" /> {/* Changed to blue */}
                      <span>{camp.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUserMd className="text-blue-500 text-base" /> {/* Changed to blue */}
                      <span>{camp.healthcare_professional}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500 text-base" /> {/* Changed to blue */}
                      <span>{camp.participant_count || 0} participants</span>
                    </div>
                  </div>
                  <Typography variant="paragraph" color="gray" className="mt-4 line-clamp-3 text-sm">
                    {camp.description}
                  </Typography>
                </CardBody>
                <CardFooter className="pt-0 pb-6 px-6">
                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                    onClick={() => navigate(`/camp-details/${camp._id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Typography className="col-span-full text-center text-gray-500 mt-20 text-xl">
              No camps found matching your criteria.
            </Typography>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AvailableCamps;
