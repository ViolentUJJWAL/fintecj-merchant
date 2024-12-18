import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import FAQ from "./Faq";
import ContactUs from "./Contact";

const App = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Back Button */}
      <div className="bg-white py-2 px-4 shadow">
        <button
          className="flex items-center mb-4 text-blue-500 hover:text-blue-700"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Header */}
      <header className="bg-[#00BAF2] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Help Center
          </h1>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-4 py-2 text-lg font-medium transition-colors duration-300 ${activeTab === "faq"
                ? "text-[#444] border-b-4 border-[#002E6E]"
                : "text-[#002E6E] hover:text-white"
                }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 text-lg font-medium transition-colors duration-300 ${activeTab === "contact"
                ? "text-white border-b-4 border-[#002E6E]"
                : "text-[#002E6E] hover:text-white"
                }`}
            >
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* Tab Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "faq" && <FAQ />}
        {activeTab === "contact" && <ContactUs />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Help Center. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
