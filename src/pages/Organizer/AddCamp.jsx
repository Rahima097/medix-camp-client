import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Input,
    Button,
    Textarea,
    Spinner,
} from "@material-tailwind/react";
import {
    FaCalendarPlus,
    FaUpload,
    FaImage,
    FaTimes,
    FaStethoscope,
    FaMapMarkerAlt,
    FaDollarSign,
} from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

const AddCamp = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const axios = useAxios();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "medix_unsigned");
        formData.append("folder", "medix/camps");

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.secure_url) {
                setImageUrl(data.secure_url);
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error("Image URL not returned");
            }
        } catch (error) {
            toast.error("Image upload failed");
            console.error("Cloudinary Upload Error:", error);
        } finally {
            setImageUploading(false);
        }
    };

    const removeImage = () => {
        setImageUrl("");
    };

    const onSubmit = async (data) => {
        if (!imageUrl) {
            toast.error("Please upload a camp image.");
            return;
        }

        const campData = {
            title: data.campName,
            images: [imageUrl],
            fees: Number(data.campFees),
            date: data.dateTime.split("T")[0],
            time: data.dateTime.split("T")[1],
            venue: data.location,
            healthcare_professional: data.healthcareProfessional,
            description: data.description,
            participant_count: 0,
            capacity: Number(data.capacity) || 50,
            category: "general-checkup",
            status: "published",
            createdAt: new Date().toISOString(),
        };

        setIsLoading(true);
        try {
            const response = await axios.post("/camps", campData);
            toast.success("Medical camp created successfully!");
            reset();
            setImageUrl("");
        } catch (error) {
            console.error("Error creating camp:", error);
            toast.error("Failed to create camp. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formFields = [
        {
            name: "campName",
            label: "Camp Name",
            type: "text",
            placeholder: "e.g., Free Health Checkup Camp",
            icon: FaStethoscope,
            validation: { required: "Camp name is required" },
        },
        {
            name: "campFees",
            label: "Camp Fees ($)",
            type: "number",
            placeholder: "e.g., 25.00",
            icon: FaDollarSign,
            validation: {
                required: "Camp fees is required",
                min: { value: 0, message: "Fees cannot be negative" },
            },
        },
        {
            name: "dateTime",
            label: "Date & Time",
            type: "datetime-local",
            placeholder: "",
            icon: FaCalendarPlus,
            validation: { required: "Date and time is required" },
        },
        {
            name: "location",
            label: "Location",
            type: "text",
            placeholder: "e.g., Community Health Center, Main Street",
            icon: FaMapMarkerAlt,
            validation: { required: "Location is required" },
        },
        {
            name: "healthcareProfessional",
            label: "Healthcare Professional Name",
            type: "text",
            placeholder: "e.g., Dr. Sarah Johnson, MD",
            icon: FaStethoscope,
            validation: { required: "Healthcare professional name is required" },
        },
        {
            name: "capacity",
            label: "Maximum Participants",
            type: "number",
            placeholder: "e.g., 100",
            icon: FaStethoscope,
            validation: {
                required: "Participant capacity is required",
                min: { value: 1, message: "Capacity must be at least 1" },
            },
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4"
                        >
                            <FaCalendarPlus className="h-8 w-8 text-white" />
                        </motion.div>
                        <Typography variant="h2" className="font-bold text-gray-800 mb-2">
                            Add New Medical Camp
                        </Typography>
                        <Typography className="text-gray-600 max-w-2xl mx-auto">
                            Create a new medical camp to serve your community. Fill in all
                            the details below to make your camp visible to participants.
                        </Typography>
                    </div>

                    <Card className="shadow-2xl border-0 overflow-hidden">
                        <CardHeader
                            variant="gradient"
                            className="mb-0 p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700"
                        >
                            <Typography variant="h4" color="white" className="flex items-center gap-3">
                                <FaCalendarPlus className="h-6 w-6" />
                                Camp Information
                            </Typography>
                            <Typography variant="small" color="white" className="opacity-80 mt-1">
                                Please provide accurate information for your medical camp
                            </Typography>
                        </CardHeader>

                        <CardBody className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formFields.map((field, index) => (
                                        <motion.div
                                            key={field.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className={
                                                field.name === "dateTime" || field.name === "location"
                                                    ? "md:col-span-2"
                                                    : ""
                                            }
                                        >
                                            <div className="relative">
                                                <Input
                                                    type={field.type}
                                                    label={field.label}
                                                    placeholder={field.placeholder}
                                                    size="lg"
                                                    className="!pr-10 !border-gray-300 focus:!border-blue-500"
                                                    {...register(field.name, field.validation)}
                                                    error={!!errors[field.name]}
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <field.icon className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {errors[field.name] && (
                                                <Typography
                                                    variant="small"
                                                    color="red"
                                                    className="mt-1 flex items-center gap-1"
                                                >
                                                    {errors[field.name].message}
                                                </Typography>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <Textarea
                                    label="Camp Description"
                                    placeholder="Provide detailed information about the camp..."
                                    rows={4}
                                    className="!border-gray-300 focus:!border-blue-500"
                                    {...register("description", {
                                        required: "Description is required",
                                    })}
                                    error={!!errors.description}
                                />
                                {errors.description && (
                                    <Typography variant="small" color="red" className="mt-1">
                                        {errors.description.message}
                                    </Typography>
                                )}

                                {/* Image Upload */}
                                <div className="space-y-4">
                                    <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                                        <FaImage className="h-5 w-5" />
                                        Camp Image
                                    </Typography>

                                    {!imageUrl ? (
                                        <label
                                            htmlFor="camp-image"
                                            className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="camp-image"
                                            />
                                            <FaImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                            <Typography variant="h6" className="mb-2">
                                                Upload Camp Image
                                            </Typography>
                                            <Typography variant="small" color="gray" className="mb-4">
                                                Click anywhere in this box to upload
                                            </Typography>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                size="sm"
                                                className="flex items-center gap-2 mx-auto pointer-events-none"
                                                disabled={imageUploading}
                                            >
                                                {imageUploading ? <Spinner message="Uploading Image..." /> : <FaUpload />}
                                                {imageUploading ? "Uploading..." : "Choose Image"}
                                            </Button>
                                        </label>
                                    ) : (
                                        <div className="relative inline-block">
                                            <img
                                                src={imageUrl}
                                                alt="Camp preview"
                                                className="w-full max-w-md h-48 object-cover rounded-xl border-4 border-white shadow-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Note */}
                                <Typography variant="small" className="text-blue-800 bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <strong>Note:</strong> Participant count will automatically start at 0 and increase as people register.
                                </Typography>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4  pt-6 border-t border-gray-200">
                                    <Button
                                    className="px-2"
                                        variant="outlined"
                                        color="gray"
                                        onClick={() => {
                                            reset();
                                            setImageUrl("");
                                        }}
                                        disabled={isLoading}
                                    >
                                        Reset Form
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                                        disabled={isLoading || imageUploading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner size="sm" />
                                                Creating Camp...
                                            </div>
                                        ) : (
                                            <div className="flex items-center px-3 gap-2">
                                                <FaCalendarPlus />
                                                Create Medical Camp
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default AddCamp;
