import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const DonationCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>
);

const MyDonations = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: donations = [], isLoading } = useQuery({
        queryKey: ['my-donations', user?.email],
        queryFn: async () => (await axiosSecure.get(`/payments/${user.email}`)).data,
        enabled: !!user?.email,
    });

    const refundMutation = useMutation({
        mutationFn: (donationId) => axiosSecure.delete(`/payments/${donationId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-donations', user?.email] });
            toast.success("Your donation has been refunded.");
        },
        onError: () => {
            toast.error("Failed to process refund. Please try again.");
        }
    });

    const handleRefund = (donationId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will refund your donation. This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, refund it!"
        }).then((result) => {
            if (result.isConfirmed) {
                refundMutation.mutate(donationId);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg mt-12">
                <h2 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">My Donation History</h2>
                <div className="lg:hidden space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <DonationCardSkeleton key={i} />)}
                </div>
                <div className="hidden lg:block text-center text-gray-500 dark:text-gray-400 text-xl">
                    Loading your donation history...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto bg-white text-black dark:bg-gray-900 dark:text-white p-10 rounded-xl shadow-xl mt-12">
            <h2 className="text-4xl font-bold text-center mb-10">My Donation History</h2>
            
            <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                <table className="min-w-full table-auto text-lg">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">#</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Pet Image</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Pet Name</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Donated Amount</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {donations.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">You have not made any donations yet.</td></tr>
                        ) : (
                            donations.map((donation, index) => (
                                <tr key={donation._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <img src={donation.petImage} alt={donation.petName} className="w-20 h-20 object-cover rounded-lg" />
                                    </td>
                                    <td className="px-6 py-4 font-medium">{donation.petName}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">${donation.donationAmount}</td>
                                    <td className="px-6 py-4">
                                        <Button size="sm" color="failure" onClick={() => handleRefund(donation._id)}>
                                            <FaTrashAlt className="mr-2" /> Ask for a refund
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="lg:hidden space-y-4">
                {donations.length === 0 ? (
                    <p className="text-center py-10 text-gray-500 dark:text-gray-400">You have not made any donations yet.</p>
                ) : (
                    donations.map((donation) => (
                        <div key={donation._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex items-center space-x-4">
                                <img src={donation.petImage} alt={donation.petName} className="w-16 h-16 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{donation.petName}</p>
                                    <p className="text-green-600 font-semibold">${donation.donationAmount}</p>
                                </div>
                                <Button size="xs" color="failure" onClick={() => handleRefund(donation._id)}>
                                    Refund
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyDonations;
