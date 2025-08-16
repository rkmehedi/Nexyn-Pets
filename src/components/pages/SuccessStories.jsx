import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Card } from 'flowbite-react';
import story1 from '../../assets/story1.jpg';
import story2 from '../../assets/story2.jpg';
import story3 from '../../assets/story3.jpg';

const stories = [
    {
        image: story1,
        petName: 'Luna',
        story: '"We found Luna on Nexyn Pets, She has brought so much joy into our lives. The process was smooth, and we couldn\'t be happier with our furry family member!"',
        adopter: 'The Smith Family'
    },
    {
        image: story2,
        petName: 'Max',
        story: '"Adopting Max was the best decision we ever made. He is a bundle of energy and love. Thank you, Nexyn Pets, for connecting us with our perfect companion."',
        adopter: 'Jane Doe'
    },
    {
        image: story3,
        petName: 'Charlie',
        story: '"Charlie was shy at first, but now he is the king of the house. Finding him through this platform was a wonderful experience from start to finish."',
        adopter: 'John & Sarah'
    }
];

const SuccessStories = () => {
    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white pt-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Fade direction="down" cascade damping={0.1} triggerOnce>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                            Happy Tails: Our Success Stories
                        </h2>
                        <p className="text-lg text-gray-500">
                            Read about some of the wonderful pets who found their forever homes through our platform.
                        </p>
                    </Fade>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <Fade key={index} direction="up" delay={index * 100} triggerOnce>
                            <Card className="h-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <img src={story.image} alt={`Photo of ${story.petName}`} className="w-full h-56 object-cover rounded-t-lg" />
                                <div className="p-5 text-center">
                                    <h3 className="text-2xl font-bold text-[var(--color-accent)] mb-2">{story.petName}</h3>
                                    <blockquote className="text-gray-600 italic mb-4">
                                        {story.story}
                                    </blockquote>
                                    <p className="font-semibold text-gray-800">- {story.adopter}</p>
                                </div>
                            </Card>
                        </Fade>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuccessStories;
