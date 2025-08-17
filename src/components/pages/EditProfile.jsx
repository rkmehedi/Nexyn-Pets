import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { Button, Spinner, TextInput, FileInput } from 'flowbite-react';
import { FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import noPhoto from '../../assets/default.jpg';
import { useQuery } from '@tanstack/react-query';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const EditProfile = () => {
    const { user, loading, updateUserProfile, setLoading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm();

    const { data: dbUser, isLoading: isDbUserLoading } = useQuery({
        queryKey: ['dbUser', user?.email],
        queryFn: async () => (await axiosSecure.get(`/user/${user.email}`)).data,
        enabled: !!user?.email,
    });

    useEffect(() => {
        if (dbUser) {
            setValue('name', dbUser.name);
            setValue('phone', dbUser.phone);
            setValue('address', dbUser.address);
        }
    }, [dbUser, setValue]);

    const handleUpdateProfile = async (data) => {
        setLoading(true);
        let newPhotoURL = user.photoURL;

        if (data.image && data.image.length > 0) {
            const imageFile = { image: data.image[0] };
            const res = await axiosPublic.post(image_hosting_api, imageFile, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            if (res.data.success) {
                newPhotoURL = res.data.data.display_url;
            } else {
                toast.error("Failed to upload new image.");
                setLoading(false);
                return;
            }
        }

        await updateUserProfile(data.name, newPhotoURL);

        const updatedDbInfo = {
            name: data.name,
            phone: data.phone,
            address: data.address,
        };
        await axiosSecure.patch(`/user/${user.email}`, updatedDbInfo);
        
        setLoading(false);
        Swal.fire({
            title: "Success!",
            text: "Your profile has been updated.",
            icon: "success",
        }).then(() => {
            navigate('/profile');
        });
    };

    if (loading || isDbUserLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="xl" /></div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Edit Your Profile</h2>
                    <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
                        <div className="flex justify-center">
                            <img src={user?.photoURL || noPhoto} alt="Current Profile" className="w-32 h-32 rounded-full object-cover ring-4 ring-[var(--color-accent)]" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                                Your Name
                            </label>
                            <TextInput id="name" {...register("name", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                                Phone Number
                            </label>
                            <TextInput id="phone" {...register("phone")} />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                                Address
                            </label>
                            <TextInput id="address" {...register("address")} />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                                Update Profile Picture (Optional)
                            </label>
                            <FileInput id="image" {...register("image")} />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="submit" className="w-full bg-[var(--color-accent)]" disabled={loading}>
                                {loading ? <Spinner /> : <><FaSave className="mr-2 h-5 w-5" /> Save Changes</>}
                            </Button>
                            <Link to="/profile" className="w-full">
                                <Button color="gray" className="w-full">
                                    <FaTimes className="mr-2 h-5 w-5" /> Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
