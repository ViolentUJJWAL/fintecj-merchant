import React, { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";

const ContactUs = () => {
  const [chatOpen, setChatOpen] = useState(false); // Manage chat section visibility

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* First Row: Heading */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#002E6E]">Contact Us</h2>
        <p className="text-gray-600 mt-2">We're here to help you!</p>
      </div>

      {/* Second Row: Customer Service & WhatsApp Chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Service */}
        <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-bold text-xl text-gray-800 mb-2">Customer Service</h3>
          <p className="text-gray-600 mb-4">
             click below to start a chat with our team.
          </p>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            {chatOpen ? "Close Chat" : "Start Chat"}
          </button>
        </div>

        {/* WhatsApp Chat */}
        <div className="grid grid-row-1 md:grid-row-2 gap-6">
        <a
          href="https://wa.me/your-number"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-600 text-white text-xl text-center py-6 font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
        >
          Chat with Us on WhatsApp
        </a>
        {/* Third Row: Social Media Icons */}
      <div className="flex justify-center space-x-8">
        {[
          { name: "Facebook", url: "https://facebook.com/your-page", icon: <FaFacebook /> },
          { name: "Instagram", url: "https://instagram.com/your-page", icon:  <FaInstagram /> },
          { name: "LinkedIn", url: "https://linkedin.com/your-page", icon: <FaLinkedin /> },
          { name: "Twitter", url: "https://twitter.com/your-page", icon: <FaTwitter /> },
        ].map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-200 p-4 rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300"
          >
            {social.icon}
          </a>
        ))}
      </div>
        </div>
        
      </div>

      {/* Chat Section (conditionally rendered) */}
      {chatOpen && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Live Chat</h3>
          <div className="space-y-3">
            <div className="bg-blue-100 p-3 rounded-lg text-gray-700">
              <strong>Merchant:</strong> How can I help you today?
            </div>
            <div className="bg-gray-200 p-3 rounded-lg text-gray-700 self-end">
              <strong>You:</strong> I have a question about my order.
            </div>
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-3 rounded-l-lg border border-gray-300"
            />
            <button className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default ContactUs;
