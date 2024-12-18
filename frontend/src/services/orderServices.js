import api from '../services/api';

const orderServices = {

    getMerchantOrders: async () => {
        try {
            console.log('Fetching merchant orders...');
            const response = await api.get('/order');

            console.log('Merchant Orders Fetched Successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching merchant orders:', error);

            if (error.response) {
                console.error('Server Error Details:', {
                    status: error.response.status,
                    message: error.response.data.error
                });
                throw new Error(error.response.data.error || 'Unable to fetch orders');
            }

            throw error;
        }
    },
    
    latestOrders: async () => {
        try {
            console.log('Fetching merchant orders...');
            const response = await api.get('/order/latest');

            console.log('Merchant Orders Fetched Successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching merchant orders:', error);

            if (error.response) {
                console.error('Server Error Details:', {
                    status: error.response.status,
                    message: error.response.data.error
                });
                throw new Error(error.response.data.error || 'Unable to fetch orders');
            }

            throw error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            // console.log(`Attempting to update order status for Order ID: ${orderId}`);
            // console.log('New Status:', status);

            const response = await api.put(`/order/${orderId}`, { status });

            console.log('Order Status Updated Successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);

            if (error.response) {
                console.error('Server Error Details:', {
                    status: error.response.status,
                    message: error.response.data.error
                });

                const errorMap = {
                    404: 'Order not found',
                    400: 'Invalid status value',
                    403: 'Unauthorized to change this order',
                    500: 'Internal server error'
                };

                const errorMessage = errorMap[error.response.status] ||
                    error.response.data.error ||
                    'Unable to update order status';

                throw new Error(errorMessage);
            }

            throw error;
        }
    },

    ORDER_STATUSES: {
        NEW: 'New',
        PREPARING: 'Preparing',
        PICKED_UP: 'Picked Up',
        COMPLETE: 'Complete',
        REJECT: 'Reject'
    },

    // Validate Order Status
    validateOrderStatus: (status) => {
        const validStatuses = Object.values(orderServices.ORDER_STATUSES);
        const isValid = validStatuses.includes(status);

        console.log(`Validating Order Status: ${status}`);
        console.log(`Is Valid: ${isValid}`);

        return isValid;
    }
};

export default orderServices;