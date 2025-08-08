import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import DonationCard from '../DonationCard';
import SkeletonLoader from '../SkeletonLoader';

const DonationCampaigns = () => {
    const axiosPublic = useAxiosPublic();
    const { ref, inView } = useInView();

    const fetchCampaigns = async ({ pageParam = 0 }) => {
        const res = await axiosPublic.get(`/donations?page=${pageParam}`);
        return res.data;
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['donations'],
        queryFn: fetchCampaigns,
        getNextPageParam: (lastPage) => {
            if (lastPage.currentPage < lastPage.totalPages - 1) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const campaigns = data?.pages.flatMap(page => page.campaigns) ?? [];

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-4">
                <div className="bg-white py-8 rounded-2xl shadow-lg text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">Support a Pet in Need</h2>
                    <p className="text-gray-500 mt-2">Browse our active donation campaigns and make a difference.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">Error loading donation campaigns: {error.message}</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-lg text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">Support a Pet in Need</h2>
                    <p className="text-gray-500 mt-2">Browse our active donation campaigns and make a difference.</p>
                </div>

                {campaigns.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map(campaign => (
                                <div key={campaign._id} >
                                    <DonationCard campaign={campaign} />
                                </div>
                            ))}
                        </div>
                        <div ref={ref} className="text-center py-8">
                            {isFetchingNextPage && <SkeletonLoader />}
                            {!hasNextPage && !isFetchingNextPage && <p className="text-gray-500">You've seen all donation campaigns!</p>}
                        </div>
                    </>
                ) : (
                    <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-lg text-center">
                        <h3 className="text-2xl font-semibold text-gray-700">No Active Donation Campaigns</h3>
                        <p className="text-gray-500 mt-2">Please check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationCampaigns;
