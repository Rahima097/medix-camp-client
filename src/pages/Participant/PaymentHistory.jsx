"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  Typography,
  Input,
} from "@material-tailwind/react"
import { FaSearch } from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import useAuth from "../../hooks/useAuth"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Pagination from "../../components/Pagination" 

const fetchPaymentHistory = async (axios, email) => {
  if (!email) return []
  const res = await axios.get(`/payments?email=${email}`)
  return res.data
}

const PaymentHistory = () => {
  const axios = useAxios()
  const { user } = useAuth()
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    data: payments = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    queryFn: () => fetchPaymentHistory(axios, user?.email),
    enabled: !!user?.email,
    onError: () => toast.error("Failed to load payment history."),
  })

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      (payment.campName || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (payment.transactionId || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (payment.paymentStatus || "").toLowerCase().includes(searchText.toLowerCase())
    )
  }, [payments, searchText])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem)

  if (isLoading) return <Loading message="Loading payment history..." />
  if (isError)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading payment history.
      </Typography>
    )

  return (
    <div className="space-y-8 w-11/12 mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" className="font-bold text-gray-800 mb-2 text-center">
          Your Payment History
        </Typography>
        <Typography className="text-gray-600 text-center">
          Review your past and current payment transactions for medical camps.
        </Typography>
      </motion.div>

      <Card className="shadow-lg p-6">
        <div className="mb-6 flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full md:w-1/2">
          <FaSearch className="text-blue-600 mr-2" />
          <Input
            variant="static"
            placeholder="Search payments..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setCurrentPage(1) // Reset to page 1 on search
            }}
            className="border-none focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {[
                  "Camp Name",
                  "Fees",
                  "Payment Status",
                  "Confirmation Status",
                  "Transaction ID",
                  "Payment Date"
                ].map((heading) => (
                  <th key={heading} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                      {heading}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((reg, index) => (
                  <tr key={reg._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-gray-50/50"}>
                    <td className="p-4">{reg.campName || "N/A"}</td>
                    <td className="p-4">${reg.amount?.toFixed(2) || "0.00"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize 
                        ${reg.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize 
                        ${reg.confirmationStatus === "confirmed" ? "bg-green-100 text-green-700" : "bg-blue-gray-100 text-blue-gray-700"}`}>
                        {reg.confirmationStatus || "pending"}
                      </span>
                    </td>
                    <td className="p-4 text-xs">{reg.transactionId || "N/A"}</td>
                    <td className="p-4">
                      {reg.paymentDate ? new Date(reg.paymentDate).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    <Typography variant="small" color="gray">
                      No payment history found.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Use your custom Pagination here */}
        <div className="mt-6 flex justify-center">
          <Pagination
            totalItems={filteredPayments.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  )
}

export default PaymentHistory
