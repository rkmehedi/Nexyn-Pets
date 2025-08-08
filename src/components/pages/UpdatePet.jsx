import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, FileInput, Label, Spinner, TextInput } from 'flowbite-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaBold, FaItalic, FaStrikethrough, FaCode } from 'react-icons/fa';
import SkeletonLoader from '../SkeletonLoader';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const petCategories = [
    { value: 'cat', label: 'Cat' },
    { value: 'dog', label: 'Dog' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'fish', label: 'Fish' },
    { value: 'bird', label: 'Bird' },
];

const MenuBar = ({ editor }) => {
    if (!editor) return null;
    const menuItems = [
        { action: () => editor.chain().focus().toggleBold().run(), icon: FaBold, name: 'bold' },
        { action: () => editor.chain().focus().toggleItalic().run(), icon: FaItalic, name: 'italic' },
        { action: () => editor.chain().focus().toggleStrike().run(), icon: FaStrikethrough, name: 'strike' },
        { action: () => editor.chain().focus().toggleCode().run(), icon: FaCode, name: 'code' },
    ];
    return (
        <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-100 flex items-center gap-2">
            {menuItems.map((item, index) => (
                <button key={index} type="button" onClick={item.action} className={`p-2 rounded-md hover:bg-gray-300 ${editor.isActive(item.name) ? 'bg-gray-300' : ''}`}>
                    <item.icon />
                </button>
            ))}
        </div>
    );
};

const UpdatePet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm();

    const { data: pet, isLoading: isPetLoading } = useQuery({
        queryKey: ['pet', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/pets/${id}`);
            return res.data;
        }
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    useEffect(() => {
        if (pet) {
            setValue('petName', pet.petName);
            setValue('petAge', pet.petAge);
            setValue('petLocation', pet.petLocation);
            setValue('shortDescription', pet.shortDescription);
            const category = petCategories.find(c => c.value === pet.petCategory);
            if (category) {
                setValue('petCategory', category);
            }
            if (editor) {
                editor.commands.setContent(pet.longDescription);
            }
        }
    }, [pet, setValue, editor]);

    const onSubmit = async (data) => {
        setLoading(true);
        let imageUrl = pet.petImage;

        if (data.petImage && data.petImage.length > 0) {
            const imageFile = { image: data.petImage[0] };
            const res = await axiosPublic.post(image_hosting_api, imageFile, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            if (res.data.success) {
                imageUrl = res.data.data.display_url;
            } else {
                toast.error("New image upload failed. Please try again.");
                setLoading(false);
                return;
            }
        }

        const updatedPetData = {
            petName: data.petName,
            petAge: parseInt(data.petAge),
            petCategory: data.petCategory.value,
            petLocation: data.petLocation,
            shortDescription: data.shortDescription,
            longDescription: editor.getHTML(),
            petImage: imageUrl,
        };

        const petRes = await axiosSecure.patch(`/pets/${id}`, updatedPetData);
        if (petRes.data.modifiedCount > 0) {
            setLoading(false);
            Swal.fire({
                title: "Success!",
                text: `${data.petName}'s information has been updated.`,
                icon: "success",
            }).then(() => {
                navigate('/dashboard/my-added-pets');
            });
        } else {
            setLoading(false);
            toast.error("Failed to update pet information.");
        }
    };
    
    if (isPetLoading || !editor) {
        return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>
   ); }

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Update Pet Information</h2>
                <p className="text-gray-500 mt-2">Edit the details for {pet.petName}.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="petName" className="mb-1 text-gray-800 font-semibold">Pet's Name</Label>
                        <TextInput id="petName" {...register('petName', { required: "Pet's name is required" })} />
                        {errors.petName && <p className="text-red-600 text-sm mt-1">{errors.petName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="petAge" className="mb-1 text-gray-800 font-semibold">Pet's Age (in years)</Label>
                        <TextInput id="petAge" type="number" {...register('petAge', { required: "Pet's age is required" })} />
                        {errors.petAge && <p className="text-red-600 text-sm mt-1">{errors.petAge.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="petCategory" className="mb-1 text-gray-800 font-semibold">Pet Category</Label>
                        <Controller
                            name="petCategory"
                            control={control}
                            rules={{ required: "Please select a category" }}
                            render={({ field }) => <Select options={petCategories} {...field} />}
                        />
                        {errors.petCategory && <p className="text-red-600 text-sm mt-1">{errors.petCategory.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="petLocation" className="mb-1 text-gray-800 font-semibold">Location</Label>
                        <TextInput id="petLocation" {...register('petLocation', { required: "Location is required" })} />
                        {errors.petLocation && <p className="text-red-600 text-sm mt-1">{errors.petLocation.message}</p>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="petImage" className="mb-1 text-gray-800 font-semibold">Upload New Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                        <img src={pet.petImage} alt="Current" className="w-20 h-20 object-cover rounded-lg" />
                        <FileInput id="petImage" {...register('petImage')} className="w-full" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="shortDescription" className="mb-1 text-gray-800 font-semibold">Short Description</Label>
                    <TextInput id="shortDescription" {...register('shortDescription', { required: "A short description is required" })} />
                    {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription.message}</p>}
                </div>
                <div>
                    <Label htmlFor="longDescription" className="mb-1 text-gray-800 font-semibold">Long Description</Label>
                    <div className="border border-gray-300 rounded-lg">
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} className="p-4 min-h-[150px] prose max-w-none" />
                    </div>
                </div>
                <Button type="submit" className="w-full bg-[var(--color-accent)]" disabled={loading}>
                    {loading ? <Spinner /> : 'Update Pet Information'}
                </Button>
            </form>
        </div>
    );
};

export default UpdatePet;
