// src/pages/Dashboard/OrganizerDashboard/OrganizerOverview.jsx
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const COLORS = ["#4CAF50", "#2196F3", "#FFC107"];

const OrganizerOverview = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Fetch all payments
  const { data: payments = [] } = useQuery({
    queryKey: ["all-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  // Derived stats
  const totalParticipants = users.filter((u) => u.role === "participant").length;
  const totalOrganizers = users.filter((u) => u.role === "organizer").length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const confirmedRegistrations = payments.filter(
    (p) => p.confirmationStatus === "confirmed"
  ).length;

  // Pie data for role distribution
  const roleData = [
    { name: "Participants", value: totalParticipants },
    { name: "Organizers", value: totalOrganizers },
  ];

  // Bar data for payment status
  const paymentData = [
    { status: "Confirmed", count: confirmedRegistrations },
    {
      status: "Pending",
      count: payments.filter((p) => p.confirmationStatus !== "confirmed").length,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Heading */}
      <Typography variant="h4" className="text-center font-bold">
        Organizer Dashboard Overview
      </Typography>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 shadow-lg rounded-2xl">
          <CardBody>
            <Typography variant="h6">Total Participants</Typography>
            <Typography className="text-2xl font-bold text-blue-500">
              {totalParticipants}
            </Typography>
          </CardBody>
        </Card>

        <Card className="p-4 shadow-lg rounded-2xl">
          <CardBody>
            <Typography variant="h6">Total Organizers</Typography>
            <Typography className="text-2xl font-bold text-green-500">
              {totalOrganizers}
            </Typography>
          </CardBody>
        </Card>

        <Card className="p-4 shadow-lg rounded-2xl">
          <CardBody>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography className="text-2xl font-bold text-purple-500">
              ${totalRevenue}
            </Typography>
          </CardBody>
        </Card>

        <Card className="p-4 shadow-lg rounded-2xl">
          <CardBody>
            <Typography variant="h6">Confirmed Registrations</Typography>
            <Typography className="text-2xl font-bold text-orange-500">
              {confirmedRegistrations}
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6">
          <Typography variant="h6" className="mb-4">
            User Role Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {roleData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6">
          <Typography variant="h6" className="mb-4">
            Payment Status Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default OrganizerOverview;
