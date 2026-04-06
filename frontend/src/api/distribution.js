import api from "./axios";

export const distributionApi = {
  getAll: () => {
    return api.get("/distribution");
  },

  getByProgramId: (programId) => {
    return api.get(`/distribution/program/${programId}`);
  },

  getSummary: (programId) => {
    return api.get(`/distribution/summary/${programId}`);
  }
};