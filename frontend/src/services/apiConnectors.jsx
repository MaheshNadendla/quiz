import axios from "axios";

const derivedBaseUrl =
  import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

export const axiosInstance = axios.create({
  baseURL: derivedBaseUrl,
});

// Attach Authorization header if token exists
axiosInstance.interceptors.request.use((config) => {
  try {
    const rawToken = localStorage.getItem("token");
    if (rawToken) {
      const token = JSON.parse(rawToken);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore JSON parse errors
  }
  return config;
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
