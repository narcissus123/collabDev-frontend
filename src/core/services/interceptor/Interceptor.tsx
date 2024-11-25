import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

import { getItem } from "../storage/Storage";
import { SignOutDeveloper } from "../api/developer-authentication.api";

const baseURL = "http://localhost:8080";

const instance: AxiosInstance = axios.create({
  baseURL,
});

const handleUnauthorized = () => {
  SignOutDeveloper();
  // Show a notification
  toast.error("Your session has expired. Please log in again.");
};

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handling 2xx status code, successful responses.
    return response;
  },
  (error) => {
    // Handling status codes outside the range of 2xx, client and server error responses.
    console.log("error", error);
    if (error.response) {
      const { status, data } = error.response;
      // Handle expected client errors (4xx)
      if (status >= 400 && status < 500) {
        if (status === 401) {
          // Handle 401 Unauthorized
          handleUnauthorized();
          return;
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
        console.log("response", error.response);
        toast.error(data.message || "Something went wrong.");
      }
    } else {
      // Handle network errors or other unexpected errors
      console.error("Error:", error.message);
      toast.error("Network error: Please check your internet connection.");
    }
    return Promise.reject(error);
    // return Promise.resolve({ handled: true, error: error.response });
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

/////////////////////////////////////////////////////////
// import axios, { AxiosInstance } from "axios";
// import { toast } from "react-toastify";

// import { getItem } from "../storage/Storage";
// import { SignOutDeveloper } from "../api/developer-authentication.api";

// const baseURL = "http://localhost:8080";

// const instance: AxiosInstance = axios.create({
//   baseURL,
// });

// // Response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     // Handling 2xx status code, successful responses.
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     try {
//       const errorStatus = error.response.status;
//       // Handling status codes outside the range of 2xx, client error responses.
//       const expectedError =
//         error.response && errorStatus >= 400 && errorStatus < 500;
//       if (!expectedError) {
//         toast.error(error.response.data.message);
//       } else {
//         if (error.response.status === 403) {
//           toast.error(
//             error.response.data.message ||
//               "You are not authorized to perform this action."
//           );
//         } else if (error.response.status === 401) {
//           if (!originalRequest._retry) {
//             originalRequest._retry = true;
//             return axios(originalRequest);
//           } else {
//             SignOutDeveloper();
//             toast.error("Your session has expired. Please log in again.");
//             return;
//           }
//         }
//       }

//       // Handling server error responses.
//     } catch (err) {
//       console.error(err);
//     }
//     return Promise.reject(error);
//   }
// );

// // Request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     // Setting token before request is sent
//     const token = getItem("token");

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Handling request error
//     return Promise.reject(error);
//   }
// );

// export const methods = {
//   get: axios.get,
//   post: axios.post,
//   put: axios.put,
//   delete: axios.delete,
// };

// export { instance };
/////////////////////////////////////////////////////////////////////
// import axios, { AxiosInstance } from "axios";
// import { toast } from "react-toastify";
// import { getItem, removeItem } from "../storage/Storage";
// import { SignOutDeveloper } from "../api/developer-authentication.api";

// const baseURL = "http://localhost:8080";

// const instance: AxiosInstance = axios.create({
//   baseURL,
// });

// // Response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     // Handling 2xx status code, successful responses.
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response) {
//       const errorStatus = error.response.status;

//       if (errorStatus >= 400 && errorStatus < 500) {
//         // Handle client errors (4xx)
//         if (errorStatus === 401) {
//           // Handle unauthorized (401)
//           if (!originalRequest._retry) {
//             originalRequest._retry = true;
//             return axios(originalRequest);
//           } else {
//             SignOutDeveloper();
//             toast.error("Your session has expired. Please log in again.");
//             return;
//           }
//         } else if (errorStatus === 403) {
//           toast.error(
//             error.response.data.message ||
//               "You are not authorized to perform this action."
//           );
//         } else {
//           toast.error(
//             error.response.data.message ||
//               "An error occurred. Please try again."
//           );
//         }
//       } else if (errorStatus >= 500) {
//         // Handle server errors (5xx)
//         toast.error("Server error: Please try again later.");
//       }
//     } else {
//       // Handle network or other unexpected errors
//       toast.error("Network error: Please check your internet connection.");
//     }

//     // Ensure the error is still returned to the calling function for further handling
//     return Promise.reject(error);
//   }
// );

// // Request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     // Setting token before request is sent
//     const token = getItem("token");

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Handling request error
//     return Promise.reject(error);
//   }
// );

// export { instance };
