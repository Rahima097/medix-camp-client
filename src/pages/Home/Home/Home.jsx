import React from 'react';
import Banner from '../Banner/Banner';
import PopularCamps from '../PopularCamps/PopularCamps';
import FeedbackRatings from './../FeedbackRatings/FeedbackRatings';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularCamps></PopularCamps>
            <FeedbackRatings></FeedbackRatings>
            
        </div>
    );
};

export default Home;
