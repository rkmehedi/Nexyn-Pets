import React from 'react';
import { Button, TextInput } from 'flowbite-react';
import { Fade } from 'react-awesome-reveal';
import { FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Newsletter = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: `Thank you for subscribing, ${email}!`,
            confirmButtonColor: '#02AAB0'
        });
        e.target.reset();
    };

    return (
        <div className="">
            <div className="container mx-auto px-4 py-13">
                <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-8 sm:p-12 rounded-2xl shadow-xl text-center">
                    <Fade direction="down" cascade damping={0.1} triggerOnce>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                            Join Our Community
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                            Subscribe to our newsletter to receive the latest news, updates, and heartwarming stories directly in your inbox. Be the first to know about new pets available for adoption.
                        </p>
                    </Fade>
                    <Fade direction="up" triggerOnce>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <TextInput
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                required
                                className="flex-grow"
                                size="lg"
                            />
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]"
                            >
                                <FaPaperPlane className="mr-2 h-5 w-5" />
                                Subscribe
                            </Button>
                        </form>
                    </Fade>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
