import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Select from 'react-select';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import PetCard from '../PetCard';
import SkeletonLoader from '../SkeletonLoader';
import { TextInput } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';

const petCategories = [
    { value: '', label: 'All Categories' },
    { value: 'cat', label: 'Cat' },
    { value: 'dog', label: 'Dog' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'fish', label: 'Fish' },
    { value: 'bird', label: 'Bird' },
];

const PetListing = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const { ref, inView } = useInView();

    const fetchPets = async ({ pageParam = 0 }) => {
        const res = await axiosPublic.get(`/pets?search=${searchTerm}&category=${category}&page=${pageParam}`);
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
        queryKey: ['pets', searchTerm, category],
        queryFn: fetchPets,
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

    const handleSearch = (e) => {
        e.preventDefault();
        const text = e.target.search.value;
        setSearchTerm(text);
    };

    const pets = data?.pages.flatMap(page => page.pets) ?? [];

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">Meet Your New Best Friend</h2>
                    <p className="text-gray-500 mt-2">Browse our available pets waiting for a loving home.</p>
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
        return <div className="text-center text-red-500 text-xl py-10">Error loading pets: {error.message}</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-lg text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">Meet Your New Best Friend</h2>
                    <p className="text-gray-500 mt-2">Browse our available pets waiting for a loving home.</p>
                    <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
                        <form onSubmit={handleSearch} className="flex-grow w-full md:w-auto md:max-w-md">
                            <TextInput
                                id="search"
                                name="search"
                                placeholder="Search by pet name..."
                                rightIcon={FaSearch}
                                className="w-full"
                            />
                        </form>
                        <Select
                            options={petCategories}
                            onChange={(selectedOption) => setCategory(selectedOption?.value || '')}
                            className="w-full md:w-64 bg-white text-black dark:bg-gray-900 dark:text-white"
                            placeholder="Filter by category..."
                            isClearable
                        />
                    </div>
                </div>

                {pets.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pets.map(pet => (
                                <div key={pet._id} className="hover:shadow-2xl hover:shadow-orange-400 rounded-2xl transition-shadow duration-300">
                                    <PetCard pet={pet} />
                                </div>
                            ))}
                        </div>
                        <div ref={ref} className="text-center py-8">
                            {isFetchingNextPage && <SkeletonLoader />}
                            {!hasNextPage && !isFetchingNextPage && <p className="text-gray-500">You've seen all the pets!</p>}
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                        <h3 className="text-2xl font-semibold text-gray-700">No Pets Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetListing;
