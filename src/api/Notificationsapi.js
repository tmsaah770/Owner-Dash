
import api from "./api";

const notificationsApi = {
  list(params = {}) {
    return api.get("/Notifications", { params });
  },

  getAll(params = {}) {
    return api.get("/Notifications", { params });
  },

  getSummary() {
    return api.get("/Notifications/summary");
  },

  markAsRead(id) {
    return api.patch(`/Notifications/${id}/read`);
  },

  markAllAsRead() {
    return api.patch("/Notifications/read-all");
  },
};

export default notificationsApi;