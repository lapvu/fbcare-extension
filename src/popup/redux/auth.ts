import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        displayName: "",
        email: ""
    },
    reducers: {
        login: (state, actions): any => {
            const { displayName, email }: any = jwt_decode(actions.payload);
            state.displayName = displayName;
            state.email = email;
            state.isAuthenticated = true;
            localStorage.setItem("access_token", actions.payload)
        },
        logout: (state): any => {
            state.displayName = "";
            state.email = "";
            state.isAuthenticated = false;
            localStorage.removeItem("access_token")
        }
    }
})

const { actions, reducer } = authSlice
export const { login, logout } = actions
export default reducer;