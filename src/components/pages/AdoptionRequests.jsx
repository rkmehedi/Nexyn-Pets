import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Button } from 'flowbite-react';

const RequestCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
        <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
    </div>
);

const AdoptionRequests = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['adoption-requests', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/adoptions/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const acceptMutation = useMutation({
        mutationFn: (request) =>
            axiosSecure.patch(`/adoptions/accept/${request._id}`, { petId: request.petId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adoption-requests', user?.email] });
            queryClient.invalidateQueries({ queryKey: ['my-pets', user?.email] });
            toast.success('Adoption request accepted!');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (requestId) =>
            axiosSecure.patch(`/adoptions/reject/${requestId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adoption-requests', user?.email] });
            toast.info('Adoption request rejected.');
        },
    });

    const handleAccept = (request) => {
        acceptMutation.mutate(request);
    };

    const handleReject = (requestId) => {
        rejectMutation.mutate(requestId);
    };

    if (isLoading) {
        return (
            <div className="max-w-full mx-auto bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg mt-12">
                <h2 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">Adoption Requests</h2>
                <div className="lg:hidden space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <RequestCardSkeleton key={i} />)}
                </div>
                <div className="hidden lg:block text-center text-gray-500 dark:text-gray-400 text-xl">
                    Loading requests...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto bg-white text-black dark:bg-gray-900 dark:text-white p-6  rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8">Adoption Requests</h2>
            <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                <table className="min-w-full table-auto text-lg">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">#</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Name</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Email</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Phone</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Address</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Pet</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Status</th>
                            <th className="px-6 py-4 border-b dark:border-gray-700 text-left text-xl font-semibold text-gray-800 dark:text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-gray-500 dark:text-gray-400 text-xl">
                                    No pending adoption requests.
                                </td>
                            </tr>
                        ) : (
                            requests.map((request, index) => (
                                <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{request.userName}</td>
                                    <td className="px-6 py-4">{request.userEmail}</td>
                                    <td className="px-6 py-4">{request.userPhone}</td>
                                    <td className="px-6 py-4">{request.userAddress}</td>
                                    <td className="px-6 py-4">{request.petName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`capitalize font-semibold px-3 py-1 rounded-full text-sm ${
                                            request.status === 'accepted' ? 'bg-green-200 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                                            'bg-yellow-200 text-yellow-800'
                                        }`}>{request.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.status === 'pending' && (
                                            <div className="flex items-center gap-3">
                                                <Button size="xs" color="success" onClick={() => handleAccept(request)}><FaCheck /></Button>
                                                <Button size="xs" color="failure" onClick={() => handleReject(request._id)}><FaTimes /></Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="lg:hidden space-y-4">
                {requests.length === 0 ? (
                    <p className="text-center py-10 text-gray-500 dark:text-gray-400">No pending adoption requests.</p>
                ) : (
                    requests.map((request) => (
                        <div key={request._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-lg">{request.userName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        wants to adopt <span className="font-semibold">{request.petName}</span>
                                    </p>
                                </div>
                                <span className={`capitalize font-semibold px-2 py-1 rounded-full text-xs ${
                                    request.status === 'accepted' ? 'bg-green-200 text-green-800' :
                                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                                    'bg-yellow-200 text-yellow-800'
                                }`}>{request.status}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                <p><strong>Email:</strong> {request.userEmail}</p>
                                <p><strong>Phone:</strong> {request.userPhone}</p>
                                <p><strong>Address:</strong> {request.userAddress}</p>
                            </div>
                            {request.status === 'pending' && (
                                <div className="flex items-center justify-end gap-3">
                                    <Button size="xs" color="success" onClick={() => handleAccept(request)}>Accept</Button>
                                    <Button size="xs" color="failure" onClick={() => handleReject(request._id)}>Reject</Button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdoptionRequests;
