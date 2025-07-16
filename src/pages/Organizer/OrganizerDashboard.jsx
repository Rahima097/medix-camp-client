import { Card, Typography } from "@material-tailwind/react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../components/Loading";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const { userRole, isLoading } = useUserRole();

  if (isLoading) return <Loading message="Loading organizer dashboard..." />;

  // Extra safety (even though OrganizerRoute handles this)
  if (userRole !== "organizer") {
    return (
      <div className="flex items-center justify-center h-full">
        <Typography variant="h6" color="red">
          Access Denied. Organizer role required.
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Card className="p-6 shadow-md bg-white">
        <Typography variant="h4" className="mb-4">
          Welcome Organizer
        </Typography>
        <Typography variant="paragraph" className="text-gray-700">
          Hello {user?.displayName || "Organizer"}, you have access to manage camps,
          view registered participants, and oversee your events. Use the sidebar to navigate your tools.
        </Typography>
      </Card>
    </div>
  );
};

export default OrganizerDashboard;
