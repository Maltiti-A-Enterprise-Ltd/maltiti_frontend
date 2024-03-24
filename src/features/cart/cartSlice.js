/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { axiosPrivate } from "../../utility/axios";
import { SERVER_ERROR } from "../../utility/constants";
import { closeBackDrop, openBackDrop, setToast } from "../toast/toastSlice";

const initialState = {
  status: "idle",
  cart: [],
  cartTotal: 0,
  shake: false,
  adding: "idle",
  id: "",
  removeStatus: "idle",
  totalPrice: 0,
};

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      await axiosPrivate.delete(`/cart/${id}`);
      dispatch(removeCart(id));
      dispatch(closeBackDrop());
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.message || SERVER_ERROR,
        }),
      );
      dispatch(closeBackDrop());
    }
  },
);

export const updateCartQuantity = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, quantity }, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.patch(`/cart/${id}`, { quantity });
      dispatch(updateCart(response.data.data));
      dispatch(closeBackDrop());
    } catch (error) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.message || SERVER_ERROR,
        }),
      );
    }
  },
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (userId, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(`/cart/${userId}`);
      dispatch(updateCart(response.data.data));
      dispatch(closeBackDrop());
    } catch (error) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.message || SERVER_ERROR,
        }),
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId }, { dispatch }) => {
    dispatch(updateId(productId));
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.post(`/cart/${userId}`, {
        id: productId,
      });
      dispatch(openBackDrop());
      dispatch(setShake());
      dispatch(updateCart(response.data.data));
      dispatch(getCart(userId));
    } catch (error) {
      dispatch(openBackDrop());
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.message || SERVER_ERROR,
        }),
      );
    }
    dispatch(setShake());
  },
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    updateCart: (state, action) => {
      state.cart = action.payload[0];
      state.cartTotal = action.payload[1];
      state.totalPrice = action.payload[2];
    },
    setShake: (state, action) => {
      state.shake = !state.shake;
    },
    updateId: (state, action) => {
      state.id = action.payload;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const findCart = state.cart.find((cart) => cart.id === id);
      if (quantity >= 1) {
        findCart.quantity = quantity;
      }
    },
    removeCart: (state, action) => {
      const cart = state.cart.find((cart) => cart.id === action.payload);
      state.cart = state.cart.filter((cart) => cart.id !== action.payload);
      state.totalPrice =
        state.totalPrice -
        parseInt(cart.product.retail) * parseInt(cart.quantity);
      state.cartTotal = state.cartTotal - 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCart.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(getCart.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCart.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(addToCart.fulfilled, (state) => {
      state.adding = "success";
    });
    builder.addCase(addToCart.pending, (state) => {
      state.adding = "loading";
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.adding = "error";
    });
    builder.addCase(removeFromCart.fulfilled, (state) => {
      state.removeStatus = "success";
    });
    builder.addCase(removeFromCart.pending, (state) => {
      state.removeStatus = "loading";
    });
    builder.addCase(removeFromCart.rejected, (state) => {
      state.removeStatus = "error";
    });
  },
});

export const {
  updateProducts,
  updateQuantity,
  updateId,
  updateCart,
  setShake,
  removeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
