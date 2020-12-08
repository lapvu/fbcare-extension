import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        display_name: "",
        roles: []
    },
    reducers: {
        login: (state, actions): any => {
            const { display_name, roles }: any = jwt_decode(actions.payload);
            state.display_name = display_name;
            state.roles = roles
            state.isAuthenticated = true;
            localStorage.setItem("access_token", actions.payload)
        },
        logout: (state): any => {
            state.display_name = "";
            state.roles = [];
            state.isAuthenticated = false;
            localStorage.removeItem("access_token")
        }
    }
})

const { actions, reducer } = authSlice
export const { login, logout } = actions
export default reducer;