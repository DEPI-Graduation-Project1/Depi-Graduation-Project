import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

// =================== FETCH USER ORDERS ===================
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== FETCH ORDER DETAILS ===================
export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== FETCH ALL ORDERS (Admin) ===================
export const fetchAllOrders = createAsyncThunk(
    "orders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data; // array of all orders
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== SLICE ===================
const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ===== FETCH USER ORDERS =====
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload?.length || 0;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch orders";
            })

            // ===== FETCH ORDER DETAILS =====
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch order details";
            })

            // ===== FETCH ALL ORDERS (ADMIN) =====
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload?.length || 0;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch all orders";
            });
    },
});

export default orderSlice.reducer;
