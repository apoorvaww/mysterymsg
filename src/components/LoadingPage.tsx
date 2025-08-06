import React from "react";
// If you have lucide-react installed, you can use Loader2 like this:
// import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black px-4">
      <div className="flex flex-col items-center space-y-4">
        {" "}
        {/* Added space-y-4 for vertical spacing */}
        {/* Loading Spinner */}
        <svg
          className="animate-spin h-16 w-16 text-blue-600 dark:text-purple-400" // Increased size, added color
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white">
          Redirecting you
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
