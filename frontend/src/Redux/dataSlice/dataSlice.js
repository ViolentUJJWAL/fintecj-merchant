import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: null,
  orders: null,
  shop: null,
  loading: false,
};

const dataSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products;
      state.error = null;
      state.loading = false;
    },
    setOrder: (state, action) => {
        state.orders = action.payload.orders;
        state.error = null;
        state.loading = false;
      },
    setShop: (state, action) => {
        state.shop = action.payload.shop;
        state.error = null;
        state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setProducts, setOrder, setShop, setLoading } = dataSlice.actions;

export default dataSlice.reducer;


