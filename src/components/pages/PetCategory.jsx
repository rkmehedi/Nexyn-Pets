import React from 'react';
import { Link } from 'react-router';
import { TypeAnimation } from 'react-type-animation';
import { Fade } from 'react-awesome-reveal';
import { Card } from 'flowbite-react';
import catImage from '../../assets/cat.jpg';
import dogImage from '../../assets/dog.jpg';
import rabbitImage from '../../assets/rabbit.jpg';
import birdImage from '../../assets/bird.jpg';
import fishImage from '../../assets/fish.jpg';

const categories = [
    { name: 'Cats', image: catImage, link: '/pet-listing?category=cat', description: 'Graceful, independent, and full of personality.' },
    { name: 'Dogs', image: dogImage, link: '/pet-listing?category=dog', description: 'Loyal, playful, and man\'s best friend.' },
    { name: 'Rabbits', image: rabbitImage, link: '/pet-listing?category=rabbit', description: 'Gentle, quiet, and wonderfully soft companions.' },
    { name: 'Birds', image: birdImage, link: '/pet-listing?category=bird', description: 'Vibrant, intelligent, and full of song.' },
    { name: 'Fish', image: fishImage, link: '/pet-listing?category=fish', description: 'Calm, beautiful, and mesmerizing to watch.' },
];

const PetCategory = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center font-bold text-[#7A874E] mb-12">
                <Fade direction="down" cascade damping={0.1} triggerOnce>
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                        Our Awesome Collections
                    </h2>
                    <TypeAnimation
                        sequence={[
                            'Find your perfect cat companion.', 1500,
                            'Discover loyal dogs of all breeds.', 1500,
                            'Adopt a cute and cuddly rabbit.', 1500,
                            'Explore our colorful birds.', 1500,
                        ]}
                        wrapper="span"
                        speed={50}
                        className="text-lg text-gray-500"
                        repeat={Infinity}
                    />
                </Fade>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.map((category, index) => (
                    <Link to={category.link} key={index} className="group">
                        <Card 
                            className="w-full h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-400"
                            renderImage={() => (
                                <div className="relative h-60 overflow-hidden rounded-t-lg">
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 flex items-end justify-center">
                                        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                                    </div>    
                                </div>
                            )}
                        >
                            <p className="font-normal text-gray-700 text-center">
                                {category.description}
                            </p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PetCategory;
