const API_BASE_URL =
  "https://parkly-backend.up.railway.app/api";

/* =========================================================
   Generic Request
========================================================= */

async function request(
  path,
  {
    method = "GET",
    params,
    body,
    signal,
  } = {}
) {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  const url = new URL(
    `${API_BASE_URL}${path}`
  );

  /* ---------------- Query Parameters ---------------- */

  if (params) {
    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          url.searchParams.set(
            key,
            String(value)
          );
        }
      }
    );
  }

  /* ---------------- Headers ---------------- */

  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  /* ---------------- Request ---------------- */

  let response;

  try {
    response = await fetch(
      url.toString(),
      {
        method,
        headers,
        signal,

        ...(body !== undefined
          ? {
              body: JSON.stringify(body),
            }
          : {}),
      }
    );
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      `Network error calling ${method} ${path}: ${error.message}`
    );
  }

  /* ---------------- Response ---------------- */

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data = null;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    data = await response
      .json()
      .catch(() => null);
  } else {
    data = await response
      .text()
      .catch(() => "");
  }

  /* ---------------- Error ---------------- */

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object"
        ? data.message ||
          data.title ||
          data.error
        : data;

    throw new Error(
      `API ${response.status} ${response.statusText} on ${method} ${path}` +
        (message
          ? ` — ${message}`
          : "")
    );
  }

  return data;
}

/* =========================================================
   Parking Spaces API
========================================================= */

export const parkingSpacesApi = {

  /* =======================================================
     GET /api/ParkingSpaces
     Returns all parking spaces
  ======================================================= */

  getAll(params = {}, signal) {
    return request(
      "/ParkingSpaces",
      {
        params,
        signal,
      }
    );
  },

  /* =======================================================
     POST /api/ParkingSpaces
     Create new parking space
  ======================================================= */

  create(data, signal) {
    return request(
      "/ParkingSpaces",
      {
        method: "POST",
        body: data,
        signal,
      }
    );
  },

  /* =======================================================
     GET /api/ParkingSpaces/parking/{parkingId}
  ======================================================= */

  getByParking(
    parkingId,
    signal
  ) {
    return request(
      `/ParkingSpaces/parking/${encodeURIComponent(
        parkingId
      )}`,
      {
        signal,
      }
    );
  },

  /* =======================================================
     GET /api/ParkingSpaces/{spaceId}
  ======================================================= */

  getById(
    spaceId,
    signal
  ) {
    return request(
      `/ParkingSpaces/${encodeURIComponent(
        spaceId
      )}`,
      {
        signal,
      }
    );
  },

  /* =======================================================
     PUT /api/ParkingSpaces/{spaceId}
  ======================================================= */

  update(
    spaceId,
    data,
    signal
  ) {
    return request(
      `/ParkingSpaces/${encodeURIComponent(
        spaceId
      )}`,
      {
        method: "PUT",
        body: data,
        signal,
      }
    );
  },

  /* =======================================================
     DELETE /api/ParkingSpaces/{spaceId}
  ======================================================= */

  remove(
    spaceId,
    signal
  ) {
    return request(
      `/ParkingSpaces/${encodeURIComponent(
        spaceId
      )}`,
      {
        method: "DELETE",
        signal,
      }
    );
  },

  /* =======================================================
     GET /api/ParkingSpaces/{spaceId}/available
  ======================================================= */

  getAvailable(
    spaceId,
    params = {},
    signal
  ) {
    return request(
      `/ParkingSpaces/${encodeURIComponent(
        spaceId
      )}/available`,
      {
        params,
        signal,
      }
    );
  },

  /* =======================================================
     GET /api/ParkingSpaces/nearby
  ======================================================= */

  nearby(
    params = {},
    signal
  ) {
    return request(
      "/ParkingSpaces/nearby",
      {
        params,
        signal,
      }
    );
  },

  /* =======================================================
     GET /api/ParkingSpaces/owner/management

     Main endpoint for Space Management
  ======================================================= */

  getManagement(
    params = {},
    signal
  ) {
    return request(
      "/ParkingSpaces/owner/management",
      {
        params,
        signal,
      }
    );
  },

  /* =======================================================
     GET /api/ParkingSpaces/owner/availability
  ======================================================= */

  getOwnerAvailability(
    params = {},
    signal
  ) {
    return request(
      "/ParkingSpaces/owner/availability",
      {
        params,
        signal,
      }
    );
  },

  /* =======================================================
     PATCH /api/ParkingSpaces/owner/{spaceId}/availability
  ======================================================= */

  updateAvailability(
    spaceId,
    data,
    signal
  ) {
    return request(
      `/ParkingSpaces/owner/${encodeURIComponent(
        spaceId
      )}/availability`,
      {
        method: "PATCH",
        body: data,
        signal,
      }
    );
  },
};

export default parkingSpacesApi;