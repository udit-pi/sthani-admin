import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      return { message: action.payload };
    },
    clearMessage: () => {
      return { message: "" };
    },
  },
});

// const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = messageSlice.actions
export const getMessage = (state) => state.message.message;
export default messageSlice.reducer;