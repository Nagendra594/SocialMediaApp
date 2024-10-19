import { createSlice } from "@reduxjs/toolkit";
const initialState = null;

const userStore = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, action) {
      state = action.payload;
      return state;
    },
    reset(state) {
      return initialState;
    },
  },
});

export default userStore.reducer;
export const userActions = userStore.actions;
