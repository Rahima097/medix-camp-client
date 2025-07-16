import { Typography, Button } from "@material-tailwind/react";
import { FaSearch, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading";

function ParticipantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["participant-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loading />;
  

  const totalCamps = registrations.length;
  const paidCamps = registrations.filter((r) => r.paymentStatus === "paid");
  const unpaidCamps = registrations.filter((r) => r.paymentStatus !== "paid");
  

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h2" className="text-3xl font-bold mb-4 text-center">
        Participant Dashboard
      </Typography>

      {/* ✅ Case 1: No registrations */}
      {totalCamps === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-3">
            You haven't registered for any camps yet.
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Start exploring medical camps and join one that suits your needs!
          </Typography>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              color="blue"
              onClick={() => navigate("/available-camps")}
              className="flex items-center justify-center gap-2"
            >
              <FaSearch className="h-4 w-4" /> Explore Available Camps
            </Button>
            <Button
              color="light-blue"
              onClick={() => navigate("/dashboard/registered-camps")}
              className="flex items-center justify-center gap-2 text-blue-600"
            >
              <FaClipboardList className="h-4 w-4 text-blue-600" /> View Registered Camps
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Case 2: Registered but unpaid */}
      {totalCamps > 0 && unpaidCamps.length === totalCamps && (
        <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg text-center mb-8">
          <Typography className="text-yellow-800 font-medium mb-2">
            You have {unpaidCamps.length} unpaid camp{unpaidCamps.length > 1 ? "s" : ""}.
          </Typography>
          <Typography className="text-yellow-700 mb-4">
            Please complete your payment to unlock full features of the dashboard.
          </Typography>
          <Button onClick={() => navigate("/dashboard/registered-camps")} color="amber">
            Go to Registered Camps
          </Button>
        </div>
      )}

      {/* ✅ Case 3: At least one paid registration (full dashboard view) */}
      {paidCamps.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <Typography variant="h5" className="text-green-700">
              Camps Joined
            </Typography>
            <Typography className="text-3xl font-bold">{totalCamps}</Typography>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <Typography variant="h5" className="text-blue-700">
              Camps Paid
            </Typography>
            <Typography className="text-3xl font-bold">{paidCamps.length}</Typography>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <Typography variant="h5" className="text-red-700">
              Camps Pending
            </Typography>
            <Typography className="text-3xl font-bold">{unpaidCamps.length}</Typography>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantDashboard;
