import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import { FaShareAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MyQR() {
  // Use existing auth state
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  // State for QR generation
  const [qrValue, setQrValue] = useState(user.paymentId);
  const [accountHolder, setAccountHolder] = useState(user.bankInformation.accountHolder);
  const [bankName, setBankName] = useState(user.bankInformation.bankName);
  const [paymentId, setPaymentId] = useState(user.paymentId);

  const handleDownload = () => {
    const canvas = document.getElementById("qrCanvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "ejuuz-qr.png";
    link.click();
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        const canvas = document.getElementById("qrCanvas");
        canvas.toBlob(async (blob) => {
          const file = new File([blob], "ejuuz-qr.png", { type: "image/png" });
          await navigator.share({
            files: [file],
            title: "QR Code",
            text: "Check out this QR Code for payment",
          });
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon 
            className="mr-4 cursor-pointer" 
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-xl font-bold flex-grow">My QR Code</h1>
        </div>

        {/* QR Code Section */}
        <div className="p-6 space-y-4">
          {/* Account Holder Name */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-900">
              {accountHolder}
            </h2>
            <button
              onClick={handleDownload}
              className="bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 transition"
            >
              <LuDownload />
            </button>
          </div>

          {/* QR Code Container */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-lg p-6 flex flex-col items-center">
            <QRCodeCanvas
              id="qrCanvas"
              value={qrValue}
              size={200}
              bgColor="rgb(239 246 255)"
              fgColor="black"
              className="mb-4"
            />
            <p className="text-black font-bold">
              {paymentId}
            </p>
          </div>

          {/* Bank Name */}
          <div className="bg-gray-200 p-1 rounded-lg border-2 text-center">
            <p className="text-blue-900 font-semibold text-lg">
              Bank: {bankName}
            </p>
          </div>

          {/* Share Button */}
          <div className="flex justify-center">
            <button
              onClick={handleShareQR}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              <FaShareAlt />
              Share QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyQR;