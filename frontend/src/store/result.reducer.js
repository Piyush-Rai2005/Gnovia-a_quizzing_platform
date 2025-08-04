import { createSlice } from "@reduxjs/toolkit";

export const resultReducer = createSlice({
  name: "result",
  initialState: {
    userId: null,
    username: "",
    result: []
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    pushResultAction: (state, action) => {
      // Now each entry is a full result object
      state.result.push(action.payload);
    },
    updateResultAction: (state, action) => {
      const { trace, checked, pointsAwarded } = action.payload;
      state.result[trace] = { ...state.result[trace], checked, pointsAwarded };
    },
    resetResultAction: () => {
      return {
        userId: null,
        username: "",
        result: []
      };
    }
  }
});

export const {
  setUserId,
  setUsername,
  pushResultAction,
  updateResultAction,
  resetResultAction
} = resultReducer.actions;

export default resultReducer.reducer;
