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
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PetCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
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

const AllPets = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);

    const { data: pets = [], isLoading } = useQuery({
        queryKey: ['all-pets'],
        queryFn: async () => (await axiosSecure.get('/admin/pets')).data,
    });

    const deleteMutation = useMutation({
        mutationFn: (petId) => axiosSecure.delete(`/pets/${petId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-pets'] });
            toast.success("Pet removed successfully.");
            setModalOpen(false);
            setPetToDelete(null);
        },
    });

    const adoptMutation = useMutation({
        mutationFn: ({ petId, newStatus }) => axiosSecure.patch(`/pets/adopt/${petId}`, { adopted: newStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-pets'] });
            toast.success("Adoption status updated.");
        },
    });

    const handleDeleteConfirm = () => {
        if (petToDelete) deleteMutation.mutate(petToDelete);
    };

    const handleOpenDeleteModal = (petId) => {
        setPetToDelete(petId);
        setModalOpen(true);
    };

    const handleAdoptToggle = (petId, currentStatus) => {
        adoptMutation.mutate({ petId, newStatus: !currentStatus });
    };

    const columnHelper = createColumnHelper();
    const columns = [
        { accessorKey: '', header: '#', cell: (info) => info.row.index + 1 },
        { accessorKey: 'petName', header: 'Name' },
        { accessorKey: 'ownerName', header: 'Owner' },
        {
            accessorKey: 'adopted',
            header: 'Status',
            cell: (info) => info.getValue() ?
                <span className="text-green-800 bg-green-200 px-2 py-1 rounded-full text-xs font-medium">Adopted</span> :
                <span className="text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full text-xs font-medium">Not Adopted</span>
        },
        {
            accessorKey: '_id',
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/update-pet/${info.getValue()}`}><Button size="xs" color="blue"><FaEdit /></Button></Link>
                    <Button size="xs" color="failure" onClick={() => handleOpenDeleteModal(info.getValue())}><FaTrashAlt /></Button>
                    <Button size="xs" color={info.row.original.adopted ? "warning" : "success"} onClick={() => handleAdoptToggle(info.getValue(), info.row.original.adopted)}>
                        {info.row.original.adopted ? <FaTimesCircle /> : <FaCheckCircle />}
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: pets,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Manage All Pets</h2>
                <div className="lg:hidden space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => <PetCardSkeleton key={i} />)}
                </div>
                <div className="hidden lg:block text-center py-10 text-gray-500 dark:text-gray-400">
                    Loading pets...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8">Manage All Pets</h2>
            
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
                            {row.original.adopted ? 
                                <span className="text-green-800 bg-green-200 px-2 py-1 rounded-full text-xs font-medium">Adopted</span> :
                                <span className="text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full text-xs font-medium">Not Adopted</span>
                            }
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Owner: {row.original.ownerName}</p>
                        <div className="flex items-center justify-end gap-2">
                            <Link to={`/dashboard/update-pet/${row.original._id}`}><Button size="xs" color="blue"><FaEdit /></Button></Link>
                            <Button size="xs" color="failure" onClick={() => handleOpenDeleteModal(row.original._id)}><FaTrashAlt /></Button>
                            <Button size="xs" color={row.original.adopted ? "warning" : "success"} onClick={() => handleAdoptToggle(row.original._id, row.original.adopted)}>
                                {row.original.adopted ? <FaTimesCircle /> : <FaCheckCircle />}
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
                            Are you sure you want to delete this pet?
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

export default AllPets;
