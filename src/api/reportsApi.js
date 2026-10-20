import api from "./api";

const reportsApi = {
  // GET /api/reports/revenue
  getRevenue(params = {}) {
    return api.get("/reports/revenue", {
      params,
    });
  },

  // GET /api/reports/revenue/export
  exportRevenue(params = {}) {
    return api.get("/reports/revenue/export", {
      params,
      responseType: "blob",
    });
  },
};

export default reportsApi;