import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    if (loading || isAdminLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Verifying Admin Access...</p>
            </div>
        );
    }

    if (user && isAdmin) {
        return children;
    }

    if (!location.state?.fromAdminRoute) {
        Swal.fire({
            title: "Forbidden Access!",
            text: "You do not have permission to view this page. Redirecting to your dashboard.",
            icon: "error",
            timer: 2500,
            showConfirmButton: false
        });
    }

    return <Navigate to="/dashboard" state={{ fromAdminRoute: true }} replace />;
};

export default AdminRoute;
