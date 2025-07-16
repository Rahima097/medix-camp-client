import useUserRole from "../../hooks/useUserRole";
import OrganizerDashboard from "../Organizer/OrganizerDashboard";
import ParticipantDashboard from "../Participant/ParticipantDashboard";
import Loading from "../../components/Loading";
import { Navigate } from "react-router-dom";

const DashboardHome = () => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) return <Loading message="Loading dashboard..." />;

  if (userRole === "organizer") return <OrganizerDashboard />;
  if (userRole === "participant" || userRole === "user") {
    return <ParticipantDashboard />;
  }

  return <Navigate to="/forbidden" />;
};

export default DashboardHome;