import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        conversations: [] as any,
    },
    reducers: {
        handleNewConversation: (state, payload) => {
            state.conversations.push(payload)
        },
        updateMessage: () => { }
    }
})

const { actions, reducer } = conversationSlice
export const { handleNewConversation } = actions
export default reducer;