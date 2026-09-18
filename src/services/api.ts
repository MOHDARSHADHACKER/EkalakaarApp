import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// TODO: yahan apna backend base URL daalo
//
// const api = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
// });

//checks

const api = axios.create({
  baseURL: "https://api.ekalakaar.com/api/v1",
});
// ---------- REQUEST INTERCEPTOR ----------
// Har request se pehle accessToken header me laga dega
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------- RESPONSE INTERCEPTOR ----------
// Agar jwt expire ho jaye to refresh token se naya access token lega
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const name = error?.response?.data?.error?.name;

    // Backend me ensure karo ki expiry pe 401 + "jwt expired" bhejo
    const isTokenExpired =
      status === 401 &&
      (message === "jwt expired" || name === "TokenExpiredError");

    if (isTokenExpired && !originalRequest._retry) {
      if (isRefreshing) {
        // ek time pe sirf ek refresh call – baaki queue me
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const refreshResponse = await axios.post(
          "https://api.ekalakaar.com/api/v1/auth/refresh-token",
          { refreshToken },
        );
        const newAccessToken = refreshResponse.data.accessToken;
        const newRefreshToken = refreshResponse.data.refreshToken;

        // naye tokens save karo
        await AsyncStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem("refreshToken", newRefreshToken);
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // original request dubara bhejo
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Refresh bhi fail ho gaya – logout: tokens clear + login pe bhejo
        await AsyncStorage.multiRemove([
          "accessToken",
          "refreshToken",
          "role",
          "userData",
        ]);

        // Expo Router ko direct yahan import nahi kar sakte,
        // isliye tum SignIn ya Splash me "token missing" detect karke login pe bhej sakte ho.
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
