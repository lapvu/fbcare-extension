import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import statusReducer from "./status";

const rootReducer = combineReducers({
    authReducer,
    statusReducer
})

export const store = configureStore({
    reducer: rootReducer
})