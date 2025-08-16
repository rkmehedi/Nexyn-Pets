import React from 'react';
import { Link } from 'react-router';
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import logo from '../assets/logo_footer.png';

const MyFooter = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-white border-t-4 border-[var(--color-accent)] ">
      <div className="w-full container mx-auto p-8 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} className="h-20 mr-3" alt="Nexyn Pets Logo" />
              <span className="text-2xl font-semibold text-white">Nexyn Pet House</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              We connect loving homes with pets in need. Our goal is to make pet adoption
              easier, faster, and more joyful for everyone involved.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/pet-listing" className="hover:text-white transition">Pet Listing</Link></li>
              <li><Link to="/donation-campaigns" className="hover:text-white transition">Donations</Link></li>
              <li><Link to="/login" className="hover:text-white transition">SignIn Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white">Connect</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="https://github.com/rkmehedi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/astermehedi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a></li>
              <li><a href="/contact-us" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 my-10"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-300 text-sm">&copy; {new Date().getFullYear()} Nexyn Pet House™. All rights reserved.</p>

          <div className="flex space-x-5 text-white">
            <a href="https://facebook.com/astermehedi" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition">
              <FaFacebook size={20} />
            </a>
            <a href="https://www.linkedin.com/in/astermehedi" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition">
              <FaLinkedin size={20} />
            </a>
            <a href="https://github.com/rkmehedi" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition">
              <FaGithub size={20} />
            </a>
            <a href="https://wa.me/8801912716966" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition">
              <FaWhatsapp size={20} />
            </a>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;
