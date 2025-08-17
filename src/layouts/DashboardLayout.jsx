import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaHome, FaPlus, FaList, FaDonate, FaQuestionCircle,
  FaBars, FaTimes, FaHandHoldingHeart, FaUsers, FaPaw, FaShieldAlt,
  FaUserFriends, FaChartBar
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isAdmin] = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const menuLink = (to, icon, text) => (
    <li>
      <NavLink
        to={to}
        onClick={closeSidebar}
        className="flex items-center p-2 rounded-lg transition-colors duration-200"
        end
      >
        {icon}
        <span className="ml-3">{text}</span>
      </NavLink>
    </li>
  );

  const userLinks = (
    <>
      <li className="px-2 pt-4 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
        <FaUsers className="text-sm" /> User Panel
      </li>
      {menuLink('/dashboard/overview', <FaChartBar />, 'Overview')}
      {menuLink('/dashboard/edit-profile', <FaUserFriends />, 'Edit Profile')}
      {menuLink('/dashboard/add-pet', <FaPlus />, 'Add a Pet')}
      {menuLink('/dashboard/my-added-pets', <FaList />, 'My Added Pets')}
      {menuLink('/dashboard/adoption-requests', <FaQuestionCircle />, 'Adoption Requests')}
      {menuLink('/dashboard/create-donation-campaign', <FaDonate />, 'Create Donation Campaign')}
      {menuLink('/dashboard/my-donation-campaigns', <FaHandHoldingHeart />, 'My Donation Campaigns')}
      {menuLink('/dashboard/my-donations', <FaDonate />, 'My Donations')}
    </>
  );

  const adminLinks = (
    <>
      <li className="px-2 pt-4 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
        <FaShieldAlt className="text-sm" /> Admin Panel
      </li>
      {menuLink('/dashboard/admin/users', <FaUsers />, 'All Users')}
      {menuLink('/dashboard/admin/all-pets', <FaPaw />, 'All Pets')}
      {menuLink('/dashboard/admin/all-donations', <FaDonate />, 'All Donations')}
    </>
  );

  return (
    <div className="relative min-h-screen md:flex bg-white text-black dark:bg-gray-900 dark:text-white ">
      <div className="md:hidden flex justify-between items-center bg-gray-800 text-white p-4 sticky top-0 z-50 shadow">
        <NavLink to="/" className="text-xl font-bold">Nexyn Pets</NavLink>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-700 text-2xl font-bold">
          <NavLink to="/" onClick={closeSidebar}>Nexyn Pets</NavLink>
        </div>
        <ul className="space-y-1 p-4 overflow-y-auto flex-1">
          {isAdmin && (
            <>
              {adminLinks}
              <div className="my-3 border-t border-gray-600"></div>
            </>
          )}
          {userLinks}
          <div className="my-3 border-t border-gray-600"></div>
          {menuLink('/', <FaHome />, 'Home')}
        </ul>
        <div className="p-4 border-t border-gray-700 flex items-center gap-3">
          <img src={user?.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover" />
          <div className="text-sm">
            <p className="font-semibold">{user?.displayName}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        <div className="hidden md:flex justify-end items-center bg-white text-black dark:bg-gray-900 dark:text-white p-4 shadow sticky top-0 z-40">
          <span className="text-gray-700 bg-white dark:bg-gray-900 dark:text-white font-semibold mr-4 ">Welcome, {user?.displayName}</span>
          <img src={user?.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover" />
        </div>

        <main className="p-4 md:p-8 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
