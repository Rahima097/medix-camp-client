import { useEffect } from "react"
import {
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react"
import { useForm } from "react-hook-form"

const JoinCampModal = ({ camp, onClose, onSubmit, isSubmitting, user }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (user) {
      setValue("participantName", user.displayName || "")
      setValue("participantEmail", user.email || "")
    }
  }, [user, setValue])

  const handleFormSubmit = (data) => {
    const registrationData = {
      campId: camp._id,
      campName: camp.title,
      campFees: camp.fees,
      location: camp.venue,
      healthcareProfessional: camp.healthcare_professional,
      participantName: data.participantName,
      participantEmail: data.participantEmail,
      age: Number(data.age),
      phone: data.phone,
      gender: data.gender,
      emergencyContact: data.emergencyContact,
      paymentStatus: "unpaid", // Initial status
      confirmationStatus: "pending", // Initial status
      registeredAt: new Date().toISOString(),
    }
    onSubmit(registrationData)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto" // Added rounded-2xl
        onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
      >
        <DialogHeader className="flex justify-between items-center px-6 pt-6 border-b border-gray-200">
          <Typography variant="h5" color="blue-gray" className="font-bold">
            Join Camp - {camp.title}
          </Typography>
          <Button
            variant="text"
            color="gray"
            onClick={onClose}
            className="text-xl font-bold leading-none p-0"
            disabled={isSubmitting}
          >
            &times;
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6">
            {/* Read-only inputs */}
            <Input label="Camp Name" value={camp.title} readOnly className="bg-gray-100" />
            <Input label="Fees" value={`$${camp.fees}`} readOnly className="bg-gray-100" />
            <Input label="Location" value={camp.venue} readOnly className="bg-gray-100" />
            <Input label="Doctor" value={camp.healthcare_professional} readOnly className="bg-gray-100" />

            {/* User inputs */}
            <Input
              label="Your Name"
              {...register("participantName", { required: "Participant name is required" })}
              error={!!errors.participantName}
              readOnly={!!user?.displayName}
              className={user?.displayName ? "bg-gray-100" : ""}
            />
            {errors.participantName && (
              <Typography color="red" variant="small" className="mt-1">
                {errors.participantName.message}
              </Typography>
            )}

            <Input
              label="Email"
              type="email"
              {...register("participantEmail", { required: "Email is required", pattern: /^\S+@\S+$/i })}
              error={!!errors.participantEmail}
              readOnly={!!user?.email}
              className={user?.email ? "bg-gray-100" : ""}
            />
            {errors.participantEmail && (
              <Typography color="red" variant="small" className="mt-1">
                {errors.participantEmail.message}
              </Typography>
            )}

            <Input
              label="Age"
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 1, message: "Age must be at least 1" },
              })}
              error={!!errors.age}
            />
            {errors.age && (
              <Typography color="red" variant="small" className="mt-1">
                {errors.age.message}
              </Typography>
            )}

            <Input
              label="Phone Number"
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              error={!!errors.phone}
            />
            {errors.phone && (
              <Typography color="red" variant="small" className="mt-1">
                {errors.phone.message}
              </Typography>
            )}

            <Select
              label="Gender" // Changed back to label
              {...register("gender", { required: "Gender is required" })}
              onChange={(val) => setValue("gender", val)}
              error={!!errors.gender}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
            {errors.gender && (
              <Typography color="red" variant="small" className="mt-1">
                {errors.gender.message}
              </Typography>
            )}

            <Input
              label="Emergency Contact"
              {...register("emergencyContact", { required: "Emergency contact is required" })}
              error={!!errors.emergencyContact}
            />
            {errors.emergencyContact && (
              <Typography color="red" variant="small" className="mt-1">
                {errors.emergencyContact.message}
              </Typography>
            )}
          </DialogBody>
          <DialogFooter className="flex justify-between px-6 pb-6 border-t border-gray-200">
            <Button variant="outlined" color="gray" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit"  disabled={isSubmitting} className="flex items-center text-base bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Joining...
                </>
              ) : (
                "Join Now"
              )}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </div>
  )
}

export default JoinCampModal
