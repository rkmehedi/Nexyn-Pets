import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, FileInput, Label, Spinner, TextInput } from 'flowbite-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import { FaBold, FaItalic, FaStrikethrough, FaCode } from 'react-icons/fa';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

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

const CreateDonationCampaign = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Explain why this pet needs a donation campaign.</p>',
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
        const campaignData = {
          petName: data.petName,
          petImage: res.data.data.display_url,
          maxDonationAmount: parseFloat(data.maxDonationAmount),
          lastDateOfDonation: data.lastDateOfDonation,
          shortDescription: data.shortDescription,
          longDescription,
          ownerEmail: user.email,
          ownerName: user.displayName,
        };

        const campaignRes = await axiosSecure.post('/donations', campaignData);
        if (campaignRes.data.insertedId) {
          reset();
          editor.commands.setContent('');
          Swal.fire({
            title: "Success!",
            text: "Your donation campaign has been created.",
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
        <h2 className="text-3xl font-bold text-gray-800">Create a Donation Campaign</h2>
        <p className="text-gray-500 mt-2">Raise funds to help a pet in need.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="petName" className="mb-1 text-gray-800 font-semibold">Pet's Name</Label>
            <TextInput id="petName" placeholder="e.g., Buddy" {...register('petName', { required: "Pet name is required" })} />
            {errors.petName && <p className="text-red-600 text-sm mt-1">{errors.petName.message}</p>}
          </div>
          <div>
            <Label htmlFor="petImage" className="mb-1 text-gray-800 font-semibold">Pet's Picture</Label>
            <FileInput id="petImage" {...register('petImage', { required: "A picture for the campaign is required" })} />
            {errors.petImage && <p className="text-red-600 text-sm mt-1">{errors.petImage.message}</p>}
          </div>
          <div>
            <Label htmlFor="maxDonationAmount" className="mb-1 text-gray-800 font-semibold">Maximum Donation Amount ($)</Label>
            <TextInput id="maxDonationAmount" type="number" placeholder="e.g., 500" {...register('maxDonationAmount', { required: "This field is required" })} />
            {errors.maxDonationAmount && <p className="text-red-600 text-sm mt-1">{errors.maxDonationAmount.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastDateOfDonation" className="mb-1 text-gray-800 font-semibold">Last Date of Donation</Label>
            <TextInput id="lastDateOfDonation" type="date" {...register('lastDateOfDonation', { required: "This field is required" })} />
            {errors.lastDateOfDonation && <p className="text-red-600 text-sm mt-1">{errors.lastDateOfDonation.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="shortDescription" className="mb-1 text-gray-800 font-semibold">Short Description</Label>
          <TextInput id="shortDescription" placeholder="A brief summary of the campaign" {...register('shortDescription', { required: "A short description is required" })} />
          {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="longDescription" className="mb-1 text-gray-800 font-semibold">Long Description</Label>
          <div className="border border-gray-300 rounded-lg">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-4 min-h-[150px] prose max-w-none" />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]"
          disabled={loading}
        >
          {loading ? <Spinner /> : 'Create Campaign'}
        </Button>
      </form>
    </div>
  );
};

export default CreateDonationCampaign;
