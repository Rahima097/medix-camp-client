import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useUserRole from "../../hooks//useUserRole"
import Loading from "../../components/Loading"

const DashboardHome = () => {
  const { userRole, isLoading } = useUserRole()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (userRole === "organizer") {
        navigate("/dashboard/organizer-dashboard", { replace: true })
      } else if (userRole === "participant") {
        navigate("/dashboard/participant-dashboard", { replace: true })
      } else {
        // Fallback for unassigned roles or if role determination fails
        navigate("/forbidden", { replace: true })
      }
    }
  }, [userRole, isLoading, navigate])

  return <Loading message="Redirecting to dashboard..." />
}

export default DashboardHome;
