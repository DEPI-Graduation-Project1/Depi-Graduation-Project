import { createSlice, createAsyncThunk, __DO_NOT_USE__ActionTypes} from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all orders for admin
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
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
            return response.data; // expected => array of orders
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data; // expected => updated order object
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Delete an order

export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
             await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return  id ; // return deleted order id
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalorders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalorders = action.payload.length;

                // Calculate total sales
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            })
                
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // Update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            // Delete order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
            });
    },
});


export default adminOrderSlice.reducer;

