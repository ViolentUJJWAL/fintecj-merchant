import React from 'react';
import { motion } from 'framer-motion';

const LoadingPage = ({ layout = "fullscreen" }) => {
    const containerClasses = {
        fullscreen: "fixed top-0 left-0 w-screen h-screen overflow-hidden",
        sidebar: "fixed top-[60px] left-[250px] w-[calc(100%-250px)] h-[calc(100vh-60px)] overflow-hidden"
    };

    return (
        <div
            className={`${containerClasses[layout]} bg-white flex items-center justify-center z-50 overflow-hidden`}
            style={{
                position: 'fixed',
                overflow: 'hidden'
            }}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute w-48 h-48">
                    <div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"
                        style={{ animationDuration: "3s" }}
                    />
                </div>
                <div className="absolute w-40 h-40">
                    <div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-l-red-500 animate-spin"
                        style={{ animationDuration: "2s", animationDirection: "reverse" }}
                    />
                </div>
                <div className="absolute w-32 h-32">
                    <div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 border-r-green-500 animate-spin"
                        style={{ animationDuration: "4s" }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    className="text-black text-2xl font-sans"
                >
                    Loading...
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingPage;