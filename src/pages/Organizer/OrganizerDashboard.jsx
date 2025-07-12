import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Card, CardBody, Typography } from "@material-tailwind/react"
import { FaCalendarAlt, FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import useAuth from "../../hooks/useAuth"
import Loading from "../../components/Loading"

const OrganizerDashboard = () => {
  const axios = useAxios()
  const { user } = useAuth()

  const { data: stats, isLoading } = useQuery({
    queryKey: ["organizer-stats", user?.email],
    queryFn: async () => {
      const [campsRes, registrationsRes] = await Promise.all([axios.get("/camps"), axios.get("/registrations")])

      const totalCamps = campsRes.data.length
      const totalRegistrations = registrationsRes.data.length
      const totalRevenue = registrationsRes.data
        .filter((reg) => reg.paymentStatus === "paid")
        .reduce((sum, reg) => sum + (reg.campFees || 0), 0)
      const activeCamps = campsRes.data.filter((camp) => new Date(camp.date) >= new Date()).length

      return {
        totalCamps,
        totalRegistrations,
        totalRevenue,
        activeCamps,
      }
    },
  })

  if (isLoading) return <Loading message="Loading dashboard..." />

  const dashboardCards = [
    {
      title: "Total Camps",
      value: stats?.totalCamps || 0,
      icon: FaCalendarAlt,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
    },
    {
      title: "Total Registrations",
      value: stats?.totalRegistrations || 0,
      icon: FaUsers,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: FaDollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%",
    },
    {
      title: "Active Camps",
      value: stats?.activeCamps || 0,
      icon: FaChartLine,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5%",
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" className="font-bold text-gray-800 mb-2">
          Welcome back, {user?.displayName}!
        </Typography>
        <Typography className="text-gray-600">Here's an overview of your medical camp management activities</Typography>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <Typography variant="small" className="text-green-600 font-semibold">
                    {card.change}
                  </Typography>
                </div>
                <Typography variant="h4" className="font-bold text-gray-800 mb-1">
                  {card.value}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  {card.title}
                </Typography>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardBody className="p-6">
              <Typography variant="h5" className="font-bold text-gray-800 mb-6">
                Quick Actions
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      Create New Camp
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      Add a new medical camp for participants
                    </Typography>
                  </div>
                  <FaCalendarAlt className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      Manage Registrations
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      Review and confirm participant registrations
                    </Typography>
                  </div>
                  <FaUsers className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardBody className="p-6">
              <Typography variant="h5" className="font-bold text-gray-800 mb-6">
                Recent Activity
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <Typography variant="small" className="font-semibold">
                      New registration for Heart Health Camp
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      2 hours ago
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div>
                    <Typography variant="small" className="font-semibold">
                      Payment confirmed for Diabetes Screening
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      5 hours ago
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div>
                    <Typography variant="small" className="font-semibold">
                      New camp created successfully
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      1 day ago
                    </Typography>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default OrganizerDashboard;
