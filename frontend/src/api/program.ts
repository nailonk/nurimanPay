import api from "./axios";

// Mengambil semua daftar program
export const getPrograms = () => api.get("/program");

// Mengambil detail program berdasarkan ID (id dikasih tipe string atau number)
export const getProgramById = (id: string | number) => api.get(`/program/${id}`);

// Membuat program baru (data dikasih tipe any agar fleksibel)
export const createProgram = (data: any) => api.post("/program", data);

// Memperbarui data program berdasarkan ID
export const updateProgram = (id: string | number, data: any) => api.put(`/program/${id}`, data);

// Menghapus program berdasarkan ID
export const deleteProgram = (id: string | number) => api.delete(`/program/${id}`);