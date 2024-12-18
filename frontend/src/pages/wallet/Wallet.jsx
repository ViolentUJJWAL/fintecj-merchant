import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, PlusIcon, SendIcon, LockIcon, RefreshCwIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../Redux/authSlice/authSlice';
import AuthService from '../../services/authServices';
import { toast } from 'react-toastify';
import PaymentPinModal from './PaymentPinModal';
import walletService from '../../services/walletService ';
import TransactionCard from './Transactions/TransactionCard';

const WalletPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [balance, setBalance] = useState(user?.walletBalance || 0);
  const [loading, setLoading] = useState(false);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);


  const [transfersUser, setTransfersUser] = useState([]);
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    fetchTransactions()
    fetchTransfers()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await walletService.getAllTransactions()
      setTransactions(response)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTransfers = async () => {
    try {
      const response = await walletService.getTransferUser()
      setTransfersUser(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleReload = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getProfile();
      dispatch(setUserData({ user: response.data }));
      setBalance(response.data.walletBalance || 0);
      fetchTransactions()
      toast.success("Reload balance successfully.");
    } catch (error) {
      toast.error(error.message || 'Failed to reload data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPaymentPin = () => {
    setIsPinSetupOpen(true);
  };

  // const handleTransactionClick = (transaction) => {
  //   navigate(`/transaction-detail/${transaction.id}`, { state: { transaction } });
  // };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleNavigateAddFunds = () => {
    navigate('/add-funds');
  };

  const handleNavigateWithdraw = () => {
    navigate('/withdraw');
  };

  const handleNavigateTransfer = () => {
    navigate('/transfer');
  };

  const handleNavigateTransactionHistory = () => {
    navigate('/transaction-history');
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={handleNavigateBack} />
          <h1 className="text-xl font-bold flex-grow">My Wallet</h1>
          <RefreshCwIcon
            className={`cursor-pointer ${loading ? "animate-spin" : ""}`}
            onClick={handleReload}
          />
        </div>

        {/* Balance Section */}
        <div className="text-center py-6 bg-blue-50">
          <p className="text-sm text-gray-600">Total Balance</p>
          <h2 className="text-3xl font-bold text-blue-900">R{balance.toFixed(2)}</h2>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 p-4">
          <button
            className="flex flex-col items-center p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={handleNavigateAddFunds}
          >
            <PlusIcon />
            <span className="text-xs mt-1">Add</span>
          </button>
          <button
            className="flex flex-col items-center p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={handleNavigateWithdraw}
          >
            <SendIcon />
            <span className="text-xs mt-1">Withdraw</span>
          </button>
          <button
            className="flex flex-col items-center p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={handleNavigateTransfer}
          >
            <SendIcon className="rotate-45" />
            <span className="text-xs mt-1">Transfer</span>
          </button>
          <button
            className="flex flex-col items-center p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={handleSetPaymentPin}
          >
            <LockIcon />
            <span className="text-xs mt-1">Set PIN</span>
          </button>
        </div>

        {/* Payment PIN Modal */}
        <PaymentPinModal
          isOpen={isPinSetupOpen}
          onClose={() => setIsPinSetupOpen(false)}
        />

        {/* Recent Transfers */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Recent Transfers</h3>
          <div className={`flex justify-start`}>
            <div className="flex flex-col items-center w-20" onClick={handleNavigateTransfer}>
              <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mt-2">
                <Plus className="w-6 h-6 text-blue-800" />
              </button>
              <span className="text-sm text-center">Transfer</span>
            </div>
            {
              (transfersUser.length === 0) &&
              (
                <>
                  <div className="bg-gray-200 rounded-full p-2 w-12 h-12 rounded-full mt-2 mr-4"></div>
                  <div className="bg-gray-200 rounded-full p-2 w-12 h-12 rounded-full mt-2"></div>
                </>
              )
            }
            {transfersUser?.slice(0, 5)?.map((transfer) => (
              <div key={transfer._id} className="flex flex-col items-center w-20 cursor-pointer" onClick={() => { navigate(`/transfer?to=${transfer?.paymentId}`) }}>
                <img
                  src={transfer?.profile?.url}
                  alt={transfer?.name}
                  className="w-12 h-12 rounded-full mt-2"
                />
                <span className="text-sm text-center">{transfer.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* All Transactions */}
        <div className="p-4">
          <div className="flex justify-between items-center text-blue-900 mb-2">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <button
              onClick={handleNavigateTransactionHistory}
              className="text-blue-900 text-sm"
            >
              View All
            </button>
          </div>
          {
            (transactions.length > 0) && (
              <div className="p-4 space-y-4">
                {transactions.slice(0,5).map(transfer => <TransactionCard key={transfer._id} transfer={transfer} user={user} />)}
              </div>)
          }
          {
            (transactions.length === 0) &&
            (
              <div className="space-y-4 mt-6 p-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default WalletPage;