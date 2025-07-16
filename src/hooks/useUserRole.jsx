import { useQuery } from "@tanstack/react-query"
import useAuth from "./useAuth"
import useAxios from "./useAxios"

const useUserRole = () => {
  const { user } = useAuth()
  const axios = useAxios()

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return "user"
      const res = await axios.get(`/users/role/${user.email}`)
      return res.data?.role || "user"
    },
    enabled: !!user?.email,
    staleTime: 0,
  })

  return { userRole, isLoading }
}

export default useUserRole;