import React from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { Button, Spinner, Label } from 'flowbite-react';
import { FaEdit, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import noPhoto from '../../assets/default.jpg';

const Profile = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    const { data: dbUser, isLoading: isDbUserLoading } = useQuery({
        queryKey: ['dbUser', user?.email],
        queryFn: async () => (await axiosSecure.get(`/user/${user.email}`)).data,
        enabled: !!user?.email,
    });

    if (loading || isDbUserLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="xl" /></div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="dark:bg-gray-900 min-h-screen px-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white">My Profile</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                    Welcome to profile page. Here you can manage your profile.
                </p>
            </div>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 mb-4 rounded-full ring-4 ring-[var(--color-accent)] ring-offset-4 ring-offset-white dark:ring-offset-gray-800">
                            <img src={user.photoURL || noPhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{user.displayName}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                        <div>
                            <Label value="Phone Number" />
                            <div className="flex items-center mt-1">
                                <FaPhone className="w-5 h-5 text-[var(--color-accent)] mr-4" />
                                <span className="text-gray-700 dark:text-gray-300">{dbUser?.phone || 'No phone number provided'}</span>
                            </div>
                        </div>
                        <div>
                            <Label value="Address" />
                            <div className="flex items-center mt-1">
                                <FaMapMarkerAlt className="w-5 h-5 text-[var(--color-accent)] mr-4" />
                                <span className="text-gray-700 dark:text-gray-300">{dbUser?.address || 'No address provided'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                        <Link to="/dashboard/edit-profile">
                            <Button className="bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]">
                                <FaEdit className="mr-2 h-5 w-5" /> Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
