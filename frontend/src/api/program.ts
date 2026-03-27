import api from "./axios";

// Mengambil semua daftar program
export const getPrograms = () => api.get("/program");

// Mengambil detail program berdasarkan ID
export const getProgramById = (id) => api.get(`/program/${id}`);

// Membuat program baru
export const createProgram = (data) => api.post("/program", data);

// Memperbarui data program berdasarkan ID
export const updateProgram = (id, data) => api.put(`/program/${id}`, data);

// Menghapus program berdasarkan ID
export const deleteProgram = (id) => api.delete(`/program/${id}`);