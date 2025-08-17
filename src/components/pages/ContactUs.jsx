import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import Swal from 'sweetalert2';

const ContactUs = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        Swal.fire({
            title: "Message Sent!",
            text: "Thank you for contacting us. We will get back to you shortly.",
            icon: "success"
        });
        reset();
    };

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Fade direction="down" cascade damping={0.1} triggerOnce>
                        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
                            Get In Touch
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            We'd love to hear from you! Send us a message with any questions or inquiries.
                        </p>
                    </Fade>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <Fade direction="left" triggerOnce>
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                                Contact Information
                            </h3>
                            <div className='flex items-center justify-center  '>
                                <div className=''>                            <div className="flex items-start gap-4">
                                <div className="bg-[var(--color-primary)] text-white rounded-full p-4">
                                    <FaMapMarkerAlt className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">Our Address</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Khulna, Bangladesh</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 py-4">
                                <div className="bg-[var(--color-primary)] text-white rounded-full p-4">
                                    <FaEnvelope className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">Email Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400">astermehedi@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-[var(--color-primary)] text-white rounded-full p-4">
                                    <FaPhone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">Call Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400">+8801912716966</p>
                                </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </Fade>

                    <Fade direction="right" triggerOnce>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Send Us a Message</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" value="Your Name" className="dark:text-gray-300" />
                                    <TextInput id="name" placeholder="Enter your full name" {...register("name", { required: "Name is required" })} />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="email" value="Your Email" className="dark:text-gray-300" />
                                    <TextInput id="email" type="email" placeholder="Enter your email address" {...register("email", { required: "A valid email is required" })} />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="message" value="Your Message" className="dark:text-gray-300" />
                                    <Textarea id="message" rows={6} placeholder="Write your message here..." {...register("message", { required: "Message cannot be empty" })} />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                                </div>
                                <Button type="submit" className="w-full bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
