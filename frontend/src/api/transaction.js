import api from "./axios"

export const transactionApi = {
  create: (data) => api.post("/transaction/create", data),
  getDonaturByProgram: (id) => api.get(`/program/${id}`),
  getAll: () => api.get("/transaction")
}