import api from "./api";

const reservationsApi = {
  // GET /api/Reservations/owner
  // Reservations belonging to the parking owner
  getOwnerReservations(page = 1, pageSize = 10, params = {}) {
    return api.get("/Reservations/owner", {
      params: {
        page,
        pageSize,
        ...params,
      },
    });
  },

  // GET /api/Reservations/owner/{id}
  // Get reservation details
  getOwnerReservationById(id) {
    return api.get(`/Reservations/owner/${id}`);
  },

  // POST /api/Reservations
  // Create reservation
  create(data) {
    return api.post("/Reservations", data);
  },

  // GET /api/Reservations/{id}
  getById(id) {
    return api.get(`/Reservations/${id}`);
  },

  // PUT /api/Reservations/{id}
  update(id, data) {
    return api.put(`/Reservations/${id}`, data);
  },

  // DELETE /api/Reservations/{id}
  cancel(id) {
    return api.delete(`/Reservations/${id}`);
  },

  // GET /api/Reservations/{id}/checkout-preview
  getCheckoutPreview(id) {
    return api.get(`/Reservations/${id}/checkout-preview`);
  },

  // GET /api/Reservations/{id}/qr
  getQr(id) {
    return api.get(`/Reservations/${id}/qr`);
  },

  // GET /api/Reservations/my-reservations
  getMyReservations() {
    return api.get("/Reservations/my-reservations");
  },

  // GET /api/Reservations/my-reservations/active
  getActiveReservations() {
    return api.get("/Reservations/my-reservations/active");
  },
};

export default reservationsApi;