import React from 'react';
import { FaLock } from 'react-icons/fa';

const NoAccess = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-2xl">
      <div className="flex items-center">
        <FaLock className="mr-2" />
        <div>
          <h3 className="font-bold">Access Denied</h3>
          <p>You don't have admin privileges to access this section.</p>
          <p className="text-sm mt-2">
            Please contact your administrator if you believe this is a mistake.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default NoAccess;
