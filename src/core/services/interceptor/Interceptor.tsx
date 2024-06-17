import axios, { AxiosInstance } from "axios";

import { getItem } from "../storage/Storage";

const baseURL = "http://localhost:8080";

const instance: AxiosInstance = axios.create({
  baseURL,
});

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handling 2xx status code, successful responses.
    return response;
  },
  (error) => {
    // Handling status codes outside the range of 2xx, client error responses.
    const expectedError =
      error.response &&
      error.response.state >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      return error.response;
    }

    // Handling server error responses.
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

export { instance };
