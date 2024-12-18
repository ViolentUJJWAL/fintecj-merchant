import React from 'react';
import AuthService from '../../services/authServices';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/authSlice/authSlice';

const Logout = () => {

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            dispatch(logout())
            window.location.href = '/login';
        } catch (error) {
            console.log(error)
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="space-y-2">
                    <div className="h-16 w-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">Sign Out</h2>
                    <p className="text-center text-gray-600">Are you sure you want to sign out?</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={handleCancel}
                        className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logout;