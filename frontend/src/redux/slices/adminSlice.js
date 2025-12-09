import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =================== FETCH ALL USERS ===================
export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data; // expected => array of users
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== ADD USER ===================
export const addUser = createAsyncThunk(
    "admin/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data; // expected => { user: {...} } or {...user}
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== UPDATE USER ===================
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, name, email, role }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                { name, email, role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data; 
            // expected => { user: {...} } or {...user}
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== DELETE USER ===================
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return id;       // returning deleted ID
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// =================== SLICE ===================
const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ===== FETCH USERS =====
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // ===== ADD USER =====
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                const newUser = action.payload.user || action.payload;
                state.users.push(newUser);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // ===== UPDATE USER =====
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user || action.payload;
                const index = state.users.findIndex(u => u._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // ===== DELETE USER =====
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export default adminSlice.reducer;
