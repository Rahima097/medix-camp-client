import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Textarea,
  Rating,
  Typography,
  Spinner,
} from "@material-tailwind/react"
import { useForm } from "react-hook-form"

const FeedbackModal = ({ open, handleOpen, camp, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const currentRating = watch("rating")

  const handleRatingChange = (value) => {
    setValue("rating", value)
  }

  const handleFormSubmit = (data) => {
    onSubmit({
      campId: camp._id,
      campName: camp.campName,
      participantName: camp.participantName,
      participantEmail: camp.participantEmail,
      participantPhoto: camp.participantPhoto, 
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <Dialog open={open} handler={handleOpen} size="sm">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          Provide Feedback for {camp.campName}
        </Typography>
        <Button
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="text-xl font-bold leading-none p-0"
          disabled={isSubmitting}
        >
          &times;
        </Button>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogBody divider className="p-6">
          <div className="mb-6">
            <Typography variant="h6" className="mb-2">
              Your Rating:
            </Typography>
            <Rating value={currentRating} onChange={handleRatingChange} className="flex gap-1 text-yellow-400" />
            {errors.rating && (
              <Typography color="red" variant="small">
                {errors.rating.message}
              </Typography>
            )}
          </div>
          <div>
            <Textarea
              label="Your Feedback"
              rows={5}
              {...register("comment", { required: "Feedback comment is required" })}
              error={!!errors.comment}
            />
            {errors.comment && (
              <Typography color="red" variant="small">
                {errors.comment.message}
              </Typography>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-4">
          <Button variant="outlined" color="gray" onClick={handleOpen} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" /> Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}

export default FeedbackModal;
