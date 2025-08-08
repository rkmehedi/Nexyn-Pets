import React from 'react';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';

const InternalErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-300 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-xl text-center space-y-6 p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-5xl font-extrabold text-red-600 dark:text-red-400">
          500 Error
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          We are sorry, but we could not load the data you requested. Try again later or return to the homepage.
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button gradientDuoTone="pinkToOrange" pill>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InternalErrorPage;
