import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { Button, Modal, ModalBody, ModalHeader, TextInput, Label } from 'flowbite-react';
import Swal from 'sweetalert2';
import CheckoutForm from '../CheckoutForm';
import DonationCard from '../DonationCard';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DonationDetailsSkeleton = () => (
  <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg animate-pulse">
    <div className="h-64 sm:h-96 bg-gray-300 rounded-lg mb-8"></div>
    <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);

const DonationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const { data: campaign, isLoading, error, refetch } = useQuery({
    queryKey: ['donation-campaign', id],
    queryFn: async () => (await axiosPublic.get(`/donations/${id}`)).data,
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ['recommended-donations'],
    queryFn: async () => (await axiosPublic.get('/donations?limit=4')).data.campaigns,
  });

  const handleOpenModal = () => {
    if (!user) {
      Swal.fire({
        title: "You need to log in!",
        text: "Please log in to make a donation.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, log in!"
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: location } });
        }
      });
    } else {
      setOpenModal(true);
    }
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setDonationAmount(amount);
    if (amount > 0) {
      axiosSecure.post('/create-payment-intent', { amount })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        });
    } else {
      setClientSecret('');
    }
  };

  const handlePaymentSuccess = () => {
    setOpenModal(false);
    setDonationAmount('');
    setClientSecret('');
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <DonationDetailsSkeleton />
      </div>
    );
  }

  if (error) {navigate('/error/internal');
    return null;}
  if (!campaign) {navigate('/error/internal');
    return null;}

  return (  
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4 sm:p-8 rounded-2xl shadow-lg mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-accent)] mb-6">
            {campaign.petName}
          </h1>

          <div className="mx-auto w-full lg:w-2/3 h-64 md:h-[500px] rounded-xl overflow-hidden mb-8 shadow-md">
            <img
              src={campaign.petImage}
              alt={campaign.petName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div >
          <p className='font-medium text-green-600 text-2xl'>{campaign.shortDescription}</p>
            <div className=' max-w-none mx-auto text-left' ><p className='text-2xl font-bold'>Description:</p>
          <div className="prose" dangerouslySetInnerHTML={{ __html: campaign.longDescription }} />
</div>
          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleOpenModal}
              size="lg"
              className="bg-[var(--color-accent)]"
              disabled={campaign.isPaused}
            >
              {campaign.isPaused ? 'Donation is currently Paused for this Pet' : 'Donate Now'}
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8">Other Campaigns You Might Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommended.filter(rec => rec._id !== id).slice(0, 3).map(recCampaign => (
              <DonationCard key={recCampaign._id} campaign={recCampaign} />
            ))}
          </div>
        </div>
      </div>

      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Donate to {campaign?.petName}
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="donationAmount">Donation Amount ($)</Label>
              </div>
              <TextInput
                id="donationAmount"
                type="number"
                placeholder="Enter amount"
                value={donationAmount}
                onChange={handleAmountChange}
              />
            </div>

            {clientSecret && donationAmount > 0 && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  campaign={campaign}
                  donationAmount={donationAmount}
                  clientSecret={clientSecret}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DonationDetails;
