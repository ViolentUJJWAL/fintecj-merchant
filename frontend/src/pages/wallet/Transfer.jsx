import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Plus } from 'lucide-react';
import walletService from '../../services/walletService ';
import { toast } from 'react-toastify';
import AuthService from "../../services/authServices";
import { setUserData } from "../../Redux/authSlice/authSlice";
import { useDispatch } from "react-redux";

const Transfer = () => {
    const location = useLocation();

    const getQueryParam = (key) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const toParam = getQueryParam("to");
    const amountParam = getQueryParam("amount");

    const navigate = useNavigate();
    const [amount, setAmount] = useState(amountParam || '');
    const [recipient, setRecipient] = useState(toParam || "");
    const [recipientUser, setRecipientUser] = useState("");
    const [securityPin, setSecurityPin] = useState('');
    const [step, setStep] = useState(1);
    const [pinError, setPinError] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transfersUser, setTransfersUser] = useState([]);

    const dispatch = useDispatch();


    const handleReload = async () => {
        const response = await AuthService.getProfile();
        dispatch(setUserData({ user: response.data }));
    };

    useEffect(() => {
        checkPinSet()
        fetchTransfers()
    }, [])

    const fetchTransfers = async () => {
        try {
            const response = await walletService.getTransferUser()
            setTransfersUser(response)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const checkPinSet = async () => {
        try {
            await walletService.checkPinSet()
            console.log("done")
        } catch (error) {
            toast.error("Please set your payment pin first.")
            navigate("/wallet")
        }
    }

    const handleRecipientEnter = async(e) =>{
        const value = e.target.value
        setRecipient(value)
        if(value.length > 9 && value.includes("@ejuuz")){
            try {
                const user = await walletService.findUserByPaymentId(value);
                setRecipientUser(user)
            } catch (error) {
                setRecipientUser("")
            }
        }else{
            setRecipientUser("")
        }
    }

    console.log(recipientUser)

    const handleSendMoney = () => {
        if (amount && recipient) {
            setStep(2); // Proceed to security PIN step
        }
    };

    const handleSubmitPin = async () => {
        try {
            await walletService.transferMoney(recipient, amount, securityPin)
            setShowSuccessModal(true)
        } catch (error) {
            console.log(error)
            setPinError(true);
        }
    };

    const handleBack = async () => {
        await handleReload()
        setStep(1)
        setSecurityPin("")
        setAmount("")
        setRecipient("")
        setPinError(false)
        navigate("/wallet")
    }

    return (
        <div className="bg-gray-100 p-4">
            <div className="mx-auto bg-white shadow-lg rounded-xl">
                {/* Header */}
                <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
                    <ArrowLeftIcon
                        className="mr-4 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-xl font-bold flex-grow">Transfer Money</h1>
                </div>

                <div className="p-6 space-y-4">
                    {step === 1 && (
                        <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-blue-900 mb-2">Recent Transfers</h3>
                                <div className={`flex justify-start`}>
                                    {transfersUser?.slice(0, 5)?.map((transfer) => {
                                        if (transfer.paymentId) return (<div key={transfer._id} className="flex flex-col items-center w-20 cursor-pointer" onClick={() => { setRecipient(transfer.paymentId); setRecipientUser({name: transfer.name, paymentId: transfer.paymentId})}}>
                                            <img
                                                src={transfer?.profile?.url}
                                                alt={transfer?.name}
                                                className="w-12 h-12 rounded-full mt-2"
                                            />
                                            <span className="text-sm text-center">{transfer.name}</span>
                                        </div>);
                                    }
                                    )}
                            </div>
                            {/* Recipient Input */}
                            <div>
                                <label className="text-sm font-medium text-blue-900 mb-2 block">
                                    Recipient
                                </label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={handleRecipientEnter}
                                    placeholder="Enter Payment Id"
                                    className="w-full p-4 border-2 border-blue-100 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {
                                (recipientUser) && (<p>Money transfer to <span className='font-bold'>{recipientUser?.name}</span></p>)
                            }

                            {/* Amount Input */}
                            <div>
                                <label className="text-sm font-medium text-blue-900 mb-2 block">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-blue-500">R</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full p-4 pl-8 border-2 border-blue-100 rounded-lg text-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="grid grid-cols-3 gap-4">
                                {[100, 200, 500].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setAmount(value.toString())}
                                        className="py-3 px-4 bg-blue-50 border-2 border-blue-100 rounded-lg hover:bg-blue-100 text-blue-900"
                                    >
                                        R{value}
                                    </button>
                                ))}
                            </div>

                            {/* Transfer Button */}
                            <button
                                onClick={handleSendMoney}
                                disabled={!(recipientUser?.name ? true: false) || !amount}
                                className={`w-full py-4 rounded-lg font-semibold text-white ${(!(recipientUser.name ? false: true) && amount)
                                    ? 'bg-blue-900 hover:bg-blue-800'
                                    : 'bg-blue-300 cursor-not-allowed'
                                    }`}
                            >
                                Send Money
                            </button>
                        </div>
                    )}

                    {step === 2 && (
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
                                    Transfer Successful!
                                </h3>
                                <p className="text-blue-700 mb-4">
                                    R{amount} has been sent to {recipient}.
                                </p>
                                <button
                                    onClick={handleBack}
                                    className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                                >
                                    Back to Wallet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transfer;