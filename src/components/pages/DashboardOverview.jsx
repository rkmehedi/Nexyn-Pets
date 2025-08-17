import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaUsers, FaPaw, FaDonate, FaPlus, FaHandHoldingHeart } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center">
            <div className="mr-4">{icon}</div>
            <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

const DashboardOverview = () => {
    const { user } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['dashboard-stats', user?.email, isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? '/admin/stats' : `/user/stats/${user.email}`;
            const res = await axiosSecure.get(endpoint);
            return res.data;
        },
        enabled: !isAdminLoading && !!user?.email,
    });

    const adminChartData = [
        { name: 'Users', value: stats.users || 0 },
        { name: 'Pets', value: stats.pets || 0 },
        { name: 'Donations ($)', value: stats.totalDonations || 0 },
    ];

    const userChartData = [
        { name: 'Pets Added', value: stats.petsAdded || 0 },
        { name: 'Campaigns', value: stats.campaignsCreated || 0 },
        { name: 'Donated ($)', value: stats.totalDonated || 0 },
    ];

    if (isLoading || isAdminLoading) {
        return <div className="text-center py-10">Loading dashboard overview...</div>;
    }

    return (
        <div className="space-y-8">
            <Fade direction="down" cascade damping={0.1} triggerOnce>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                    {isAdmin ? 'Admin Overview' : 'My Dashboard'}
                </h2>
            </Fade>

            {isAdmin ? (
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Fade direction="up" triggerOnce><StatCard icon={<FaUsers size={40} />} title="Total Users" value={stats.users} color="from-blue-500 to-blue-700" /></Fade>
                    <Fade direction="up" delay={100} triggerOnce><StatCard icon={<FaPaw size={40} />} title="Total Pets" value={stats.pets} color="from-green-500 to-green-700" /></Fade>
                    <Fade direction="up" delay={200} triggerOnce><StatCard icon={<FaDonate size={40} />} title="Total Donations" value={`$${stats.totalDonations}`} color="from-purple-500 to-purple-700" /></Fade>
                </div>
            ) : (
               
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Fade direction="up" triggerOnce><StatCard icon={<FaPlus size={40} />} title="Pets Added" value={stats.petsAdded} color="from-cyan-500 to-cyan-700" /></Fade>
                    <Fade direction="up" delay={100} triggerOnce><StatCard icon={<FaHandHoldingHeart size={40} />} title="Campaigns Created" value={stats.campaignsCreated} color="from-teal-500 to-teal-700" /></Fade>
                    <Fade direction="up" delay={200} triggerOnce><StatCard icon={<FaDonate size={40} />} title="Total Donated" value={`$${stats.totalDonated}`} color="from-indigo-500 to-indigo-700" /></Fade>
                </div>
            )}

            <Fade direction="up" delay={300} triggerOnce>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Statistics</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={isAdmin ? adminChartData : userChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill={isAdmin ? "#8884d8" : "#82ca9d"} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Fade>
        </div>
    );
};

export default DashboardOverview;
