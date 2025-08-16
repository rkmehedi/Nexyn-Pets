import React from 'react';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';
import { Fade } from 'react-awesome-reveal';
import { FaHeart, FaShieldAlt, FaGift } from 'react-icons/fa';

const SupportOurPets = () => {
    const supportSteps = [
        {
            icon: FaHeart,
            title: 'Give with Heart',
            description: 'Your donation provides essential medical care, nutritious food, and a safe place for pets to stay while they wait for their forever home.'
        },
        {
            icon: FaShieldAlt,
            title: 'Become a Guardian',
            description: 'By contributing, you become a guardian angel for a pet in need, offering them protection, comfort, and a second chance at happiness.'
        },
        {
            icon: FaGift,
            title: 'Share the Love',
            description: 'Every gift, no matter the size, is a powerful act of kindness that directly supports our mission to save and rehome vulnerable animals.'
        }
    ];

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white pt-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Fade direction="down" cascade damping={0.1} triggerOnce>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                            Can't Adopt? You Can Still Help!
                        </h2>
                        <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                            Not everyone is in a position to adopt, but every pet lover can make a difference. Your donation is a lifeline for pets in need.
                        </p>
                    </Fade>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {supportSteps.map((step, index) => (
                        <Fade key={index} direction="up" delay={index * 100} triggerOnce>
                            <div className="p-8 bg-white text-black dark:bg-gray-900 dark:text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-[var(--color-accent)] text-white rounded-full p-5">
                                        <step.icon className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
                <div className='justify-center items-center'>
                <Fade direction="up" triggerOnce>
  <div className="mt-12 flex justify-center">
    <Link to="/donation-campaigns">
      <Button
        size="xl"
        className="bg-[#B8734A] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0] transition-all duration-300 transform hover:scale-105"
      >
        Support a Campaign
      </Button>
    </Link>
  </div>
</Fade>
                </div>
            </div>
        </div>
    );
};

export default SupportOurPets;
