const API_BASE_URL =
  "https://parkly-backend.up.railway.app/api";

async function request(
  path,
  { method = "GET", body, signal } = {}
) {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",

        ...(body !== undefined
          ? {
              "Content-Type": "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      ...(body !== undefined
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      `Network error calling ${method} ${path}: ${error.message}`
    );
  }

  const contentType =
    response.headers.get("content-type") || "";

  let data = null;

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
      `API ${response.status} ${response.statusText}` +
        (message ? ` — ${message}` : "")
    );
  }

  return data;
}

export const pricingApi = {
  // GET /api/Pricing/locations
  getLocations(signal) {
    return request("/Pricing/locations", {
      signal,
    });
  },

  // GET /api/Pricing/parking/{parkingId}
  getParkingPricing(parkingId, signal) {
    return request(
      `/Pricing/parking/${encodeURIComponent(parkingId)}`,
      {
        signal,
      }
    );
  },

  // PUT /api/Pricing/parking/{parkingId}/space-type
  updateSpaceType(parkingId, data, signal) {
    return request(
      `/Pricing/parking/${encodeURIComponent(
        parkingId
      )}/space-type`,
      {
        method: "PUT",
        body: data,
        signal,
      }
    );
  },
};

export default pricingApi;