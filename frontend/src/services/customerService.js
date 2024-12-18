import api from './api'; // Assuming api.js is in the same directory


const customerServices = {


    getCustomerInsights: async () => {
        try {
            const response = await api.get('/customer/');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching customer insights:', error);
            throw error.response?.data || error.message;
        }
    },

    getCustomerLastOrder: async (customerId) => {
        try {
            const response = await api.get(`/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer last order:', error);
            throw error.response?.data || error.message;
        }
    },

    getCustomerOrderDetails: async (customerId) => {
        try {
            console.log(customerId)
            const response = await api.get(`/customer/details/${customerId}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching customer order details:', error);
            throw error.response?.data || error.message;
        }
    }
}


export default customerServices;