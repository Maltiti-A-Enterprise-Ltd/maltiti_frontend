/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { axiosPrivate } from "../../utility/axios";
import { imagePaths, SERVER_ERROR } from "../../utility/constants";
import { openBackDrop, openModal, setToast } from "../toast/toastSlice";
import { default as defaultAxios } from "axios";

const initialState = {
  status: "idle",
  user: JSON.parse(window.localStorage.getItem("$maltitiUser")),
  openPhoneVerification: false,
  openCodeVerification: false,
  generateStatus: "idle",
  verifyStatus: "idle",
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

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { dispatch }) => {
    try {
      const response = await axios.post(`/authentication/forgot-password`, {
        email,
      });

      dispatch(
        openModal({
          message: response.data.message,
          image: imagePaths.mailBox,
        }),
      );
      dispatch(
        setToast({
          type: "success",
          message: response.data.message,
        }),
      );
      return response;
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.error || SERVER_ERROR,
        }),
      );
      throw new Error(error);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, password, confirmPassword }, { dispatch }) => {
    try {
      const response = await axios.post(`/authentication/reset-password`, {
        token,
        password,
        confirmPassword,
      });
      dispatch(
        openModal({
          message: response.data.message,
          image: imagePaths.highfive,
        }),
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

export const generateOtp = createAsyncThunk(
  "user/generateOtp",
  async (phoneNumber, { dispatch }) => {
    try {
      const response = await defaultAxios.post(
        `https://sms.arkesel.com/api/otp/generate`,
        {
          expiry: 10,
          length: 6,
          medium: "sms",
          message:
            "Your verification code is %otp_code%, Do NOT share it. For help email support@maltitiaenterprise.com",
          number: phoneNumber,
          sender_id: "Maltiti",
          type: "numeric",
        },
        { headers: { "api-key": `${process.env.REACT_APP_SMS_API_KEY}` } },
      );
      dispatch(toggleOpenPhoneVerification());
      dispatch(toggleOpenCodeVerification());
      dispatch(
        setToast({
          type: "success",
          message: "A verification code has been sent to your number",
        }),
      );
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

export const savePhoneNumber = createAsyncThunk(
  "user/savePhoneNumber",
  async ({ phoneNumber, code }, { dispatch, getState }) => {
    const { user } = getState();
    const id = user.user.user.id;
    try {
      const response = await axiosPrivate.post(
        `/authentication/verify-phone/${id}`,
        { phoneNumber, code },
      );
      dispatch(toggleOpenCodeVerification());
      dispatch(updateUser(response.data.data));
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
          message: error.response?.data?.message || SERVER_ERROR,
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

export const logout = createAsyncThunk(
  "user/logout",
  async (userData, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      await axiosPrivate.post(`/authentication/invalidate-token`, userData);
      dispatch(resetUser());
      window.location.href = `/`;
    } catch (error) {
      dispatch(resetUser());
      window.location.href = `/`;
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
    updateUser: (state, action) => {
      state.user.user = action.payload;
      localStorage.setItem("$maltitiUser", JSON.stringify(state.user));
    },
    resetUser: (state) => {
      localStorage.clear();
      state.user = undefined;
    },
    toggleOpenPhoneVerification: (state) => {
      state.openPhoneVerification = !state.openPhoneVerification;
    },
    toggleOpenCodeVerification: (state) => {
      state.openCodeVerification = !state.openCodeVerification;
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
    builder.addCase(savePhoneNumber.fulfilled, (state) => {
      state.verifyStatus = "success";
    });
    builder.addCase(savePhoneNumber.pending, (state) => {
      state.verifyStatus = "loading";
    });
    builder.addCase(savePhoneNumber.rejected, (state) => {
      state.verifyStatus = "error";
    });
    builder.addCase(generateOtp.fulfilled, (state) => {
      state.generateStatus = "success";
    });
    builder.addCase(generateOtp.pending, (state) => {
      state.generateStatus = "loading";
    });
    builder.addCase(generateOtp.rejected, (state) => {
      state.generateStatus = "error";
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.status = "loading";
    });
  },
});

export const {
  setUser,
  resetUser,
  toggleOpenPhoneVerification,
  toggleOpenCodeVerification,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
