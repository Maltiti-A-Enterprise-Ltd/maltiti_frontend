/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../utility/axios";
import { SERVER_ERROR } from "../../utility/constants";
import { closeBackDrop, openBackDrop, setToast } from "../toast/toastSlice";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    retail: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface CartState {
  status: string;
  cart: CartItem[];
  cartTotal: number;
  shake: boolean;
  adding: string;
  id: string;
  removeStatus: string;
  totalPrice: number;
  confirmPaymentStatus: string;
  transportation: any;
  orders: any[];
  order: any;
  isOrderOpen: boolean;
}

const initialState: CartState = {
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
  async (data: any, { getState, dispatch }) => {
    const { cart, user } = getState() as any;
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
      if (typeof window !== "undefined") {
        window.location.href = response.data.data.authorization_url;
      }
    } catch (error: any) {
      dispatch(closeBackDrop());
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.error || SERVER_ERROR,
        }),
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id: number, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      await axiosPrivate.delete(`/cart/${id}`);
      dispatch(removeCart(id));
      dispatch(closeBackDrop());
    } catch (error: any) {
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
  async (location: string, { dispatch, getState }) => {
    const { user } = getState() as any;
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(
        `/checkout/${user.user.user.id}/${location}`,
      );
      dispatch(updateTransportation(response.data.data));
      dispatch(closeBackDrop());
    } catch (error: any) {
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
  "cart/updateCartQuantity",
  async ({ id, quantity }: { id: number; quantity: number }, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.patch(`/cart/${id}`, { quantity });
      dispatch(updateCart(response.data.data));
      dispatch(closeBackDrop());
    } catch (error: any) {
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
  async (userId: number, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(`/cart/${userId}`);
      dispatch(updateCart(response.data.data));
      dispatch(closeBackDrop());
    } catch (error: any) {
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
  async (
    { userId, productId }: { userId: number; productId: number },
    { dispatch },
  ) => {
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
    } catch (error: any) {
      dispatch(closeBackDrop());
      if (error.response?.status === 409) {
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
    const { user } = getState() as any;
    const userId = user.user.user.id;
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(`/checkout/orders/${userId}`);
      dispatch(updateOrders(response.data.data));
      dispatch(closeBackDrop());
    } catch (error: any) {
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
  async (id: number, { getState, dispatch }) => {
    const { user } = getState() as any;
    const userId = user.user.user.id;
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.get(`/checkout/order/${id}`);
      dispatch(updateOrder(response.data.data));
      dispatch(closeBackDrop());
      dispatch(setIsOrderOpen(true));
    } catch (error: any) {
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
  async (id: number, { dispatch }) => {
    dispatch(openBackDrop());
    try {
      const response = await axiosPrivate.patch(`/checkout/cancel-order/${id}`);
      dispatch(updateOrder(response.data.data));
      dispatch(closeBackDrop());
      dispatch(getOrder(id));
    } catch (error: any) {
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
    updateCart: (state, action: PayloadAction<any>) => {
      state.cart = action.payload[0];
      state.cartTotal = action.payload[1];
      state.totalPrice = action.payload[2];
    },
    setShake: (state) => {
      state.shake = !state.shake;
    },
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const findCart = state.cart.find((cart) => cart.id === id);
      if (findCart && quantity >= 1) {
        findCart.quantity = quantity;
      }
    },
    updateConfirmPaymentStatus: (state, action: PayloadAction<string>) => {
      state.confirmPaymentStatus = action.payload;
    },
    removeCart: (state, action: PayloadAction<number>) => {
      const cart = state.cart.find((cart) => cart.id === action.payload);
      state.cart = state.cart.filter((cart) => cart.id !== action.payload);
      if (cart) {
        state.totalPrice =
          state.totalPrice -
          parseInt(cart.product.retail) * parseInt(cart.quantity.toString());
        state.cartTotal = state.cartTotal - 1;
      }
    },
    updateTransportation: (state, action: PayloadAction<any>) => {
      state.transportation = action.payload;
    },
    updateOrders: (state, action: PayloadAction<any[]>) => {
      state.orders = action.payload;
    },
    updateOrder: (state, action: PayloadAction<any>) => {
      state.order = action.payload;
    },
    setIsOrderOpen: (state, action: PayloadAction<boolean>) => {
      state.isOrderOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCart.rejected, (state) => {
        state.status = "error";
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.adding = "success";
      })
      .addCase(addToCart.pending, (state) => {
        state.adding = "loading";
      })
      .addCase(addToCart.rejected, (state) => {
        state.adding = "error";
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.removeStatus = "success";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.removeStatus = "loading";
      })
      .addCase(removeFromCart.rejected, (state) => {
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
  updateOrders,
  updateOrder,
  setIsOrderOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
