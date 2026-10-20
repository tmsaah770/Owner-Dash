
// const API_BASE_URL = "https://parkly-backend.up.railway.app/api";

// const api = {
//   async request(method, endpoint, options = {}) {
//     const token = localStorage.getItem("token");

//     const url = new URL(`${API_BASE_URL}${endpoint}`);

//     Object.entries(options.params || {}).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         url.searchParams.set(key, value);
//       }
//     });

//     const response = await fetch(url.toString(), {
//       method,
//       headers: {
//         Accept: "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     });

//     const data = await response.json().catch(() => null);

//     if (!response.ok) {
//       throw new Error(
//         data?.message || `API ${response.status} ${response.statusText}`
//       );
//     }

//     return { data };
//   },

//   get(endpoint, options = {}) {
//     return this.request("GET", endpoint, options);
//   },

//   patch(endpoint, options = {}) {
//     return this.request("PATCH", endpoint, options);
//   },
// };

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "https://parkly-backend.up.railway.app/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;