import React from 'react';
import { Link, useRouteError } from 'react-router';
import { Button } from 'flowbite-react';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-800 text-center px-4 text-white">
            <FaExclamationTriangle className="w-24 h-24 text-white/80 mb-8 animate-pulse" />
            <h1 className="text-6xl font-extrabold mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                Oops!
            </h1>
            <h2 className="text-3xl font-bold mb-2" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                {error?.status === 404 ? '404 Page Not Found' : 'Something Went Wrong'}
            </h2>
            <p className="text-gray-200 mb-8 max-w-md">
                {error?.status === 404 
                    ? "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
                    : "An unexpected error occurred. Please try again later or contact support."
                }
            </p>
            {error && (
                <p className="text-sm text-gray-300 italic mb-8">
                    <i>{error.statusText || error.message}</i>
                </p>
            )}
            <Link to="/">
                <Button 
                    size="lg" 
                    className="bg-white text-red-700 font-bold enabled:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    <FaHome className="mr-2 h-5 w-5" />
                    Go Back Home
                </Button>
            </Link>
        </div>
    );
};

export default ErrorPage;
