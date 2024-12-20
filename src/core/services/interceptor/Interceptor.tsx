import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

import { getItem } from "../storage/Storage";
import { SignOutDeveloper } from "../api/developer-authentication.api";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_SERVER_URL
    : "http://localhost:8080";

const instance: AxiosInstance = axios.create({
  baseURL,
});
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("baseURL", baseURL);
const handleUnauthorized = (message: string) => {
  SignOutDeveloper();
  // Show a notification
  toast.error(message || "Your session has expired. Please log in again.");
};

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handling 2xx status code, successful responses.
    return response;
  },
  (error) => {
    // Handling status codes outside the range of 2xx, client and server error responses.

    if (error.response) {
      const { status, data } = error.response;
      // Handle expected client errors (4xx)
      if (status >= 400 && status < 500) {
        if (status === 401) {
          // Handle 401 Unauthorized
          handleUnauthorized(error.response.data.message);
          return error.response;
        } else if (status === 403) {
          toast.error(
            data.message || "You are not authorized to perform this action."
          );
        } else if (status === 404) {
          toast.error(data.message || "Resource not found.");
        } else {
          toast.error(data.message || "Client error occurred.");
        }
        console.error("Client error:", data);
      } else if (status === 500) {
        toast.error(data.message || "Something went wrong.");
      }
    } else {
      // Handle network errors or other unexpected errors
      console.error("Error:", error.message);
      toast.error("Network error: Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Setting token before request is sent
    const token = getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handling request error
    return Promise.reject(error);
  }
);

export const methods = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export { instance };
