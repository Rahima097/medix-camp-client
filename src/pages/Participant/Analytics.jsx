"use client"

import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import { Card, CardBody, Typography } from "@material-tailwind/react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import useAxios from "../../hooks/useAxios"
import useAuth from "../../hooks/useAuth"
import Loading from "../../components/Loading"

const fetchParticipantRegistrations = async (axios, email) => {
  if (!email) return []
  const res = await axios.get(`/registrations?email=${email}`)
  return res.data
}

const Analytics = () => {
  const axios = useAxios()
  const { user } = useAuth()

  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participantRegistrations", user?.email],
    queryFn: () => fetchParticipantRegistrations(axios, user?.email),
    enabled: !!user?.email,
    onError: () => console.error("Failed to load participant registrations for analytics"),
  })

  // Prepare data for charts
  const chartData = registrations.map((reg) => ({
    name: reg.campName,
    fees: reg.campFees,
    paymentStatus: reg.paymentStatus,
  }))

  // Aggregate data for Pie Chart (Payment Status)
  const paymentStatusData = useMemo(() => {
    const statusCounts = registrations.reduce((acc, reg) => {
      acc[reg.paymentStatus] = (acc[reg.paymentStatus] || 0) + 1
      return acc
    }, {})
    return Object.keys(statusCounts).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }))
  }, [registrations])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"] // Colors for pie chart

  if (isLoading) return <Loading message="Loading analytics..." />
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading analytics.
      </Typography>
    )

  return (
    <div className="space-y-8 w-11/12 mx-auto py-8">
      <Typography variant="h3" className="font-bold text-gray-800 text-center mb-2">
        Your Camp Analytics
      </Typography>
      <Typography className="text-gray-600 text-center">Visualize your registered camps and payment overview.</Typography>

      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <Typography className="text-gray-500">
            You haven't registered for any camps yet. Register for a camp to see your analytics here!
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                Camp Fees Distribution
              </Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fees" fill="#0ea5e9" name="Camp Fees ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6">
              <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                Payment Status Overview
              </Typography>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Analytics;
