import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
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

const EditDonationCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();

  const { data: campaign, isLoading: isCampaignLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => (await axiosSecure.get(`/donations/${id}`)).data,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  useEffect(() => {
    if (campaign) {
      setValue('petName', campaign.petName);
      setValue('maxDonationAmount', campaign.maxDonationAmount);
      setValue('lastDateOfDonation', new Date(campaign.lastDateOfDonation).toISOString().split('T')[0]);
      setValue('shortDescription', campaign.shortDescription);
      if (editor) {
        editor.commands.setContent(campaign.longDescription);
      }
    }
  }, [campaign, setValue, editor]);

  const onSubmit = async (data) => {
    setLoading(true);
    let imageUrl = campaign.petImage;

    if (data.petImage && data.petImage.length > 0) {
      const imageFile = { image: data.petImage[0] };
      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: { 'content-type': 'multipart/form-data' }
      });
      if (res.data.success) {
        imageUrl = res.data.data.display_url;
      } else {
        toast.error("New image upload failed.");
        setLoading(false);
        return;
      }
    }

    const updatedCampaignData = {
      petName: data.petName,
      petImage: imageUrl,
      maxDonationAmount: parseFloat(data.maxDonationAmount),
      lastDateOfDonation: data.lastDateOfDonation,
      shortDescription: data.shortDescription,
      longDescription: editor.getHTML(),
    };

    const campaignRes = await axiosSecure.patch(`/donations-edit/${id}`, updatedCampaignData);
    if (campaignRes.data.modifiedCount > 0) {
      setLoading(false);
      Swal.fire({
        title: "Success!",
        text: "Donation campaign has been updated.",
        icon: "success",
      }).then(() => {
        navigate('/dashboard/my-donation-campaigns');
      });
    } else {
      setLoading(false);
      toast.error("Failed to update campaign.");
    }
  };

  if (isCampaignLoading || !editor) return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>);

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8">Edit Donation Campaign</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="petName" value="Pet's Name" />
            <TextInput id="petName" {...register('petName', { required: true })} />
          </div>
          <div>
            <Label htmlFor="maxDonationAmount" value="Max Donation ($)" />
            <TextInput id="maxDonationAmount" type="number" {...register('maxDonationAmount', { required: true })} />
          </div>
        </div>
        <div>
          <Label htmlFor="petImage" value="Upload New Image (Optional)" />
          <div className="flex items-center gap-4">
            <img src={campaign.petImage} alt="Current" className="w-20 h-20 object-cover rounded-lg" />
            <FileInput id="petImage" {...register('petImage')} className="w-full" />
          </div>
        </div>
        <div>
          <Label htmlFor="lastDateOfDonation" value="Last Date of Donation" />
          <TextInput id="lastDateOfDonation" type="date" {...register('lastDateOfDonation', { required: true })} />
        </div>
        <div>
          <Label htmlFor="shortDescription" value="Short Description" />
          <TextInput id="shortDescription" {...register('shortDescription', { required: true })} />
        </div>
        <div>
          <Label htmlFor="longDescription" value="Long Description" />
          <div className="border border-gray-300 rounded-lg">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-4 min-h-[150px] prose max-w-none" />
          </div>
        </div>
        <Button type="submit" className="w-full bg-[var(--color-accent)]" disabled={loading}>
          {loading ? <Spinner /> : 'Update Campaign'}
        </Button>
      </form>
    </div>
  );
};

export default EditDonationCampaign;
