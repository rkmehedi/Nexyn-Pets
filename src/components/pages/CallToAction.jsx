import React from 'react';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';
import { Fade } from 'react-awesome-reveal';
import ctaImage from '../../assets/cta-background.jpg'; 

const CallToAction = () => {
    return (
        <div className="container mx-auto px-4 pt-16">
            <h2 className="text-4xl text-center font-extrabold mb-2 text-gray-800">

                        Never Leave them Alone
                    </h2>
                    <p className="text-lg text-gray-500 max-w-auto text-center mx-auto  pb-12">
                           Even the smallest help can change a life.
Stand beside them,because your presence is their strength.   </p>
            <div 
                className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl py-20 px-8 text-center"
                style={{ backgroundImage: `url(${ctaImage})` }}
            >
                
                <div className="relative z-10">
                    <Fade direction="down" cascade damping={0.1} triggerOnce>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                            Your New Best Friend is Waiting
                        </h2>
                        <p className="text-2xl text-white max-w-3xl mx-auto mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                            Every pet deserves a loving home. By choosing to adopt, you're not just getting a pet—you're saving a life and gaining a loyal companion. Take the next step on this rewarding journey.
                        </p>
                    </Fade>
                    <Fade direction="up" triggerOnce>
                        <Link to="/pet-listing">
                            <Button 
                                size="xl" 
                                className="bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0] transition-all duration-300 transform hover:scale-105 ring-2 ring-white/50 hover:ring-white shadow-lg"
                            >
                                See All Adoptable Pets
                            </Button>
                        </Link>
                    </Fade>
                </div>
            </div>
        </div>
    );
};

export default CallToAction;
