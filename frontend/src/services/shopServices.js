import api from "../services/api"

const shopServices = {

    getShopById: async (shopId) => {
        try {
            const response = await api.get(`/shop/${shopId}`);
            console.log('Get shop response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting shop:', error);
            console.error('Error details:', error.response?.data || error.message);
            throw error;
        }
    },


    updateShop: async (shopId, updateData) => {
        try {
            const response = await api.put(`/shop/${shopId}`, updateData);
            console.log('Update shop response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating shop:', error);
            console.error('Error details:', error.response?.data || error.message);
            throw error;
        }
    },
    getMyShop: async () => {
        try {
            const response = await api.get('/shop');
            console.log('Get my shop response:', response.data);
            return response.data.shop; // returning just the shop object since that's what we need
        } catch (error) {
            console.error('Error getting my shop:', error);
            console.error('Error details:', error.response?.data || error.message);
            throw error;
        }
    },
};

export default shopServices;