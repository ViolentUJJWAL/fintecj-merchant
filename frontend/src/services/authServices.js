import api from './api';
import { toast } from 'react-toastify';

const AuthService = {
    // Utility to handle API calls with toast.promise
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

    // Login service
    async login(loginId, password) {
        console.log('Login function called with:', { loginId, password });
        return this.apiCallWithToast(
            api.post('/auth/login', { id: loginId, password }),
            {
                pending: 'Logging in...',
                success: 'Login successful!',
                error: 'Login failed!',
            }
        ).then(response => response.data);
    },

    // Logout service
    async logout() {
        console.log('Logout function called');
        return this.apiCallWithToast(
            api.get('/auth/logout'),
            {
                pending: 'Logging out...',
                success: 'Logout successful!',
                error: 'Logout failed!',
            }
        ).then(response => response.data);
    },

    // Register merchant - Step 1
    async sentOtp(name, email, phoneNo) {
        console.log('Sending OTP...');
        return this.apiCallWithToast(
            api.post('/auth/register-merchant/sent-otp', { name, email, phoneNo }),
            {
                pending: 'Sending OTP...',
                success: 'OTP sent successfully!',
                error: 'Failed to send OTP!',
            }
        ).then(response => response.data);
    },

    // Register merchant - Step 2
    async checkOtp(otp) {
        console.log('Checking OTP...');
        return this.apiCallWithToast(
            api.post('/auth/register-merchant/check-otp', { otp }),
            {
                pending: 'Verifying OTP...',
                success: 'OTP verified successfully!',
                error: 'Invalid OTP!',
            }
        ).then(response => response.data);
    },

    async getProfile() {
        const response = await api.get("/profile");
        return response.data;
    },

    // Register merchant - Step 3
    async requestForm(data) {
        console.log('Submitting request form...');
        console.log("form: ", data)
        return this.apiCallWithToast(
            api.post('/auth/register-merchant/request-form', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            {
                pending: 'Submitting form...',
                success: 'Form submitted successfully!',
                error: 'Form submission failed!',
            }
        ).then(response => response.data);
    },
    async forgetPassword(emailOrLoginId) {
        return this.apiCallWithToast(
            api.post('/auth/forget-password', { emailOrLoginId }),
            {
                pending: 'Send email...',
                success: 'Email send successfully!',
                error: 'Failed to forget password!',
            }
        ).then(response => response.data);
    },
    async changeForgetPassword(token, newPassword) {
        return this.apiCallWithToast(
            api.post('/auth/reset-forget-password', { token, newPassword }),
            {
                pending: 'Reset password...',
                success: 'Password change successfully!',
                error: 'Failed to forget password!',
            }
        ).then(response => response.data);
    },  
};

export default AuthService;
