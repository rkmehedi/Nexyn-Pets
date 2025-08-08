import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { FaBars, FaTimes } from 'react-icons/fa';
import {
  Dropdown,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  ToggleSwitch,
} from 'flowbite-react';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo_sm.png';
import noPhoto from '../assets/default.jpg';
import './Mycss.css';

const Navbar = () => {
  const { user, loading, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const handleLogout = () => {
    logOut().catch((error) => console.error(error));
  };

  const handleToggleDarkMode = (value) => {
    setDarkMode(value);
    const root = document.documentElement;
    if (value) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinkClass =
    'px-4 py-1 rounded-[10px] font-normal transition-all duration-300 ease-in-out hover:bg-white/10';

  const authButtonClass =
    'bg-gradient-to-br from-pink-500 to-orange-400 text-white hover:bg-gradient-to-bl hover:from-[#56B4D3] hover:to-[#02AAB0] font-medium rounded-lg text-sm px-4 py-2 text-center';

  return (
    <nav className="bg-[var(--color-primary)] shadow-lg sticky top-0 z-50 border-b-4 border-[var(--color-accent)]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <Link to="/">
            <img src={logo} alt="Nexyn Pets Logo" className="h-12" />
          </Link>
          <ul className="hidden md:flex items-center space-x-4 text-lg text-white font-medium">
            <li>
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/pet-listing" className={navLinkClass}>
                Pet Listing
              </NavLink>
            </li>
            <li>
              <NavLink to="/donation-campaigns" className={navLinkClass}>
                Donation Campaigns
              </NavLink>
            </li>
          </ul>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-white">
              <ToggleSwitch
                checked={darkMode}
                onChange={handleToggleDarkMode}
                label="Dark Mode"
              />
            </div>
            {loading ? (
              <div className="w-12 h-12 rounded-full bg-gray-400 animate-pulse"></div>
            ) : user ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <img
                    src={user.photoURL || noPhoto}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white hover:ring-2 hover:ring-[var(--color-accent)] transition-all"
                    title={user.displayName || 'User'}
                  />
                }
              >
                <DropdownHeader>
                  <span className="block text-sm font-semibold">
                    {user.displayName}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </DropdownHeader>
                <DropdownItem as={Link} to="/dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <button className={authButtonClass}>Login</button>
                </Link>
                <Link to="/register">
                  <button className={authButtonClass}>Register</button>
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden bg-[var(--color-primary)] shadow-lg transition-max-height duration-500 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4 text-lg text-white font-medium">
          <li>
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pet-listing"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Pet Listing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/donation-campaigns"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Donation Campaigns
            </NavLink>
          </li>
        </ul>
        <div className="flex flex-col justify-center items-center py-4 border-t border-gray-500 space-y-3">
          <div className="text-white">
            <ToggleSwitch
              checked={darkMode}
              onChange={handleToggleDarkMode}
              label="Dark Mode"
            />
          </div>
          {loading ? (
            <div className="w-16 h-16 rounded-full bg-gray-400 animate-pulse"></div>
          ) : user ? (
            <div className="text-center">
              <img
                src={user.photoURL || noPhoto}
                alt={user.displayName || 'User'}
                className="w-16 h-16 rounded-full object-cover border-2 border-white mx-auto mb-2"
              />
              <div className="text-white font-semibold mb-2">
                {user.displayName}
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:bg-white/10 w-full rounded-md"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block py-2 text-white hover:bg-white/10 w-full rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className={authButtonClass}>Login</button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className={authButtonClass}>Register</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
