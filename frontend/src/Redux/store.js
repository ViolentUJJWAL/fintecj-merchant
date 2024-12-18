import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice/authSlice'
import dataReducer from "./dataSlice/dataSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        allData: dataReducer,
    },
})
