/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utility/axios";
import { SERVER_ERROR } from "../../utility/constants";
import { setToast } from "../toast/toastSlice";

const initialState = {
  status: "idle",
  user: JSON.parse(window.localStorage.getItem("$maltitiUser")),
};

export const signUp = createAsyncThunk(
  "user/signUp",
  async (userData, { dispatch }) => {
    try {
      const response = await axios.post(
        `/authentication/customer-signup`,
        userData,
      );
      dispatch(
        setToast({
          type: "success",
          message: response.data.message,
        }),
      );
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.error || SERVER_ERROR,
        }),
      );
    }
  },
);

export const login = createAsyncThunk(
  "user/login",
  async (userData, { dispatch }) => {
    try {
      const response = await axios.post(`/authentication/login`, userData);
      dispatch(setUser(response.data.data));
      dispatch(
        setToast({
          type: "success",
          message: `Welcome ${response.data.data.user.name}`,
        }),
      );
      window.location.href = `/`;
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.message || SERVER_ERROR,
        }),
      );
    }
  },
);

export const verifying = createAsyncThunk(
  "user/verifying",
  async ({ id, token }) => {
    try {
      await axios.get(`/authentication/verify/${id}/${token}`);
      window.location.href = `/verification-success`;
    } catch (error) {
      window.location.href = `/verification-error`;
      throw new Error(error);
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
    builder.addCase(login.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.rejected, (state) => {
      state.status = "error";
    });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
