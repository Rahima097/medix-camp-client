import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useUserRole from "../hooks/useUserRole"
import Loading from "../components/Loading"

const OrganizerRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const { userRole, isLoading: roleLoading } = useUserRole()

  if (authLoading || roleLoading) {
    return <Loading message="Verifying permissions..." />
  }

  if (!user) {
    return <Navigate to="/join-us" replace />
  }

  if (userRole !== "organizer") {
    return <Navigate to="/forbidden" replace />
  }

  return children
}

export default OrganizerRoute;
