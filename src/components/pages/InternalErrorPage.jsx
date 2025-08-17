import React from 'react';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';

const InternalErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-accent)] px-4">
      <div className="max-w-xl text-center space-y-6 p-8 backdrop-blur-md">
        <h1 className="text-5xl font-extrabold ">
          500 Error
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-800 ">
          We are sorry, but we could not load the data you requested. Try again later or return to the homepage.
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button gradientDuoTone="pinkToOrange" className='bg-[var(--color-primary)]  font-bold enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0] transition-all duration-300 transform hover:scale-105 shadow-lg' pill>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InternalErrorPage;
