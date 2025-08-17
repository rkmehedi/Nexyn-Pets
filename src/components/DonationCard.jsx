import React from 'react';
import { Link } from 'react-router';
import { Button, Card } from 'flowbite-react';

const DonationCard = ({ campaign }) => {
  const { _id, petImage, petName, maxDonationAmount, donatedAmount } = campaign;

  return (
    <Card className="max-w-full mx-auto group rounded-2xl shadow-md hover:shadow-2xl hover:shadow-orange-400 transition-shadow duration-300 hover:scale-[1.02]">
      <div className="relative h-64 rounded-t-2xl overflow-hidden">
        <img
          src={petImage}
          alt={`Photo of ${petName}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>

      <div className="px-4 pb-5 pt-3 space-y-4">
        <h5 className="text-2xl font-extrabold text-center text-[var(--color-accent)]">
          {petName}
        </h5>

        <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <p>
            Donated amount: <span className="font-bold text-green-600">${donatedAmount}</span>
          </p>
          <p>
            Maximum donation: <span className="font-bold text-gray-900">${maxDonationAmount}</span>
          </p>
        </div>
        <div>
          <p className="text-lg text-gray-600">{campaign.shortDescription}</p>
        </div>

        <div className="mt-3">
          <Link to={`/donations/${_id}`}>
            <div className=' w-full flex justify-center items-center'><Button className="w-full bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]">
              View Details
            </Button>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default DonationCard;
