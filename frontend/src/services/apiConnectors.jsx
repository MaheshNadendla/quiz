// import axios from "axios";

// const derivedBaseUrl =
//   import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

// export const axiosInstance = axios.create({
//   baseURL: derivedBaseUrl,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const apiConnector = (method, url, bodyData, headers, params) => {
//   return axiosInstance({
//     method: `${method}`,
//     url: `${url}`,
//     data: bodyData ? bodyData : null,
//     headers: headers ? headers : null,
//     params: params ? params : null,
//   });
// };


import axios from "axios";

// Base URL setup
const derivedBaseUrl =
  import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: derivedBaseUrl,
});

// ✅ Interceptor to attach token safely
axiosInstance.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");

  if (token) {
    // 🔧 Remove accidental quotes if token was stringified before
    token = token.replace(/^"|"$/g, "");

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Reusable API connector
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: headers || {},
    params: params || {},
  });
};

