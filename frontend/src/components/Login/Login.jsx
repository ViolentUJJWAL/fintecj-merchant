import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthService from '../../services/authServices';
import { loginFailure, loginSuccess } from '../../Redux/authSlice/authSlice';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const data = await AuthService.login(userId, password)
            const user = data.data; // Replace with actual data
            const token = data.token; // Replace with an actual token from the backend
            // Dispatch loginSuccess action to store user and token in Redux
            dispatch(loginSuccess({ user, token }));
            navigate('/');
        } catch (error) {
            console.log(error)
            dispatch(loginFailure());
        } finally {
            setLoading(false)
        }
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">Welcome Back</h2>
                    <p className="text-center text-gray-600">Sign in to your merchant account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                id="userId"
                                type="text"
                                required
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                placeholder="User ID"
                            />
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 border-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <p
                            onClick={() => navigate('/forget-password')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                        >
                            Forgot password?
                        </p>

                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 rounded-xl">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-3 text-white rounded-xl transition-all duration-200 font-medium
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'}`}
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                    Not registered yet?{' '}
                    <p
                        onClick={() => navigate('/seller-registration')}
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Create an account
                    </p>
                </p>
            </div>
        </div>
    );
};

export default Login;