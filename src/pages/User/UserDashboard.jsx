import React from 'react';
import { Typography } from '@material-tailwind/react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-md p-10 rounded-xl text-center">
        <Typography variant="h4" className="mb-4 text-blue-700">
          Welcome to Your Dashboard!
        </Typography>
        <Typography variant="paragraph" className="text-gray-600">
          You have successfully registered and logged in.
        </Typography>
      </div>
    </div>
  );
};

export default UserDashboard;
