/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { axiosPrivate } from "../../utility/axios";
import { imagePaths, SERVER_ERROR } from "../../utility/constants";
import { openBackDrop, openModal, setToast } from "../toast/toastSlice";
import { default as defaultAxios } from "axios";

const initialState = {
  status: "idle",
  user: null,
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

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post(`/authentication/reset-password`, data);
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

export const verifyPhone = createAsyncThunk(
  "user/verifyPhone",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post(`/authentication/verify-phone`, data);
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

export const generateCode = createAsyncThunk(
  "user/generateCode",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post(`/authentication/generate-code`, data);
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
      const user = response.data.data;
      localStorage.setItem("$maltitiUser", JSON.stringify(user));
      dispatch(
        setToast({
          type: "success",
          message: response.data.message,
        }),
      );
      return user;
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

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    try {
      const response = await axiosPrivate.post(`/authentication/logout`);
      localStorage.removeItem("$maltitiUser");
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

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { dispatch }) => {
    try {
      const response = await axiosPrivate.put(`/customer/profile`, userData);
      const user = response.data.data;
      localStorage.setItem("$maltitiUser", JSON.stringify(user));
      dispatch(
        setToast({
          type: "success",
          message: response.data.message,
        }),
      );
      return user;
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

export const loadUser = createAsyncThunk("user/loadUser", async () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("$maltitiUser");
    return user ? JSON.parse(user) : null;
  }
  return null;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      state.user = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, user: action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("$maltitiUser", JSON.stringify(state.user));
        }
      }
    },
    openPhoneVerification: (state) => {
      state.openPhoneVerification = true;
    },
    closePhoneVerification: (state) => {
      state.openPhoneVerification = false;
    },
    toggleOpenPhoneVerification: (state) => {
      state.openPhoneVerification = !state.openPhoneVerification;
    },
    openCodeVerification: (state) => {
      state.openCodeVerification = true;
    },
    closeCodeVerification: (state) => {
      state.openCodeVerification = false;
    },
    toggleOpenCodeVerification: (state) => {
      state.openCodeVerification = !state.openCodeVerification;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(signUp.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(resetPassword.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(verifyPhone.pending, (state) => {
        state.verifyStatus = "loading";
      })
      .addCase(verifyPhone.fulfilled, (state) => {
        state.verifyStatus = "idle";
      })
      .addCase(verifyPhone.rejected, (state) => {
        state.verifyStatus = "failed";
      })
      .addCase(generateCode.pending, (state) => {
        state.generateStatus = "loading";
      })
      .addCase(generateCode.fulfilled, (state) => {
        state.generateStatus = "idle";
      })
      .addCase(generateCode.rejected, (state) => {
        state.generateStatus = "failed";
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {
  setUser,
  resetUser,
  updateUser,
  openPhoneVerification,
  closePhoneVerification,
  toggleOpenPhoneVerification,
  openCodeVerification,
  closeCodeVerification,
  toggleOpenCodeVerification,
} = userSlice.actions;

// Aliases for backward compatibility
export const generateOtp = generateCode;
export const savePhoneNumber = verifyPhone;

export default userSlice.reducer;
