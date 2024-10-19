import { createSlice } from "@reduxjs/toolkit";
const initialState = { posts: [], hasMore: false, pageNumber: 1 };

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPost(state, action) {
      state.posts = [...state.posts, ...action.payload];
    },
    toggleHasMore(state, action) {
      state.hasMore = action.payload;
    },
    updatePageNumber(state) {
      state.pageNumber += 1;
    },
    reset(state) {
      return initialState;
    },
    interact(state, action) {
      const postId = action.payload;
      const currentUserId = localStorage.getItem("userId");
      state.posts.forEach((post) => {
        if (post._id === postId) {
          const index = post.likes.indexOf(currentUserId);

          if (index !== -1) {
            post.likes.splice(index, 1);
          } else post.likes.push(currentUserId);
        }
        return post;
      });
    },
  },
});

export default postSlice.reducer;
export const postActions = postSlice.actions;
