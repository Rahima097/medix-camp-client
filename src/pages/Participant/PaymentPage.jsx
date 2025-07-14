"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardBody, Typography, Button, Spinner } from "@material-tailwind/react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import useAxios from "../../hooks/useAxios"
import useAuth from "../../hooks/useAuth"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import { FaCreditCard, FaCheckCircle } from "react-icons/fa"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = ({ registration, onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const axios = useAxios()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [cardError, setCardError] = useState(null)

  const createPaymentIntentMutation = useMutation({
    mutationFn: (amount) => axios.post("/create-payment-intent", { amount }),
    onError: (error) => {
      console.error("Error creating payment intent:", error)
      toast.error("Failed to initiate payment. Please try again.")
      setProcessing(false)
    },
  })

  const updateRegistrationPaymentStatusMutation = useMutation({
    mutationFn: ({ id, paymentInfo }) => axios.patch(`/registrations/${id}/payment`, paymentInfo),
    onSuccess: () => {
      toast.success("Payment successful and registration updated!")
      onPaymentSuccess()
    },
    onError: (error) => {
      console.error("Error updating registration after payment:", error)
      toast.error("Payment successful, but failed to update registration status.")
      setProcessing(false)
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    const card = elements.getElement(CardElement)
    if (card === null) return

    setProcessing(true)
    setCardError(null)

    try {
      const response = await createPaymentIntentMutation.mutateAsync(registration.campFees * 100)
      const clientSecret = response?.data?.clientSecret

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous@example.com",
            name: user?.displayName || "Anonymous",
          },
        },
      })

      if (confirmError) {
        console.error("[Stripe Error]", confirmError)
        setCardError(confirmError.message)
        toast.error(confirmError.message)
        setProcessing(false)
        return
      }

      if (paymentIntent.status === "succeeded") {
        const paymentInfo = {
          paymentStatus: "paid",
          transactionId: paymentIntent.id,
          paymentDate: new Date().toISOString(),
          amount: registration.campFees,
          campName: registration.campName,
          participantEmail: registration.participantEmail,
          confirmationStatus: registration.confirmationStatus || "pending",

          // ✅ These are important for backend tracking
          campId: registration.campId,
          registrationId: registration._id,
        }

        console.log("Submitting paymentInfo to backend:", paymentInfo)

        await updateRegistrationPaymentStatusMutation.mutateAsync({ id: registration._id, paymentInfo })
      }
    } catch (error) {
      console.error("Payment process error:", error)
      setCardError(error.message || "An unexpected error occurred during payment.")
      toast.error(error.message || "Payment failed. Please try again.")
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {cardError && (
        <Typography color="red" variant="small">
          {cardError}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        color="blue"
        disabled={!stripe || !elements || processing}
        className="flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Spinner size="sm" /> Processing...
          </>
        ) : (
          <>
            <FaCreditCard /> Pay ${registration.campFees}
          </>
        )}
      </Button>
    </form>
  )
}

const PaymentPage = () => {
  const { registrationId } = useParams()
  const axios = useAxios()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: registration,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleRegistration", registrationId],
    queryFn: async () => {
      const res = await axios.get(`/registrations/${registrationId}`)
      return res.data
    },
    enabled: !!registrationId,
    staleTime: 1000 * 60 * 5,
  })

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries(["userRole", registration.participantEmail]) // ✅ refetch updated role
    queryClient.invalidateQueries(["singleRegistration", registrationId])
    queryClient.invalidateQueries(["participantRegistrations"])
    queryClient.invalidateQueries(["paymentHistory"])
    navigate("/dashboard/registered-camps")
  }

  if (isLoading) return <Loading message="Loading payment details..." />
  if (isError || !registration)
    return (
      <Typography color="red" className="text-center mt-20">
        Error loading payment details.
      </Typography>
    )

  if (registration.paymentStatus === "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardBody className="p-8">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <Typography variant="h4" color="green" className="mb-2">
              Payment Already Made!
            </Typography>
            <Typography className="text-gray-700 mb-4">This registration has already been paid for.</Typography>
            <Typography variant="small" className="text-gray-600">
              Transaction ID: {registration.transactionId || "N/A"}
            </Typography>
            <Button color="blue" className="mt-6" onClick={() => navigate("/dashboard/registered-camps")}>
              Back to Registered Camps
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-8">
          <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
            Complete Your Payment
          </Typography>
          <Typography className="mb-4 text-gray-700">
            You are about to pay for: <span className="font-semibold">{registration.campName}</span>
          </Typography>
          <Typography className="mb-6 text-gray-700">
            Amount Due: <span className="font-bold text-blue-600 text-xl">${registration.campFees}</span>
          </Typography>

          <Elements stripe={stripePromise}>
            <CheckoutForm registration={registration} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </CardBody>
      </Card>
    </div>
  )
}

export default PaymentPage;
