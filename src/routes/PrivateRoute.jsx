import { Navigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Loading from "../components/Loading"

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Checking authentication..." />
  }

  if (!user) {
    return <Navigate to="/join-us" state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute
