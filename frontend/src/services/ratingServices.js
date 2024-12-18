import api from '../services/api';

const ratingServices = {

    getMerchantShopRatings: async () => {
        try {
            const response = await api.get('/rating/shop');
            return response.data;
        } catch (error) {
            console.error('Error fetching merchant shop ratings:', error);
            throw error;
        }
    },


    getProductRatings: async (productId) => {
        try {
            const response = await api.get(`/rating/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product ratings:', error);
            throw error;
        }
    },


    getAllProductsWithAvgRating: async () => {
        try {
            const response = await api.get('/rating/product');
            return response.data;
        } catch (error) {
            console.error('Error fetching products with average ratings:', error);
            throw error;
        }
    }
};

export default ratingServices;