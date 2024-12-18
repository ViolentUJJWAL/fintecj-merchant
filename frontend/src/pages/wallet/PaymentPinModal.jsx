import React, { useState } from 'react';
import { toast } from 'react-toastify';
import walletService from '../../services/walletService ';

const PaymentPinModal = ({ isOpen, onClose }) => {
  const [loginPassword, setLoginPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [pinSetupStep, setPinSetupStep] = useState('password');

  const resetModal = () => {
    setLoginPassword('');
    setNewPin('');
    setConfirmPin('');
    setOtpCode('');
    setPinSetupStep('password');
  };

  const verifyLoginPassword = async () => {
    try {
      await walletService.verifyPassword(loginPassword);
      setPinSetupStep('pin');
    } catch (error) {
      console.log(error);
    }
  };

  const generateOTP = async () => {
    if (newPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }
    setPinSetupStep('otp');
  };

  const confirmPinSetup = async () => {
    try {
      await walletService.setupPaymentPin(newPin, otpCode);
      onClose();
      resetModal();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="mx-auto bg-white shadow-lg rounded-xl w-96">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <h1 className="text-xl font-bold flex-grow">
            {pinSetupStep === 'password' && 'Verify Password'}
            {pinSetupStep === 'pin' && 'Set Payment PIN'}
            {pinSetupStep === 'otp' && 'OTP Verification'}
          </h1>
        </div>

        <div className="p-6 space-y-4">
          {pinSetupStep === 'password' && (
            <div className="space-y-4">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter Login Password"
                className="w-full p-4 border-2 border-blue-100 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    onClose();
                    resetModal();
                  }}
                  className="w-full py-4 bg-blue-50 border-2 border-blue-100 rounded-lg text-blue-900 hover:bg-blue-100"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyLoginPassword}
                  className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {pinSetupStep === 'pin' && (
            <div className="space-y-4">
              <input
                type="password"
                value={newPin}
                maxLength={4}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full p-4 text-xl border-2 border-blue-100 rounded-lg text-blue-900 text-center"
              />
              <input
                type="password"
                value={confirmPin}
                maxLength={4}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm PIN"
                className="w-full p-4 text-xl border-2 border-blue-100 rounded-lg text-blue-900 text-center"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    onClose();
                    resetModal();
                  }}
                  className="w-full py-4 bg-blue-50 border-2 border-blue-100 rounded-lg text-blue-900 hover:bg-blue-100"
                >
                  Cancel
                </button>
                <button
                  onClick={generateOTP}
                  className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800"
                >
                  Generate OTP
                </button>
              </div>
            </div>
          )}

          {pinSetupStep === 'otp' && (
            <div className="space-y-4">
              <input
                type="text"
                value={otpCode}
                maxLength={6}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-4 text-xl border-2 border-blue-100 rounded-lg text-blue-900 text-center"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    onClose();
                    resetModal();
                  }}
                  className="w-full py-4 bg-blue-50 border-2 border-blue-100 rounded-lg text-blue-900 hover:bg-blue-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPinSetup}
                  className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800"
                >
                  Confirm PIN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPinModal;