import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const FAQ = () => {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  // Define FAQs by category
  const generalFAQs = [
    { id: 1, question: "What is this platform?", answer: "This is a help center." },
    { id: 2, question: "What is this ?", answer: "This is a help Centre." },
  ];

  const accountFAQs = [
    { id: 3, question: "How to reset my password?", answer: "Go to account settings." },
  ];

  const paymentFAQs = [
    { id: 4, question: "What payment methods are accepted?", answer: "We accept cards and UPI." },
    { id: 5, question: "What payment methods are accepted ?", answer: "We accept cards and UPI." },
    { id: 6, question: "What payment methods are accepted? ", answer: "We accept cards and UPI." },
    { id: 7, question: "What payment methods are accepted? ", answer: "We accept cards and UPI." },
  ];

  const servicesFAQs = [
    { id: 8, question: "What services are offered?", answer: "Check our services page." },
  ];

  // Combine all FAQs for filtering
  const faqs = [
    ...generalFAQs.map((faq) => ({ ...faq, category: "general" })),
    ...accountFAQs.map((faq) => ({ ...faq, category: "account" })),
    ...paymentFAQs.map((faq) => ({ ...faq, category: "payment" })),
    ...servicesFAQs.map((faq) => ({ ...faq, category: "services" })),
  ];

  const filteredFaqs = filter === "all" ? faqs : faqs.filter((faq) => faq.category === filter);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["all", "general", "account", "payment", "services"].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === category
                ? "bg-[#002E6E] text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* FAQ List with Accordion */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white shadow-md p-4 rounded hover:shadow-lg transition-shadow duration-300"
          >
            {/* Question */}
            <div
              onClick={() => toggleAccordion(faq.id)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="font-bold text-lg">{faq.question}</h3>
              <span
                className={`transform ${
                  openId === faq.id ? "rotate-180" : ""
                } transition-transform`}
              >
                <IoIosArrowDown />
              </span>
            </div>
            {/* Answer */}
            {openId === faq.id && (
              <div className="mt-2 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
