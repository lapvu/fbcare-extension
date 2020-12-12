import { createSlice } from "@reduxjs/toolkit";

const statusOrderSlice = createSlice({
    name: 'statusOrder',
    initialState: {
        status: []
    },
    reducers: {
        setStatus: (state, actions): any => {
            state.status = actions.payload;
        }
    }
})

const { actions, reducer } = statusOrderSlice
export const { setStatus } = actions
export default reducer;