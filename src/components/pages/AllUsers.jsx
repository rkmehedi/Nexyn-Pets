import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Button } from 'flowbite-react';
import { FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import noPhoto from '../../assets/default.jpg';

const UserCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>
);

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => (await axiosSecure.get('/users')).data,
    });

    const makeAdminMutation = useMutation({
        mutationFn: (userId) => axiosSecure.patch(`/users/admin/${userId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("User has been promoted to Admin.");
        },
        onError: () => {
            toast.error("Failed to update user role.");
        }
    });

    const handleMakeAdmin = (userId) => {
        makeAdminMutation.mutate(userId);
    };

    const columns = [
        { accessorKey: '', header: '#', cell: (info) => info.row.index + 1 },
        {
            accessorKey: 'image',
            header: 'Image',
            cell: (info) => <img src={info.row.original.image || noPhoto} alt={info.row.original.name} className="w-12 h-12 rounded-full object-cover" />
        },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: (info) =>
                info.getValue() === 'admin' ? (
                    <span className="font-bold text-green-600">Admin</span>
                ) : (
                    <Button size="sm" onClick={() => handleMakeAdmin(info.row.original._id)}>
                        <FaUserShield className="mr-2" /> Make Admin
                    </Button>
                ),
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Manage All Users</h2>
                <div className="lg:hidden space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => <UserCardSkeleton key={i} />)}
                </div>
                <div className="hidden lg:block text-center py-10 text-gray-500 dark:text-gray-400">
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8">Manage All Users</h2>

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
                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                        <div className="flex items-center space-x-4">
                            <img src={row.original.image || noPhoto} alt={row.original.name} className="w-16 h-16 rounded-full object-cover" />
                            <div className="flex-1">
                                <p className="font-bold text-lg">{row.original.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{row.original.email}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end">
                            {row.original.role === 'admin' ? (
                                <span className="font-bold text-green-600">Admin</span>
                            ) : (
                                <Button size="xs" onClick={() => handleMakeAdmin(row.original._id)}>
                                    <FaUserShield className="mr-2" /> Make Admin
                                </Button>
                            )}
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
        </div>
    );
};

export default AllUsers;
