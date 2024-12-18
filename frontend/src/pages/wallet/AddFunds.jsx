import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from 'lucide-react';
import walletService from "../../services/walletService ";
import { toast } from "react-toastify";
import AuthService from "../../services/authServices";
import { setUserData } from "../../Redux/authSlice/authSlice";
import { useDispatch } from "react-redux";

const AddFunds = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [securityPin, setSecurityPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const dispatch = useDispatch();

  const handleReload = async () => {
    const response = await AuthService.getProfile();
    dispatch(setUserData({ user: response.data }));
  };

  useEffect(() => {
    checkPinSet()
  }, [])

  const checkPinSet = async () => {
    try {
      await walletService.checkPinSet()
      console.log("done")
    } catch (error) {
      toast.error("Please set your payment pin first.")
      navigate("/wallet")
    }
  }

  const handleAddMoney = () => {
    if (amount) {
      setStep(2);
    }
  };

  const handlePaymentOption = (option) => {
    setSelectedOption(option);
    setStep(3);
  };

  const handleSubmitPin = async () => {
    try {
      await walletService.addMoney(amount, securityPin)
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error)
      setPinError(true);
    }
  };

  const handleSuccessBack = async () => {
    await handleReload()
    navigate("/wallet")
  }

  console.log("showSuccessModal", showSuccessModal)

  return (
    <div className="bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon
            className="mr-4 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-bold flex-grow">Add Funds</h1>
        </div>

        <div className="p-6 space-y-4">
          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 m-4 text-center max-w-sm w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-blue-900">
                  Money Added Successfully!
                </h3>
                <p className="text-blue-700 mb-4">
                  R{amount} has been added to your wallet.
                </p>
                <button
                  onClick={handleSuccessBack}
                  className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Back to Wallet
                </button>
              </div>
            </div>
          )}

          {!showSuccessModal && step === 1 && (
            <div className="space-y-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-4 text-2xl border-2 border-blue-100 rounded-lg mb-4 text-center"
                autoFocus
              />
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[500, 1000, 2000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value.toString())}
                    className="py-3 px-4 bg-blue-50 border-2 border-blue-100 rounded-lg hover:bg-blue-100 text-blue-900 font-medium"
                  >
                    R{value}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddMoney}
                className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Add Money
              </button>
            </div>
          )}

          {!showSuccessModal && step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                Choose Payment Method
              </h2>
              <div className="grid gap-4">
                {["Wallet", "Account", "Credit Card"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePaymentOption(option)}
                    className="py-4 px-6 bg-blue-50 border-2 border-blue-100 rounded-lg hover:bg-blue-100 text-blue-900 font-medium"
                  >
                    Pay with {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showSuccessModal && step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                Enter Security PIN
              </h2>
              <input
                type="password"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="Enter your PIN"
                className="w-full p-4 text-xl border-2 border-blue-100 rounded-lg mb-4 text-center"
              />
              {pinError && (
                <p className="text-red-500 text-sm mb-4 text-center">
                  Incorrect PIN. Please try again.
                </p>
              )}
              <button
                onClick={handleSubmitPin}
                className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Submit PIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default AddFunds;