import React from 'react';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const PetCard = ({ pet }) => {
  const { _id, petImage, petName, petAge, petLocation, petCategory } = pet;

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="w-full h-64 overflow-hidden">
        <img
          src={petImage}
          alt={petName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-800">{petName}</h2>
          <span className="px-4 py-1 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full capitalize">
            {petCategory}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <p className="font-medium">
            Age: <span className="font-bold">{petAge} years</span>
          </p>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-[var(--color-accent)]" />
            <span>{petLocation}</span>
          </div>
        </div>
        <p className="text-lg "><span className='text-gray-600'>{pet.shortDescription}</span></p>

        <div className="flex justify-end pt-2">
          <Link to={`/pets/${_id}`}>
            <Button
              size="sm"
              className="text-white bg-[var(--color-accent)] hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0] transition-all duration-300 rounded-full"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
