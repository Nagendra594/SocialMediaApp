import { createSlice } from "@reduxjs/toolkit";

const initialState = { frnds: [], searchValue: "" };
const searchFrndsSlice = createSlice({
  name: "searchFrnds",
  initialState,
  reducers: {
    setSearchFrnds(state, action) {
      state.frnds = action.payload;
      return state;
    },
    reset() {
      return initialState;
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
      return state;
    },
  },
});
export default searchFrndsSlice.reducer;
export const searchFrndActions = searchFrndsSlice.actions;
