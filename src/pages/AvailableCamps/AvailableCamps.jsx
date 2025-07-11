import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
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
} from "@material-tailwind/react";
import {
  FaThLarge,
  FaTh,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const fetchCamps = async (axios) => {
  const res = await axios.get("/camps");
  return res.data;
};

const AvailableCamps = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [layout, setLayout] = useState("grid-3");
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");

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
  });

  const filtered = useMemo(() => {
    if (!Array.isArray(camps)) return [];

    let arr = camps.filter((c) =>
      [c.title, c.venue, c.healthcare_professional]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );

    if (sortOption === "most-registered") {
      arr.sort((a, b) => b.participant_count - a.participant_count);
    } else if (sortOption === "fees-low-high") {
      arr.sort((a, b) => a.fees - b.fees);
    } else if (sortOption === "name-az") {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    }

    return arr;
  }, [camps, searchText, sortOption]);

  if (isLoading) return <Loading message="Loading available camps..." />;
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading camps.
      </Typography>
    );

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
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            Available Medical Camps
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Explore and join upcoming camps in your community.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center bg-white rounded-full shadow-md px-4">
            <FaSearch className="text-blue-600 mr-2" />
            <Input
              variant="static"
              placeholder="Search camps..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              label="Sort by"
              value={sortOption}
              onChange={(v) => setSortOption(v)}
              className="bg-white rounded-lg shadow-md"
            >
              <Option value="">Default</Option>
              <Option value="most-registered">Most Registered</Option>
              <Option value="fees-low-high">Fees: Low → High</Option>
              <Option value="name-az">Name: A → Z</Option>
            </Select>

            <IconButton
              variant={layout === "grid-3" ? "filled" : "outlined"}
              color="blue-gray"
              onClick={() => setLayout("grid-3")}
            >
              <FaTh />
            </IconButton>
            <IconButton
              variant={layout === "grid-2" ? "filled" : "outlined"}
              color="blue-gray"
              onClick={() => setLayout("grid-2")}
            >
              <FaThLarge />
            </IconButton>
          </div>
        </div>

        {/* Camps */}
        <div
          className={`grid gap-8 ${
            layout === "grid-3"
              ? "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-1 md:grid-cols-2"
          }`}
        >
          {filtered.length > 0 ? (
            filtered.map((camp) => (
              <Card
                key={camp._id}
                shadow={true}
                className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <img
                  src={camp.images?.[0]}
                  alt={camp.title}
                  className="h-48 w-full object-cover"
                />
                <CardBody className="pb-2">
                  <Typography
                    variant="h5"
                    className="font-semibold mb-2 text-gray-800"
                  >
                    {camp.title}
                  </Typography>
                  <div className="text-gray-600 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />{" "}
                      <span>
                        {camp.date} at {camp.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt /> <span>{camp.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUserMd /> <span>{camp.healthcare_professional}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers /> <span>{camp.participant_count} joined</span>
                    </div>
                  </div>
                  <Typography
                    variant="body2"
                    color="gray"
                    className="mt-3 line-clamp-3"
                  >
                    {camp.description}
                  </Typography>
                </CardBody>
                <CardFooter className="pt-0 pb-4 px-4">
                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700"
                    onClick={() => navigate(`/camp-details/${camp._id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Typography className="col-span-full text-center text-gray-500 mt-20">
              No camps found.
            </Typography>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AvailableCamps;
