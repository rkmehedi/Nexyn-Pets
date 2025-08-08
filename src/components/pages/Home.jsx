import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import Skeleton from 'react-loading-skeleton';
import { FaSpinner } from 'react-icons/fa';
import Banner from './Banner';
import PetCategory from './PetCategory';
import CallToAction from './CallToAction';
import AboutUs from './AboutUs';
import SuccessStories from './SuccessStories';
import Newsletter from './Newsletter';
import SupportOurPets from './SupportOurPets';

const Home = () => {
    return (
        <div>
            <Banner />
            <PetCategory/>
            <SupportOurPets/>
            <CallToAction/>
            
            <AboutUs/>
            <SuccessStories/>
            <Newsletter/>

        </div>
    );
};

export default Home;