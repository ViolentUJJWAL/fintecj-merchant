import React from 'react';
import Header from '../components/Header/Header';
import Nav from '../components/Nav/Nav';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            {/* Header Section */}
            <Header />

            {/* Main Layout Section */}
            <div className="w-full flex flex-row h-full overflow-hidden">
                {/* Sidebar */}
                <div className="w-[20%] h-full hidden md:block bg-gray-100">
                    <Nav />
                </div>

                {/* Main Content */}
                <div className="w-[80%] flex-grow p-4 bg-gray-100 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
