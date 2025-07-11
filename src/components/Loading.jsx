import React from "react";
import { Typography } from "@material-tailwind/react";

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col justify-center items-center text-center py-6 gap-4">
            {/* Animated Medical-themed Spinner */}
            <svg
                className="w-16 h-16 text-blue-600 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                />
            </svg>

            <Typography
                variant="small"
                className="text-sm text-blue-700 font-medium"
            >
                {message}
            </Typography>
        </div>
    );
};

export default Loading;
