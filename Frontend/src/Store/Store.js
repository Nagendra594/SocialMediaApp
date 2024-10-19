import { configureStore } from "@reduxjs/toolkit";

import userStoreReducer from "./UserStore/User";
import postStoreReducer from "./PostStore/Post";
import onlineUsersReducers from "./UserStore/onlineUsers";
import searchFrndsReducers from "./UserStore/searchFrnds";

const store = configureStore({
  reducer: {
    user: userStoreReducer,
    post: postStoreReducer,
    onlineUsers: onlineUsersReducers,
    searchFrnds: searchFrndsReducers,
  },
});

export default store;
