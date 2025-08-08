import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Button, Modal, ModalBody, ModalHeader, Progress } from 'flowbite-react';
import { FaEdit, FaPause, FaPlay, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CampaignCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    </div>
);

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isDonatorsModalOpen, setIsDonatorsModalOpen] = useState(false);
  const [selectedCampaignDonators, setSelectedCampaignDonators] = useState([]);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['my-donation-campaigns', user?.email],
    queryFn: async () => (await axiosSecure.get(`/donations/user/${user.email}`)).data,
    enabled: !!user?.email,
  });

  const pauseMutation = useMutation({
    mutationFn: ({ campaignId, isPaused }) => axiosSecure.patch(`/donations/pause/${campaignId}`, { isPaused: !isPaused }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-donation-campaigns', user?.email] });
      toast.success("Campaign status updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update campaign status.");
    },
  });

  const handlePauseToggle = (campaignId, isPaused) => {
    pauseMutation.mutate({ campaignId, isPaused });
  };

  const handleViewDonators = async (campaignId) => {
    try {
      const res = await axiosSecure.get(`/donations/donators/${campaignId}`);
      setSelectedCampaignDonators(res.data);
      setIsDonatorsModalOpen(true);
    } catch (error) {
      toast.error("Could not fetch the list of donators.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg mt-12">
        <h2 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">My Donation Campaigns</h2>
        <div className="lg:hidden space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <CampaignCardSkeleton key={i} />)}
        </div>
        <div className="hidden lg:block text-center text-gray-500 dark:text-gray-400 text-xl">
            Loading your campaigns...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white text-black dark:bg-gray-900 dark:text-white p-10 rounded-xl shadow-xl mt-12">
      <h2 className="text-4xl font-bold text-center mb-10">My Donation Campaigns</h2>
      
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
        <table className="min-w-full table-auto text-lg">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">#</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Pet Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Max Donation</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Donated Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Progress</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {campaigns.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-500 dark:text-gray-400">No campaigns found.</td></tr>
            ) : (
              campaigns.map((campaign, index) => {
                const percentage = Math.round((campaign.donatedAmount / campaign.maxDonationAmount) * 100);
                return (
                  <tr key={campaign._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{campaign.petName}</td>
                    <td className="px-6 py-4">${campaign.maxDonationAmount}</td>
                    <td className="px-6 py-4">${campaign.donatedAmount}</td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Donation Progress {percentage}%
                        </span>
                        <Progress progress={percentage} color="green" size="xl" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/dashboard/donations-edit/${campaign._id}`}><Button size="sm" color="blue" className="flex items-center gap-2"><FaEdit /> Edit</Button></Link>
                        <Button size="sm" color={campaign.isPaused ? "success" : "warning"} onClick={() => handlePauseToggle(campaign._id, campaign.isPaused)} className="flex items-center gap-2">
                          {campaign.isPaused ? <FaPlay /> : <FaPause />} {campaign.isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button size="sm" color="gray" onClick={() => handleViewDonators(campaign._id)} className="flex items-center gap-2"><FaEye /> View Donators</Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {campaigns.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">No campaigns found.</p>
        ) : (
            campaigns.map((campaign) => {
                const percentage = Math.round((campaign.donatedAmount / campaign.maxDonationAmount) * 100);
                return (
                    <div key={campaign._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-lg">{campaign.petName}</p>
                            <p className="text-sm font-semibold">Goal: ${campaign.maxDonationAmount}</p>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Progress: ${campaign.donatedAmount} ({percentage}%)
                            </span>
                            <Progress progress={percentage} color="green" size="md" />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Link to={`/dashboard/edit-donation/${campaign._id}`}><Button size="xs" color="blue"><FaEdit /></Button></Link>
                            <Button size="xs" color={campaign.isPaused ? "success" : "warning"} onClick={() => handlePauseToggle(campaign._id, campaign.isPaused)}>
                                {campaign.isPaused ? <FaPlay /> : <FaPause />}
                            </Button>
                            <Button size="xs" color="gray" onClick={() => handleViewDonators(campaign._id)}><FaEye /></Button>
                        </div>
                    </div>
                )
            })
        )}
      </div>

      <Modal show={isDonatorsModalOpen} size="md" onClose={() => setIsDonatorsModalOpen(false)} popup>
        <ModalHeader>Donators List</ModalHeader>
        <ModalBody>
          {selectedCampaignDonators.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {selectedCampaignDonators.map((donator, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{donator.donatorName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{donator.donatorEmail}</p>
                  </div>
                  <span className="font-bold text-green-600 text-lg">${donator.donationAmount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No donations have been made for this campaign yet.</p>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default MyDonationCampaigns;
