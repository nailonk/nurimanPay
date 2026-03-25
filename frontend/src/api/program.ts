import api from "./axios"

export const getPrograms = () => {
  return api.get("/program")
}