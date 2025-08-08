import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { Button, Spinner, TextInput, Modal, ModalBody } from 'flowbite-react';
import { FaMapMarkerAlt, FaPaw } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const PetDetailsSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-10 animate-pulse">
    <div className="bg-gray-300 rounded-lg h-96"></div>
    <div className="space-y-6">
      <div className="h-12 bg-gray-300 rounded w-3/4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="h-12 bg-gray-400 rounded w-1/3"></div>
    </div>
  </div>
);

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: pet, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => (await axiosPublic.get(`/pets/${id}`)).data
  });

  const handleOpenModal = () => {
    if (!user) {
      Swal.fire({
        title: "You need to log in!",
        text: "Please log in to adopt a pet.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, log in!"
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: location } });
        }
      });
    } else if (user.email === pet.ownerEmail) {
      toast.warning("You can't adopt your own pet!");
    } else {
      setOpenModal(true);
    }
  };

  const onAdoptSubmit = data => {
    const adoptionRequest = {
      userName: user.displayName,
      userEmail: user.email,
      userPhone: data.phoneNumber,
      userAddress: data.address,
      petId: pet._id,
      petName: pet.petName,
      petImage: pet.petImage,
      petOwnerEmail: pet.ownerEmail,
      status: 'pending'
    };
    axiosSecure.post('/adoptions', adoptionRequest)
      .then(res => {
        if (res.data.insertedId) {
          setOpenModal(false);
          Swal.fire({
            title: "Request Sent!",
            text: "Your adoption request has been sent to the pet owner.",
            icon: "success",
            confirmButtonText: "Awesome"
          }).then(result => {
            if (result.isConfirmed) {
              navigate('/donation-campaigns');
            }
          });
        }
      })
      .catch(() => toast.error("Failed to send request. Maybe you already have a request or an error occurred."));
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-10"><PetDetailsSkeleton /></div>;
  }

  if (error) {
    navigate('/error/internal');
    return null;
  }

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white-50 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-lg">
          <div className="grid md:grid-cols-2 gap-10">
            <img src={pet.petImage} alt={pet.petName} className="w-full h-auto object-cover rounded-lg" />
            <div className="space-y-4">
              <div className='flex justify-between items-center'>
                <h1 className="text-4xl font-extrabold text-gray-800">{pet.petName}</h1>
                <span className="px-5 py-1.5 bg-[var(--color-primary)] text-white text-md font-semibold rounded-full capitalize">
                  {pet.petCategory}
                </span>
              </div>
              <div className="text-gray-700 border-t"></div>
              <p className="text-lg text-gray-600">{pet.shortDescription}</p>
              <div className="grid grid-cols-2 gap-4 text-gray-700 pt-4 border-t">
                <p><span className="font-bold">Age:</span> {pet.petAge} years</p>
                <p><span className="font-bold">Added by:</span> {pet.ownerName}</p>
                <p><span className="font-bold">Status:</span> <span className="text-green-600 font-semibold">Available</span></p>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[var(--color-accent)]" />
                  <span className="font-bold">{pet.petLocation}</span>
                </div>
              </div>
              <div><p className="font-bold">Description:</p></div>
              <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: pet.longDescription }} />
              <Button onClick={handleOpenModal} size="lg" className="w-full mt-15 bg-[var(--color-accent)] hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]">
                <FaPaw className="mr-3" />
                Adopt {pet.petName}
              </Button>
            </div>
          </div>
        </div>

        <Modal
          show={openModal}
          size="md"
          onClose={() => setOpenModal(false)}
          popup
          dismissible
        >
          <ModalBody>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Adopt {pet?.petName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Please fill out the form to request adoption.
              </p>
            </div>
            <form onSubmit={handleSubmit(onAdoptSubmit)} className="space-y-4">
              <TextInput
                id="userName"
                defaultValue={user?.displayName}
                readOnly
                disabled
                placeholder="Your Name"
              />
              <TextInput
                id="userEmail"
                defaultValue={user?.email}
                readOnly
                disabled
                placeholder="Your Email"
              />
              <TextInput
                id="phoneNumber"
                placeholder="Your Phone Number"
                {...register("phoneNumber", { required: true })}
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm">Phone number is required.</p>}
              <TextInput
                id="address"
                placeholder="Your Full Address"
                {...register("address", { required: true })}
              />
              {errors.address && <p className="text-red-600 text-sm">Address is required.</p>}
              <Button type="submit" className="w-full bg-[var(--color-accent)]">
                Submit Adoption Request
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default PetDetails;
