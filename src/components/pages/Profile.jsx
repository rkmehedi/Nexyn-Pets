import React from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { Button, Spinner } from 'flowbite-react';
import { FaEdit } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import noPhoto from '../../assets/default.jpg';

const Profile = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className=" dark:bg-gray-900 py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white">
                    My Profile
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                    Welcome to profile page. Here you can manage your profile.
                </p>
            </div>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 mb-4 rounded-full ring-4 ring-[var(--color-accent)] ring-offset-4 ring-offset-white dark:ring-offset-gray-800">
                            <img
                                src={user.photoURL || noPhoto}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                            {user.displayName}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {user.email}
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                        <div className="mt-6 flex justify-center">
                            <Link to="/dashboard/edit-profile">
                                <Button className="bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]">
                                    <FaEdit className="mr-2 h-5 w-5" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
