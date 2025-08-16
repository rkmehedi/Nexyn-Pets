import React from 'react';
import { Fade } from 'react-awesome-reveal';
import aboutImage from '../../assets/about-us.jpg';

const AboutUs = () => {
    return (
        <div className="pt-16">
            <h2 className="text-4xl text-center font-extrabold text-gray-800 pb-2">
                Nexyn Pets Where Every Pet Finds a Family
            </h2>
            <p className="text-lg text-gray-500 max-w-auto text-center mx-auto  pb-12">
                           Because no pet should ever feel alone, your love can give them a forever home.</p>
            <div className="container mx-auto px-4 ">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="overflow-hidden rounded-2xl shadow-xl">
                        <Fade direction="left" triggerOnce>
                            <img 
                                src={aboutImage} 
                                alt="A happy pet with its new owner" 
                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                            />
                        </Fade>
                    </div>
                    <div>
                        <Fade direction="right" cascade damping={0.1} triggerOnce>
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                                About Us: A Loving Home for Every Pet
                            </h2>
                            <p className="text-gray-600 mb-2 text-lg">
                                At Nexyn Pet House, we believe every pet deserves a chance at a happy, loving life. Our platform was created to bridge the gap between pets in need and compassionate individuals ready to open their hearts and homes.
                            </p>
                            <p className="text-gray-600 mb-6">
                                We make the adoption process simple, transparent, and joyful. By connecting shelters, rescuers, and pet owners with potential adopters, we create a community dedicated to animal welfare. Join us in our mission to ensure no pet is left behind.
                            </p>
                        </Fade>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
