import api from "./axios";

export const getPrograms = () => api.get("/program");

export const getProgramById = (id: string | number) => api.get(`/program/${id}`);

export const createProgram = (data: any) => api.post("/program", data);

export const updateProgram = (id: string | number, data: any) => api.put(`/program/${id}`, data);

export const deleteProgram = (id: string | number) => api.delete(`/program/${id}`);