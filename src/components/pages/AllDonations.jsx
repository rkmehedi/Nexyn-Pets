import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { FaEdit, FaTrashAlt, FaPause, FaPlay } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const DonationCardSkeleton = () => (
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

const AllDonations = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);

    const { data: campaigns = [], isLoading } = useQuery({
        queryKey: ['all-donations'],
        queryFn: async () => (await axiosSecure.get('/admin/donations')).data,
    });

    const deleteMutation = useMutation({
        mutationFn: (campaignId) => axiosSecure.delete(`/admin/donations/${campaignId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-donations'] });
            toast.success("Campaign deleted successfully.");
            setModalOpen(false);
            setCampaignToDelete(null);
        },
    });

    const pauseMutation = useMutation({
        mutationFn: ({ campaignId, isPaused }) => axiosSecure.patch(`/donations/pause/${campaignId}`, { isPaused: !isPaused }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-donations'] });
            toast.success("Campaign status updated.");
        },
    });

    const handleDeleteConfirm = () => {
        if (campaignToDelete) {
            deleteMutation.mutate(campaignToDelete);
        }
    };

    const handleOpenDeleteModal = (campaignId) => {
        setCampaignToDelete(campaignId);
        setModalOpen(true);
    };

    const handlePauseToggle = (campaignId, isPaused) => {
        pauseMutation.mutate({ campaignId, isPaused });
    };

    const columnHelper = createColumnHelper();
    const columns = [
        { accessorKey: '', header: '#', cell: (info) => info.row.index + 1 },
        { accessorKey: 'petName', header: 'Pet Name' },
        { accessorKey: 'ownerName', header: 'Creator' },
        { accessorKey: 'maxDonationAmount', header: 'Max Amount', cell: (info) => `$${info.getValue()}` },
        { accessorKey: 'donatedAmount', header: 'Donated', cell: (info) => `$${info.getValue()}` },
        {
            accessorKey: '_id',
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/donations-edit/${info.getValue()}`}><Button size="xs" color="blue"><FaEdit /></Button></Link>
                    <Button size="xs" color="failure" onClick={() => handleOpenDeleteModal(info.getValue())}><FaTrashAlt /></Button>
                    <Button size="xs" color={info.row.original.isPaused ? "success" : "warning"} onClick={() => handlePauseToggle(info.getValue(), info.row.original.isPaused)}>
                        {info.row.original.isPaused ? <FaPlay /> : <FaPause />}
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: campaigns,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Manage All Donation Campaigns</h2>
                <div className="lg:hidden space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => <DonationCardSkeleton key={i} />)}
                </div>
                <div className="hidden lg:block text-center py-10 text-gray-500 dark:text-gray-400">
                    Loading campaigns...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8">Manage All Donation Campaigns</h2>
            <div className="hidden lg:block overflow-x-auto rounded-lg border dark:border-gray-700">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted()] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="lg:hidden space-y-4">
                {table.getRowModel().rows.map(row => (
                    <div key={row.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-lg">{row.original.petName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Goal: ${row.original.maxDonationAmount}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Creator: {row.original.ownerName}</p>
                        <div className="flex items-center justify-end gap-2">
                            <Link to={`/dashboard/donations-edit/${row.original._id}`}><Button size="xs" color="blue"><FaEdit /></Button></Link>
                            <Button size="xs" color="failure" onClick={() => handleOpenDeleteModal(row.original._id)}><FaTrashAlt /></Button>
                            <Button size="xs" color={row.original.isPaused ? "success" : "warning"} onClick={() => handlePauseToggle(row.original._id, row.original.isPaused)}>
                                {row.original.isPaused ? <FaPlay /> : <FaPause />}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                    <span>Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong></span>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                </div>
            )}

            <Modal show={modalOpen} size="md" onClose={() => setModalOpen(false)} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this campaign?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setModalOpen(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default AllDonations;
