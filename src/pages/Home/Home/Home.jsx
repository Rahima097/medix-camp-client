import React from 'react';
import Banner from '../Banner/Banner';
import PopularCamps from '../PopularCamps/PopularCamps';
import FeedbackRatings from './../FeedbackRatings/FeedbackRatings';
import HealthTips from '../HealthTips/HealthTips';
import OurTeam from '../OurTeam/OurTeam';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularCamps></PopularCamps>
            <FeedbackRatings></FeedbackRatings>
            <HealthTips></HealthTips>
            <OurTeam></OurTeam>
            
        </div>
    );
};

export default Home;
