import api from "./axios"

export const transactionApi = {
  create: (data: any) => api.post("/transaksi/create", data),

  getDonaturByProgram: (id: string) =>
    api.get(`/transaksi/program/${id}/donatur`)
}