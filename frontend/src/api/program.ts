import api from "./axios";

<<<<<<< HEAD
export const getPrograms = () => api.get("/program");

export const getProgramById = (id: string | number) => api.get(`/program/${id}`);

export const createProgram = (data: any) => api.post("/program", data);

export const updateProgram = (id: string | number, data: any) => api.put(`/program/${id}`, data);

export const deleteProgram = (id: string | number) => api.delete(`/program/${id}`);
=======
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
>>>>>>> develop
