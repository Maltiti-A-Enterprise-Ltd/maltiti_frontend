import axios from "axios";

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

axiosPrivate.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const token = store?.getState()?.user?.user?.accessToken;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// axiosPrivate.interceptors.response.use(
//   (response) => response,
//
//   async (error) => {
//     const prevRequest = error?.config;
//     if (error?.response?.status === 401 && !prevRequest?.sent) {
//       prevRequest.sent = true;
//       const newAccessToken = await refreshToken();
//       prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//       return axiosPrivate(prevRequest);
//     }
//     return Promise.reject(error);
//   },
// );

// const refreshToken = async () => {
//   const userData = store.getState().user.user;
//   const refresh = userData?.refreshToken;
//   try {
//     const response = await axios.get(
//       `${BACKEND_URL}/authentication/refresh-token/`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${refresh}`,
//         },
//       },
//     );
// if (token) {
//   token["access"] = response?.data?.access_token;
// }
// store.dispatch(refreshTokenUpdate(response.data.access_token));
// localStorage.setItem("token", JSON.stringify(token));
//     return response.data.access_token;
//   } catch (error) {
//     localStorage.clear();
//     // store.dispatch(clearTokens());
//     window.location.href = "/";
//   }
// };
