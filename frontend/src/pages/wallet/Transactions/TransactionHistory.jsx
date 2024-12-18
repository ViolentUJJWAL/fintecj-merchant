import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import walletService from '../../../services/walletService ';
import TransactionCard from './TransactionCard';



const TransactionHistory = () => {

    const { user } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        try {
            const response = await walletService.getAllTransactions()
            setTransactions(response)
            console.log("history", response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleTransactionClick = (transaction) => {
        navigate(`/transaction-detail/${transaction.id}`, { state: { transaction } });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="mx-auto bg-white shadow-lg rounded-xl">
                {/* Header */}
                <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
                    <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate(-1) }} />
                    <h1 className="text-xl font-bold flex-grow">Transaction History</h1>
                </div>
                {/* Transactions List */}

                {
                    (transactions.length > 0) &&(
                    <div className="p-4 space-y-4">
                        {transactions.map(transfer => <TransactionCard key={transfer._id} transfer={transfer} user={user} />)}
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
    );
};

export default TransactionHistory;
