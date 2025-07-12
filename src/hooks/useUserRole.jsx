import { useQuery } from "@tanstack/react-query"
import useAuth from "./useAuth"
import useAxios from "./useAxios"

const useUserRole = () => {
  const { user } = useAuth()
  const axios = useAxios()

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null
      const res = await axios.get(`/users?email=${user.email}`)
      return res.data?.role || "user"
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5, 
  })

  return { userRole, isLoading }
}

export default useUserRole;
