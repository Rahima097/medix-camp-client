import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

const useAxios = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Intercept 401 Unauthorized errors globally
    const interceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/unauthorized"); // or handle logout if needed
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxios;
