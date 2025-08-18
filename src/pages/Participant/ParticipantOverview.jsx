import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
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
} from "recharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import Loading from "../../components/Loading";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7", "#F87171"];

const ParticipantOverview = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  // Fetch registrations
  const { data: registrations = [], isLoading: regLoading } = useQuery({
    queryKey: ["participant-registrations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/registrations");
      return res.data;
    },
  });

  // Fetch payments
  const { data: payments = [], isLoading: payLoading } = useQuery({
    queryKey: ["participant-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  if (regLoading || payLoading) return <Loading message="Loading overview..." />;

  // Filter only current participant's data
  const userEmail = user?.email;
  const userRegistrations = registrations.filter(r => r.participantEmail === userEmail);
  const userPayments = payments.filter(p => p.participantEmail === userEmail);

  // Stats
  const totalCamps = userRegistrations.length;
  const totalPaid = userPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Chart data
  const paymentData = userPayments.map(p => ({ name: p.campName, value: Number(p.amount || 0) }));
  const registrationData = userRegistrations.map(r => ({ name: r.campName, count: 1 }));

  return (
    <div className="p-6 space-y-8">
      <Typography variant="h4" className="text-center font-bold text-blue-600">
        Participant Overview
      </Typography>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <Typography variant="h6">Total Camps Registered</Typography>
            <Typography className="text-2xl font-bold text-blue-500">{totalCamps}</Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Typography variant="h6">Total Amount Paid</Typography>
            <Typography className="text-2xl font-bold text-green-500">${totalPaid.toFixed(2)}</Typography>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart: Payments */}
        <Card className="p-6">
          <Typography variant="h6" className="mb-4">Payments by Camp</Typography>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: $${value}`}
                >
                  {paymentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">No payments yet.</p>
          )}
        </Card>

        {/* Bar Chart: Registrations */}
        <Card className="p-6">
          <Typography variant="h6" className="mb-4">Registered Camps</Typography>
          {registrationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">No registrations yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ParticipantOverview;
