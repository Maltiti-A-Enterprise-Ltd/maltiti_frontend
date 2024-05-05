/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../utility/axios";
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
  confirmPaymentStatus: "loading",
  transportation: undefined,
  orders: [],
  order: undefined,
  isOrderOpen: false,
};

export const completeCheckout = createAsyncThunk(
  "cart/CompleteCheckout",
  async (data, { getState, dispatch }) => {
    const { cart, user } = getState();
    if (!cart.transportation) {
      dispatch(
        setToast({
          type: "info",
          message: "Enter your location to get shipping/transport charges",
        }),
      );
      return;
    }
    dispatch(openBackDrop());
    const id = user.user.user.id;

    try {
      const response = await axiosPrivate.post(
        `checkout/initialize-transaction/${id}`,
        data,
      );
      dispatch(closeBackDrop());
      window.location.href = response.data.data.authorization_url;
    } catch (error) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message:
            error.response?.data?.message ||
            error.response?.data?.error ||
            SERVER_ERROR,
        }),
      );
    }
  },
);

export const confirmPayment = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, checkoutId }, { dispatch }) => {
    dispatch(updateConfirmPaymentStatus("loading"));
    try {
      await axiosPrivate.get(
        `/checkout/confirm-payment/${userId}/${checkoutId}`,
      );
      dispatch(updateConfirmPaymentStatus("success"));
    } catch (error) {
      dispatch(updateConfirmPaymentStatus("error"));
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.message || SERVER_ERROR,
        }),
      );
    }
  },
);

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

export const getTransportation = createAsyncThunk(
  "cart/getTransportation",
  async (location, { dispatch, getState }) => {
    const { user } = getState();
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(
        `/checkout/${user.user.user.id}/${location}`,
      );
      dispatch(updateTransportation(response.data.data));
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
      dispatch(closeBackDrop());
      dispatch(setShake());
      dispatch(updateCart(response.data.data));
      dispatch(getCart(userId));
    } catch (error) {
      dispatch(closeBackDrop());
      if (error.response.status === 409) {
        dispatch(
          setToast({
            type: "info",
            message: error.response?.data?.error || SERVER_ERROR,
          }),
        );
      } else {
        dispatch(
          setToast({
            type: "error",
            message:
              error.response?.data?.error ||
              error.response?.data?.message ||
              SERVER_ERROR,
          }),
        );
      }
    }
    dispatch(setShake());
  },
);

export const getOrders = createAsyncThunk(
  "cart/orders",
  async (_, { getState, dispatch }) => {
    const { user } = getState();
    const userId = user.user.user.id;
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(`/checkout/orders/${userId}`);
      dispatch(updateOrders(response.data.data));
      dispatch(closeBackDrop());
    } catch (error) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message:
            error.response?.data?.error ||
            error.response?.data?.message ||
            SERVER_ERROR,
        }),
      );
    }
  },
);

export const getOrder = createAsyncThunk(
  "cart/order",
  async (id, { getState, dispatch }) => {
    const { user } = getState();
    const userId = user.user.user.id;
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(`/checkout/order/${id}`);
      dispatch(updateOrder(response.data.data));
      dispatch(closeBackDrop());
      dispatch(setIsOrderOpen(true));
    } catch (error) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message:
            error.response?.data?.error ||
            error.response?.data?.message ||
            SERVER_ERROR,
        }),
      );
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "cart/cancel-order",
  async (id, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.patch(`/checkout/cancel-order/${id}`);
      dispatch(updateOrder(response.data.data));
      dispatch(closeBackDrop());
      dispatch(getOrder());
    } catch (error) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message:
            error.response?.data?.error ||
            error.response?.data?.message ||
            SERVER_ERROR,
        }),
      );
    }
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
    updateConfirmPaymentStatus: (state, action) => {
      state.confirmPaymentStatus = action.payload;
    },
    removeCart: (state, action) => {
      const cart = state.cart.find((cart) => cart.id === action.payload);
      state.cart = state.cart.filter((cart) => cart.id !== action.payload);
      state.totalPrice =
        state.totalPrice -
        parseInt(cart.product.retail) * parseInt(cart.quantity);
      state.cartTotal = state.cartTotal - 1;
    },
    updateTransportation: (state, action) => {
      state.transportation = action.payload;
    },
    updateOrders: (state, action) => {
      state.orders = action.payload;
    },
    updateOrder: (state, action) => {
      state.order = action.payload;
    },
    setIsOrderOpen: (state, action) => {
      state.isOrderOpen = action.payload;
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
  updateQuantity,
  updateId,
  updateCart,
  setShake,
  removeCart,
  updateTransportation,
  updateConfirmPaymentStatus,
  updateProducts,
  updateOrders,
  updateOrder,
  setIsOrderOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
