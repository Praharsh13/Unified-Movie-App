import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    isAuthenticated: !!localStorage.getItem("userInfo"), // true if userInfo exists
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = true; // Set authenticated state
            console.log('User credentials set: ', action.payload);
            localStorage.setItem("userInfo", JSON.stringify(action.payload));

            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTime", expirationTime);
        },

        logout: (state) => {
            state.userInfo = null;
            state.isAuthenticated = false; // Set authenticated state to false
            console.log('User credentials cleared.');
            localStorage.clear();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
