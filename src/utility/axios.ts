import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const BACKEND_URL: string = process.env.REACT_APP_BACKEND_URL || "";

export default axios.create({
  baseURL: BACKEND_URL,
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing: boolean = false;

axiosPrivate.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (isRefreshing) {
      return Promise.reject();
    }
    if (!config.headers?.["Authorization"]) {
      const token = store?.getState()?.user?.user?.accessToken;
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
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

const refreshToken = async (): Promise<string | undefined> => {
  const userData = store.getState().user.user;
  const refreshTokenValue = userData?.refreshToken;
  try {
    const response = await axios.post(
      `${BACKEND_URL}/authentication/refresh-token/`,
      { refreshToken: refreshTokenValue },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshTokenValue}`,
        },
      },
    );
    const user = store?.getState()?.user?.user;
    user.accessToken = response.data.accessToken;
    // Temporarily comment out to break circular import
    // store.dispatch(setUser(user));
    return response.data.accessToken;
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    }
  }
};
