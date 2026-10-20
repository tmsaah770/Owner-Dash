
/**
 * parkingsApi.js
 * API client for Parkly parking endpoints.
 */

const API_BASE_URL =
  "https://parkly-backend.up.railway.app/api";

async function request(
  path,
  { method = "GET", params, body, signal } = {}
) {
  // Build the URL from the backend base URL.
  const normalizedPath = path.startsWith("/api/")
    ? path.slice(4)
    : path.startsWith("/")
      ? path
      : `/${path}`;

  const url = new URL(
    `${API_BASE_URL}${normalizedPath}`
  );

  // Add query parameters.
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // Read the JWT token saved during login.
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
  }

  let response;

  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      signal,
      body:
        body !== undefined && body !== null
          ? JSON.stringify(body)
          : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      `Network error calling ${method} ${url.pathname}: ${error.message}`
    );
  }

  if (response.status === 204) {
    if (!response.ok) {
      throw new Error(
        `API error: ${response.status} ${response.statusText}`
      );
    }

    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => "");
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? data.message || data.title
        : data;

    throw new Error(
      `API ${response.status} ${response.statusText} on ${method} ${url.pathname}` +
        (message ? ` — ${message}` : "")
    );
  }

  return data;
}

export const parkingsApi = {
  // GET /api/Parkings
  getAll(signal) {
    return request("/Parkings", { signal });
  },

  // POST /api/Parkings
  create(data, signal) {
    return request("/Parkings", {
      method: "POST",
      body: data,
      signal,
    });
  },

  // GET /api/Parkings/mine
  getMine(signal) {
    return request("/Parkings/mine", { signal });
  },

  // GET /api/Parkings/{id}
  getById(id, { lat, lng, signal } = {}) {
    return request(`/Parkings/${encodeURIComponent(id)}`, {
      params: { lat, lng },
      signal,
    });
  },

  // PUT /api/Parkings/{id}
  update(id, data, signal) {
    return request(`/Parkings/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
      signal,
    });
  },

  // DELETE /api/Parkings/{id}
  remove(id, signal) {
    return request(`/Parkings/${encodeURIComponent(id)}`, {
      method: "DELETE",
      signal,
    });
  },

  // GET /api/Parkings/{parkingId}/arrival-times
  getArrivalTimes(
    parkingId,
    { date, duration, signal } = {}
  ) {
    return request(
      `/Parkings/${encodeURIComponent(parkingId)}/arrival-times`,
      {
        params: { date, duration },
        signal,
      }
    );
  },

  // GET /api/Parkings/{id}/details
  getDetails(id, signal) {
    return request(
      `/Parkings/${encodeURIComponent(id)}/details`,
      { signal }
    );
  },

  // GET /api/Parkings/{parkingId}/available
  getAvailableSpaces(
    parkingId,
    { start, end, signal } = {}
  ) {
    return request(
      `/Parkings/${encodeURIComponent(parkingId)}/available`,
      {
        params: { start, end },
        signal,
      }
    );
  },

  // GET /api/Parkings/search
  search(params = {}, signal) {
    return request("/Parkings/search", {
      params,
      signal,
    });
  },

  // GET /api/Parkings/nearby
  nearby({ lat, lng, radius, signal } = {}) {
    return request("/Parkings/nearby", {
      params: { lat, lng, radius },
      signal,
    });
  },

  // GET /api/Parkings/recommend
  recommend(params = {}, signal) {
    return request("/Parkings/recommend", {
      params,
      signal,
    });
  },
};

export default parkingsApi;