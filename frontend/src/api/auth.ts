import api from "./axios"

export const login = (data: {
  email: string
  password: string
}) => {
  return api.post("/api/auth/login", data)
}