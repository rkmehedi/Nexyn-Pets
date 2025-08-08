import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyFooter from '../components/MyFooter';

const MainLayout = () => {
  return (
    <div className='bg-white text-black dark:bg-gray-900 dark:text-white'>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
        <ToastContainer />
      </main>
      <MyFooter/>
    </div>
  );
};

export default MainLayout;
