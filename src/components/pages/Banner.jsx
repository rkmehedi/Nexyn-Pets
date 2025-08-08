import React from 'react';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';
import bannerImage from '../../assets/banner.jpg';

const Banner = () => {
    return (
        <div 
            className="relative bg-cover bg-center h-[600px] rounded-2xl overflow-hidden shadow-2xl" 
            style={{ backgroundImage: `url(${bannerImage})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                <h1 
                    className="text-4xl md:text-6xl font-extrabold leading-tight mb-4" 
                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                >
                    Find Your New Best Friend
                </h1>
                <p 
                    className="text-lg md:text-xl max-w-2xl mb-8" 
                    style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                >
                    Thousands of adorable pets are waiting for a loving home. Open your heart and home to a furry friend today.
                </p>
                <div>
                    <Link to="/pet-listing">
                        <Button 
                            size="xl" 
                            className="bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0] transition-all duration-300 transform hover:scale-105 ring-2 ring-white/50 hover:ring-white shadow-lg"
                        >
                            Adopt a Pet Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;
