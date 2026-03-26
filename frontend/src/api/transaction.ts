import api from "./axios"

export const createTransaction = (data: any) => {
  return api.post("/transaksi/create", data)
}