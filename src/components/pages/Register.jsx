import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import registerImage from '../../assets/login_img.jpg';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const Register = () => {
    const { createUser, updateUserProfile, signInWithGoogle, signInWithGitHub, loading, setLoading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleRegistrationSuccess = () => {
        setLoading(false);
        Swal.fire({
            title: "Registration Successful!",
            text: "Your account has been created.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        navigate('/');
    };

    const handleSocialLogin = (socialProvider) => {
        socialProvider()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    image: result.user?.photoURL,
                    role: 'user'
                };
                axiosPublic.post('/users', userInfo)
                    .then(() => {
                        handleRegistrationSuccess();
                    });
            })
            .catch(error => {
                toast.error("An error occurred during social login. Please try again.");
                setLoading(false);
            });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const imageFile = { image: data.image[0] };
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });

        if (res.data.success) {
            createUser(data.email, data.password)
                .then(() => {
                    updateUserProfile(data.name, res.data.data.display_url)
                        .then(() => {
                            const userInfo = {
                                name: data.name,
                                email: data.email,
                                image: res.data.data.display_url,
                                role: 'user'
                            };
                            axiosPublic.post('/users', userInfo)
                                .then(res => {
                                    if (res.data.insertedId) {
                                        reset();
                                        setFileName(null);
                                        handleRegistrationSuccess();
                                    }
                                });
                        });
                })
                .catch(error => {
                    let errorMessage = "An unexpected error occurred. Please try again.";
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = "This email is already registered. Please log in.";
                            break;
                        case 'auth/weak-password':
                            errorMessage = "The password is too weak. Please use a stronger password.";
                            break;
                        default:
                            break;
                    }
                    toast.error(errorMessage);
                    setLoading(false);
                });
        } else {
            toast.error("Image upload failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="relative flex w-full max-w-4xl mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="hidden md:block md:w-1/2">
                    <img
                        src={registerImage}
                        alt="A happy pet"
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="w-full p-8 md:w-1/2 text-black dark:text-white">
                    <h2 className="text-center text-3xl font-extrabold text-[var(--color-primary)]">
                        Create a New Account
                    </h2>

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="name" className="mb-1 font-semibold">Your Name</Label>
                            <TextInput id="name" type="text" placeholder="Your Name" {...register("name", { required: "Please enter your name" })} />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="image" className="mb-1 font-semibold">Profile Picture</Label>
                            <label className="inline-flex items-center justify-center w-full cursor-pointer bg-gray-700 text-white font-medium rounded-lg text-sm px-4 py-2 hover:bg-gray-800 transition">
                                Choose Profile Picture
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    {...register("image", {
                                        required: "Please upload a profile picture",
                                        onChange: (e) => {
                                            if (e.target.files[0]) {
                                                setFileName(e.target.files[0].name);
                                            }
                                        }
                                    })}
                                    className="hidden"
                                />
                            </label>
                            {fileName && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">{fileName}</p>}
                            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="mb-1 font-semibold">Your Email</Label>
                            <TextInput id="email" type="email" placeholder="name@example.com" {...register("email", { required: "Please enter your email address" })} />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-1 font-semibold">Your Password</Label>
                            <TextInput
                                id="password"
                                type="password"
                                placeholder="Your Password"
                                {...register("password", {
                                    required: "Please enter a password",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                    pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$&*])/, message: "Password must include an uppercase and special character" }
                                })}
                            />
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Register"}
                        </Button>
                    </form>

                    <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                        <p className="mx-4 mb-0 text-center font-semibold">Or</p>
                    </div>

                    <div className="space-y-3">
                        <Button onClick={() => handleSocialLogin(signInWithGoogle)} className="w-full" color="gray" disabled={loading}>
                            <FaGoogle className="mr-3 h-4 w-4" />
                            Continue with Google
                        </Button>
                        <Button onClick={() => handleSocialLogin(signInWithGitHub)} className="w-full" color="gray" disabled={loading}>
                            <FaGithub className="mr-3 h-4 w-4" />
                            Continue with GitHub
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[var(--color-accent)] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
