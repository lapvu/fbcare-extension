import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";

const rootReducer = combineReducers({
    authReducer
})

export const store = configureStore({
    reducer: rootReducer
})