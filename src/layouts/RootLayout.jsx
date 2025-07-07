import React from 'react';
import Navbar from '../pages/Home/shared/Navbar/Navbar';
import Footer from '../pages/Home/shared/Footer/Footer';

const RootLayout = () => {
    return (
         <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;