import React, { useState } from 'react'; // Import for navigation
import { Mail, Phone } from 'lucide-react';

const CustomerInfoCard = (promps) => {
    // Dummy customer data

    const customer = promps.customer

    // State to control the popup modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="w-full mx-auto bg-black/10 text-black border border-white/20 rounded-lg relative">
            {/* Profile, Loyalty Points, and Verification */}
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
                {/* Profile Image */}
                <div
                    className="cursor-pointer flex items-center space-x-2"
                    onClick={openModal}
                >
                    <div className='flex'>
                        <img
                            src={customer?.profile?.url || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray"
                        />
                        <div className='ml-5'>
                            <div>
                                <span className="font-semibold text-lg">{customer.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-5 h-5 text-black-300" />
                                <span>{customer.phoneNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-black-300" />
                                <span>{customer.email || "no provide"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loyalty Points and Verification */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        {/* Custom Coin Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="gold"
                            className="w-5 h-5"
                        >
                            <circle cx="12" cy="12" r="10" stroke="orange" strokeWidth="2" fill="gold" />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                fill="white"
                                fontSize="8"
                                dy=".3em"
                                fontWeight="bold"
                            >
                                $
                            </text>
                        </svg>
                        <span className="text-black font-bold text-sm">{customer.loyaltyPoints}</span>
                    </div>

                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${customer.isVerified ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {customer.isVerified ? "Verified" : "Unverified"}
                    </span>
                </div>
            </div>

            {/* Popup Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 ">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative mb-20">
                        {/* Cross Button */}
                        <button
                            className="absolute top-1 right-1 text-red-500 text-4xl"
                            onClick={closeModal} // Navigate back to orders
                        >
                            &times;
                        </button>
                        <img
                            src={customer?.profile?.url || "https://via.placeholder.com/150"}
                            alt="Profile Enlarged"
                            className="h-96 w-full rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerInfoCard;
