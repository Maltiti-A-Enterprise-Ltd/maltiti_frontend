import axios from "axios";
import { setUser } from "../features/user/userSlice";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default axios.create({
  baseURL: BACKEND_URL,
});

let store;

export const injectStore = (_store) => {
  store = _store;
};

export const axiosPrivate = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});
let isRefreshing = false;
axiosPrivate.interceptors.request.use(
  (config) => {
    if (isRefreshing) {
      return Promise.reject();
    }
    if (!config.headers["Authorization"]) {
      const token = store?.getState()?.user?.user?.accessToken;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,

  async (error) => {
    isRefreshing = true;
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const newAccessToken = await refreshToken();
      prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosPrivate(prevRequest);
    }
    return Promise.reject(error);
  },
);

const refreshToken = async () => {
  const userData = store.getState().user.user;
  const refreshToken = userData?.refreshToken;
  try {
    const response = await axios.post(
      `${BACKEND_URL}/authentication/refresh-token/`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    const user = store?.getState()?.user?.user;
    user.accessToken = response.data.accessToken;
    console.log("Before Dispatch");
    store.dispatch(setUser(user));
    console.log("After Dispatch");
    return response.data.accessToken;
  } catch (error) {
    localStorage.clear();
    window.location.href = "/";
  }
};
