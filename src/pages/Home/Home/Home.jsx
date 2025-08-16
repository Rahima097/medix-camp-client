import React from 'react';
import Banner from '../Banner/Banner';
import PopularCamps from '../PopularCamps/PopularCamps';
import FeedbackRatings from './../FeedbackRatings/FeedbackRatings';
import HealthTips from '../HealthTips/HealthTips';
import OurTeam from '../OurTeam/OurTeam';
import FAQ from '../FAQ/FAQ';
import About from '../About/About';
import Achievements from '../Achievements/Achievements';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularCamps></PopularCamps>
            <About></About>
            <Achievements></Achievements>
            <FeedbackRatings></FeedbackRatings>
            <HealthTips></HealthTips>
            <OurTeam></OurTeam>
            <FAQ></FAQ> 
        </div>
    );
};

export default Home;
