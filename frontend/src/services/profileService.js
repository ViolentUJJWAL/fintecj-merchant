import api from './api'; // Assuming you already have an api.js file set up
import { toast } from 'react-toastify';

const profileService = {

    async apiCallWithToast(promise, messages) {
        return toast.promise(
            promise,
            {
                pending: messages.pending || 'Processing...',
                success: messages.success || 'Operation successful!',
                error: {
                    render({ data }) {
                        // Extract error message from response
                        return data?.response?.data?.error || 'Something went wrong!';
                    },
                },
            }
        );
    },

    // Get merchant by specific ID
    async getMerchantById(id) {
        try {
            const response = await api.get(`/profile/${id}`);
            console.log('Get Merchant by ID Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get Merchant by ID Error:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Change merchant password
    async changeMerchantPassword(oldPassword, newPassword) {
        console.log('Sending OTP...');
        return this.apiCallWithToast(
            api.put('/profile/change-password', {
                oldPassword,
                newPassword
            }),
            {
                pending: 'Change password...',
                success: 'Password change successfully!',
                error: 'Failed to change password!',
            }
        ).then(response => response.data);
    },

    // Update merchant and shop information
    async updateMerchantAndShop(merchantData, shopData) {
        try {

            console.log(merchantData, shopData)
            // Create a FormData object for file uploads
            const formData = new FormData();

            // Append merchant data
            formData.append('merchantData', JSON.stringify(merchantData));

            // Append shop data
            formData.append('shopData', JSON.stringify(shopData));

            // Append files
            // if (files) {
            //     Object.keys(files).forEach(key => {
            //         formData.append(key, files[key][0]);
            //     });
            // }


            console.log(formData.get("merchantData"))

            const response = await api.put('/profile', {merchantData, shopData});

            console.log('Update Merchant and Shop Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update Merchant and Shop Error:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
};

export default profileService;