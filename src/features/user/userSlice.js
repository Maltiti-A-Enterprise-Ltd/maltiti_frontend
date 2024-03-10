/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utility/axios";
import { SERVER_ERROR } from "../../utility/constants";

const initialState = {
  status: "idle",
  user: JSON.parse(window.localStorage.getItem("$maltitiUser")),
};

export const signUp = createAsyncThunk(
  "user/signUp",
  async (userData, { dispatch }) => {
    try {
      const response = await axios.post(
        `/products/all-products?page`,
        userData,
      );
      dispatch(setUser(response.data.data));
    } catch (error) {
      dispatch(setError(error.error.message || SERVER_ERROR));
    }
  },
);
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      localStorage.setItem("$maltitiUser", JSON.stringify(action.payload));
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(signUp.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(signUp.rejected, (state) => {
      state.status = "error";
    });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
