import api from '../services/api';

const dashboardServices = {

	getStatistics: async (chunkType) => {
        try {
            const response = await api.get(`/dashboard/${chunkType}`);
            return response.data.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Unable to fetch orders');
            }
            throw error;
        }
    },
    
}

export default dashboardServices;