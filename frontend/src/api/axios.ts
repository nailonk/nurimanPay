import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

/**
 * REQUEST INTERCEPTOR
 * Middleware di Backend kamu butuh: authHeader.split(' ')[1]
 * Jadi kita harus kirim format: "Bearer <token>"
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Perhatikan spasi setelah kata 'Bearer'
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Menangani jika Token Expired (1d sesuai config JWT kamu)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika status 401 (Unauthorized) atau 403 (Forbidden/Token Invalid)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Sesi habis atau akses ditolak. Mengalihkan ke login...");
      localStorage.clear();
      // Gunakan window.location agar seluruh state aplikasi ter-reset total
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;