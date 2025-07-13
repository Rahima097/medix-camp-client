import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useUserRole from "../hooks/useUserRole"
import Loading from "../components/Loading"

const ParticipantRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const { userRole, isLoading: roleLoading } = useUserRole()

  if (authLoading || roleLoading) {
    return <Loading message="Verifying permissions..." />
  }

  if (!user) {
    return <Navigate to="/join-us" replace />
  }

  // A participant can be a 'user' or an 'organizer' who also participates
  // For this project, 'user' is the primary participant role.
  // If an organizer registers for a camp, they are also a participant.
  if (userRole !== "user" && userRole !== "organizer") {
    return <Navigate to="/forbidden" replace />
  }

  return children
}

export default ParticipantRoute
