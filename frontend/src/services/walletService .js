import api from "./api";
import { toast } from 'react-toastify';

const walletService = {
    addMoney: (amount, pin) => {
        return toast.promise(
            api.post(`/wallet/Merchant/add-money`, { amount, pin }),
            {
                pending: "Adding money...",
                success: "Money added successfully!",
                error: "Failed to add money!",
            }
        );
    },

    withdrawMoney: (amount, pin) => {
        return toast.promise(
            api.post(`/wallet/Merchant/withdraw-money`, { amount, pin }),
            {
                pending: "Withdrawing money...",
                success: "Money withdrawn successfully!",
                error: "Failed to withdraw money!",
            }
        );
    },

    transferMoney: (toUserPaymentId, amount, pin) => {
        return toast.promise(
            api.post(`/wallet/Merchant/transfer-money`, { toUserPaymentId, amount, pin }),
            {
                pending: "Transferring money...",
                success: "Money transferred successfully!",
                error: "Failed to transfer money!",
            }
        );
    },

    checkPinSet: async () => {
        try {
            const response = await api.get(`/wallet/Merchant/check-pinset`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to check pin status!");
        }
    },

    getAllTransactions: async (transactionType) => {
        try {
            const query = transactionType ? `?transactionType=${transactionType}` : "";
            const response = await api.get(`/wallet/Merchant/transactions${query}`);
            return response.data.transactions;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to fetch transactions!");
        }
    },

    getTransferUser: async () => {
        try {
            const response = await api.get(`/wallet/Merchant/unique-users`);
            return response.data.uniqueUsers;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to fetch transactions!");
        }
    },

    findUserByPaymentId: async (paymentId) => {
        try {
            const response = await api.get(`/wallet/findUserByPaymentId/${paymentId}`);
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to fetch transactions!");
        }
    },

    verifyPassword: (password) => {
        return toast.promise(
            api.put(`/wallet/Merchant/set-pin/verifyPassword`, { password }),
            {
                pending: "Verifying password...",
                success: "Password verified successfully!",
                error: "Password verification failed!",
            }
        );
    },

    setupPaymentPin: (pin, otp) => {
        return toast.promise(
            api.put(`/wallet/Merchant/set-pin/setupPaymentPin`, { pin, otp }),
            {
                pending: "Setting up payment pin...",
                success: "Payment pin set successfully!",
                error: "Failed to set payment pin!",
            }
        );
    },
};

export default walletService;
