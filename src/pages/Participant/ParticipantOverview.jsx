import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
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

const ParticipantOverview = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const [regRes, payRes] = await Promise.all([
          axios.get(`http://localhost:5000/registrations?email=${user.email}`),
          axios.get(`http://localhost:5000/payments?email=${user.email}`),
        ]);
        setRegistrations(regRes.data);
        setPayments(payRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching participant data:", err);
      }
    };

    fetchData();
  }, [user.email]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // Total stats
  const totalCamps = registrations.length;
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Chart data
  const paymentData = payments.map((p) => ({
    name: p.campName,
    value: p.amount,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7", "#F87171"];

  return (
    <div className="p-4 md:p-6">
      <Typography variant="h4" className="mb-6 font-bold text-blue-600">
        Participant Overview
      </Typography>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-lg">
          <CardBody>
            <Typography variant="h6">Total Camps Registered</Typography>
            <Typography variant="h3" className="mt-2 font-bold text-blue-700">
              {totalCamps}
            </Typography>
          </CardBody>
        </Card>

        <Card className="shadow-lg">
          <CardBody>
            <Typography variant="h6">Total Amount Paid</Typography>
            <Typography variant="h3" className="mt-2 font-bold text-green-600">
              ${totalPaid.toFixed(2)}
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payments Pie Chart */}
        <Card className="shadow-lg p-4">
          <Typography variant="h6" className="mb-4">
            Payments by Camp
          </Typography>
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
                  fill="#8884d8"
                  label
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No payments yet.</p>
          )}
        </Card>

        {/* Registrations Bar Chart */}
        <Card className="shadow-lg p-4">
          <Typography variant="h6" className="mb-4">
            Registered Camps
          </Typography>
          {registrations.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={registrations.map((r) => ({ name: r.campName, count: 1 }))}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No registrations yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ParticipantOverview;
