import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { FaHeart, FaShieldAlt, FaPlayCircle, FaUtensils } from 'react-icons/fa';

const tips = [
    {
        icon: FaUtensils,
        title: 'Proper Nutrition',
        description: 'A balanced diet is crucial for your pet\'s health. Ensure they have access to fresh water and high-quality food appropriate for their age and breed.'
    },
    {
        icon: FaPlayCircle,
        title: 'Regular Exercise',
        description: 'Daily walks, playtime, and mental stimulation are essential to keep your pet happy, healthy, and well-behaved Thats much Important.'
    },
    {
        icon: FaHeart,
        title: 'Lots of Love',
        description: 'Pets thrive on affection. Regular cuddles, praise, and quality time together will strengthen your bond and build a trusting relationship.'
    },
    {
        icon: FaShieldAlt,
        title: 'Veterinary Care',
        description: 'Regular check-ups, vaccinations, and preventative treatments are key to a long and healthy life for your furry friend.'
    }
];

const PetCareTips = () => {
    return (
        <div className="bg-white dark:bg-gray-900 pt-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Fade direction="down" cascade damping={0.1} triggerOnce>
                        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
                            Caring for Your New Friend
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            Adopting a pet is a rewarding journey. Here are a few tips to help you provide the best possible care for your new companion.
                        </p>
                    </Fade>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tips.map((tip, index) => (
                        <Fade key={index} direction="up" delay={index * 100} triggerOnce>
                            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-[var(--color-primary)] text-white rounded-full p-5">
                                        <tip.icon className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{tip.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PetCareTips;
