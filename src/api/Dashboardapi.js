
import api from "./api";

export const dashboardApi = {
  getSummary() {
    return api.get("/Dashboard/summary");
  },

  getRevenue(period = "daily") {
    return api.get(
      `/Dashboard/revenue?period=${encodeURIComponent(period)}`
    );
  },

  getLocations() {
    return api.get("/Dashboard/locations");
  },

  getReservationsToday(page = 1, pageSize = 6) {
    return api.get(
      `/Dashboard/reservations/today?page=${page}&pageSize=${pageSize}`
    );
  },

  getActivity(limit = 6) {
    return api.get(`/Dashboard/activity?limit=${limit}`);
  },
};

export default dashboardApi;