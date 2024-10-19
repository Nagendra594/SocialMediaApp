import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const onlineUserStore = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state = action.payload;
      return state;
    },
  },
});
export default onlineUserStore.reducer;
export const onlineUserActions = onlineUserStore.actions;
