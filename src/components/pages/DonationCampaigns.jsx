import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import DonationCard from '../DonationCard';
import SkeletonLoader from '../SkeletonLoader';

const DonationCampaigns = () => {
    const axiosPublic = useAxiosPublic();
    const { ref, inView } = useInView();
    const [sortBy, setSortBy] = useState('lastDateOfDonation');
    const [sortOrder, setSortOrder] = useState('desc');
    const [menuOpen, setMenuOpen] = useState(false);

    const fetchCampaigns = async ({ pageParam = 0 }) => {
        const res = await axiosPublic.get(`/donations?page=${pageParam}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        return res.data;
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['donations', sortBy, sortOrder],
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
    
    useEffect(() => {
        refetch();
    }, [sortBy, sortOrder, refetch]);

    const campaigns = data?.pages.flatMap(page => page.campaigns) ?? [];

    const applySort = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
        setMenuOpen(false);
    };

    const currentSortLabel = () => {
        if (sortBy === 'lastDateOfDonation' && sortOrder === 'desc') return 'Date (Newest First)';
        if (sortBy === 'lastDateOfDonation' && sortOrder === 'asc') return 'Date (Oldest First)';
        if (sortBy === 'petName' && sortOrder === 'asc') return 'Name (A → Z)';
        if (sortBy === 'petName' && sortOrder === 'desc') return 'Name (Z → A)';
        return 'Sort Options';
    };

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

                <div className="flex justify-end mb-8">
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0] shadow"
                        >
                            {currentSortLabel()}
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                                <div className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Sort By</div>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => applySort('lastDateOfDonation', 'desc')}
                                >
                                    Date (Newest First)
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => applySort('lastDateOfDonation', 'asc')}
                                >
                                    Date (Oldest First)
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => applySort('petName', 'asc')}
                                >
                                    Name (A → Z)
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => applySort('petName', 'desc')}
                                >
                                    Name (Z → A)
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {campaigns.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map(campaign => (
                                <div className='' key={campaign._id} >
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
