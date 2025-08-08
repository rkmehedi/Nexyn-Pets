import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, FileInput, Label, Spinner, TextInput } from 'flowbite-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode
} from 'react-icons/fa';

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
      {menuItems.map((item, index) => {
        const isActive = editor.isActive(item.name);
        return (
          <button
            key={index}
            type="button"
            onClick={item.action}
            className={`p-2 rounded-md hover:bg-gray-300 ${isActive ? 'bg-gray-300' : ''}`}
          >
            <item.icon />
          </button>
        );
      })}
    </div>
  );
};

const AddPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const editor = useEditor( {
    extensions: [StarterKit],
    content: '<p>Tell us all the wonderful things about your pet!</p>',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const longDescription = editor.getHTML();

    const imageFile = { image: data.petImage[0] };
    try {
      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: { 'content-type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const petItem = {
          petName: data.petName,
          petAge: parseInt(data.petAge),
          petCategory: data.petCategory.value,
          petLocation: data.petLocation,
          shortDescription: data.shortDescription,
          longDescription,
          petImage: res.data.data.display_url,
          ownerEmail: user.email,
          ownerName: user.displayName,
        };

        const petRes = await axiosSecure.post('/pets', petItem);
        if (petRes.data.insertedId) {
          reset();
          editor.commands.setContent('');
          Swal.fire({
            title: "Success!",
            text: `${data.petName} has been added to the pet list.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        }
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Add a New Pet</h2>
        <p className="text-gray-500 mt-2">Fill out the form below to find a new home for your pet.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto">
        <div>
          <Label htmlFor="petImage" className="mb-1 text-gray-800 font-semibold">Pet's Image</Label>
          <FileInput
            id="petImage"
            {...register('petImage', { required: "Please upload an image of your pet." })}
            className="w-full text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer 
                               file:bg-gray-100 file:border-none file:px-4 file:py-2 file:mr-4 
                               file:text-sm file:text-gray-700 file:font-medium hover:file:bg-gray-200 transition-all"
          />
          {errors.petImage && <p className="text-red-600 text-sm mt-1">{errors.petImage.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="petName" className="mb-1 text-gray-800 font-semibold">Pet's Name</Label>
            <TextInput
              id="petName"
              placeholder="e.g., Mittens"
              {...register('petName', { required: "Please put your pet's name." })}
            />
            {errors.petName && <p className="text-red-600 text-sm mt-1">{errors.petName.message}</p>}
          </div>

          <div>
            <Label htmlFor="petAge" className="mb-1 text-gray-800 font-semibold">Pet's Age (in years)</Label>
            <TextInput
              id="petAge"
              type="number"
              placeholder="e.g., 2"
              {...register('petAge', { required: "Please put your pet's age." })}
            />
            {errors.petAge && <p className="text-red-600 text-sm mt-1">{errors.petAge.message}</p>}
          </div>

          <div className='bg-white text-black dark:bg-gray-900 dark:text-white'>
            <Label htmlFor="petCategory" className="mb-1 text-gray-800 font-semibold">Pet Category</Label>
            <Controller
              name="petCategory"
              control={control}
              rules={{ required: "Please select a category for your pet." }}
              render={({ field }) => <Select options={petCategories} {...field} />}
            />
            {errors.petCategory && <p className="text-red-600 text-sm mt-1">{errors.petCategory.message}</p>}
          </div>

          <div>
            <Label htmlFor="petLocation" className="mb-1 text-gray-800 font-semibold">Location</Label>
            <TextInput
              id="petLocation"
              placeholder="e.g., Dhaka, Bangladesh"
              {...register('petLocation', { required: "Please tell us where your pet is located." })}
            />
            {errors.petLocation && <p className="text-red-600 text-sm mt-1">{errors.petLocation.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="shortDescription" className="mb-1 text-gray-800 font-semibold">Short Description</Label>
          <TextInput
            id="shortDescription"
            placeholder="A brief, catchy notes or some things special about pets"
            {...register('shortDescription', { required: "Please write a short description of your pet." })}
          />
          {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="longDescription" className="mb-1 text-gray-800 font-semibold">Long Description</Label>
          <div className="border border-gray-300 rounded-lg">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-4 min-h-[150px]  prose max-w-none" />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]"
          disabled={loading}
        >
          {loading ? <Spinner /> : 'Add Pet to Adoption List'}
        </Button>
      </form>
    </div>
  );
};

export default AddPet;
