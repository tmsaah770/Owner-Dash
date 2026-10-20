import { useState, useEffect, useCallback } from "react";

import Sidebar from "./Sidebar";
import AddLocationModal from "./Addlocationmodal";
import LocationDetailsModal from "./LocationDetailsModal";
import { parkingsApi } from "../api/Parkingsapi";

/* ---------------- Icons (plain inline SVG, no external icon lib) ---------------- */

const Icon = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
    </svg>
  ),
};

/* =========================================================================
   ADAPTERS — turn API JSON into the exact shapes the UI below expects.
   Every field is read defensively (with fallbacks); the assumed field
   name is written next to each line. If your DTOs use different names,
   this is the only place you need to edit — none of the render code
   needs to change.
   ========================================================================= */

/** One item from GET /api/Parkings/mine → the LocationCard shape. */
function mapParkingToCard(p) {
  const total = p.totalSpaces ?? p.total ?? 0;
  const available = p.availableSpaces ?? p.available ?? 0;
  const occupied = p.occupiedSpaces ?? p.occupied ?? Math.max(0, total - available);
  const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const price = p.pricePerHour ?? p.price ?? 0;
  const status = (p.status ?? (p.isActive ?? true ? "active" : "inactive")).toLowerCase();

  return {
    id: p.id,
    name: p.name ?? "Unnamed location",
    addr1: p.address ?? p.street ?? p.addressLine1 ?? "",
    addr2: p.cityState ?? [p.city, p.state].filter(Boolean).join(", "),
    status,
    occupancy,
    total,
    available,
    occupied,
    reserved: p.reservedSpaces ?? p.reserved ?? 0,
    rating: p.rating != null ? String(p.rating) : "—",
    price: `$${Number(price).toFixed(2)}/hr`,
    revenue: p.revenue != null ? `$${Number(p.revenue).toLocaleString()}` : "$0",
  };
}

/** GET /api/Parkings/{id}/details → the LocationDetailsModal shape. */
function mapDetails(d, fallbackName) {
  const safe = d || {};
  const total = safe.totalSpaces ?? safe.total ?? 0;
  const available = safe.availableSpaces ?? safe.available ?? total;
  const occupied = safe.occupiedSpaces ?? safe.occupied ?? 0;
  const price = safe.pricePerHour ?? safe.price ?? 0;

  return {
    name: safe.name ?? fallbackName ?? "Untitled Location",
    address: safe.address ?? safe.fullAddress ?? "—",
    cityState: safe.cityState ?? ([safe.city, safe.state].filter(Boolean).join(", ") || "—"),
    total,
    available,
    occupied,
    reserved: safe.reservedSpaces ?? safe.reserved ?? 0,
    price: `$${Number(price).toFixed(2)} / hour`,
    rating: safe.rating != null ? `${safe.rating} / 5.0` : "New",
    revenue: safe.revenue != null ? `$${Number(safe.revenue).toLocaleString()}` : "$0",
    active: safe.isActive ?? safe.active ?? (safe.status ? safe.status === "active" : true),
  };
}

/** Add Location form → POST /api/Parkings request body. Adjust field names
 *  here if your CreateParkingRequest DTO expects different keys. */
function toCreateParkingPayload(form) {
  return {
    name: form.name,
    address: form.address,
    cityState: form.cityState,
    pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : 0,
    totalSpaces: form.totalSpaces ? Number(form.totalSpaces) : 0,
    levels: form.levels ? Number(form.levels) : undefined,
    notes: form.notes || undefined,
  };
}

/** Fallback shape for the Details modal right after creating a location,
 *  used only if the POST response / follow-up GET details call doesn't
 *  come back with enough info yet. */
function fromNewLocationForm(form) {
  const total = Number(form.totalSpaces) || 0;
  const price = form.pricePerHour ? Number(form.pricePerHour).toFixed(2) : "0.00";
  return {
    name: form.name || "Untitled Location",
    address: form.address || "—",
    cityState: form.cityState || "—",
    total,
    available: total,
    occupied: 0,
    reserved: 0,
    price: `$${price} / hour`,
    rating: "New",
    revenue: "$0",
    active: true,
  };
}

/* ---------------- Sub components ---------------- */

function TopHeader() {
  return (
    <div className="pkloc-topheader">
      <div className="pkloc-search-box">
        {Icon.search}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="pkloc-header-right">
        <button className="pkloc-bell">
          {Icon.bell}
          <span className="pkloc-dot" />
        </button>
        <div className="pkloc-user-chip">
          <div className="pkloc-avatar">AA</div>
          <div className="pkloc-who">
            <div className="pkloc-name">Ahmed Al-Rashid</div>
            <div className="pkloc-role">Parking Owner</div>
          </div>
          {Icon.chevronDown}
        </div>
      </div>
    </div>
  );
}

function PageHead({ onAddClick, locationCount, totalSpaces }) {
  return (
    <div className="pkloc-page-head">
      <div>
        <h1>Parking Locations</h1>
        <div className="pkloc-sub">
          {locationCount} location{locationCount === 1 ? "" : "s"} · {totalSpaces} total spaces
        </div>
      </div>
      <div className="pkloc-head-actions">
        <div className="pkloc-search-box">
          {Icon.search}
          <input type="text" placeholder="Search locations..." />
        </div>
        <button className="pkloc-btn-add" onClick={onAddClick}>
          {Icon.plus} Add Location
        </button>
      </div>
    </div>
  );
}

function StatsRow({ locations }) {
  const totalSpaces = locations.reduce((sum, l) => sum + l.total, 0);
  const available = locations.reduce((sum, l) => sum + l.available, 0);
  const occupied = locations.reduce((sum, l) => sum + l.occupied, 0);
  const activeCount = locations.filter((l) => l.status === "active").length;

  const cards = [
    { icon: Icon.square, iconClass: "pkloc-icon-blue", value: String(totalSpaces), label: "Total Spaces" },
    { icon: Icon.check, iconClass: "pkloc-icon-green", value: String(available), label: "Available" },
    { icon: Icon.x, iconClass: "pkloc-icon-red", value: String(occupied), label: "Occupied" },
    { icon: Icon.pin, iconClass: "pkloc-icon-green", value: String(activeCount), label: "Active Locations" },
  ];

  return (
    <div className="pkloc-stats-grid">
      {cards.map((s) => (
        <div className="pkloc-stat-card" key={s.label}>
          <div className={`pkloc-stat-icon ${s.iconClass}`}>{s.icon}</div>
          <div className="pkloc-value">{s.value}</div>
          <div className="pkloc-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function LocationCard({ loc, onViewDetails, viewingId }) {
  const isLoadingDetails = viewingId === loc.id;
  return (
    <div className="pkloc-card">
      <div className="pkloc-card-head">
        <div className="pkloc-card-head-top">
          <div>
            <h3>{loc.name}</h3>
            <div className="pkloc-addr">
              {loc.addr1}
              <br />
              {loc.addr2}
            </div>
          </div>
          <span className={`pkloc-status-pill ${loc.status}`}>
            {loc.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="pkloc-card-body">
        <div className="pkloc-occ-row">
          <span className="pkloc-occ-label">Occupancy</span>
          <span className="pkloc-occ-value">{loc.occupancy}%</span>
        </div>
        <div className="pkloc-bar-track">
          <div className="pkloc-bar-fill" style={{ width: `${loc.occupancy}%` }} />
        </div>

        <div className="pkloc-mini-stats">
          <div className="pkloc-mini-stat total">
            <div className="pkloc-mini-value">{loc.total}</div>
            <div className="pkloc-mini-label">Total</div>
          </div>
          <div className="pkloc-mini-stat available">
            <div className="pkloc-mini-value">{loc.available}</div>
            <div className="pkloc-mini-label">Available</div>
          </div>
          <div className="pkloc-mini-stat occupied">
            <div className="pkloc-mini-value">{loc.occupied}</div>
            <div className="pkloc-mini-label">Occupied</div>
          </div>
        </div>

        <div className="pkloc-card-footer">
          <div className="pkloc-rating">
            {Icon.star}
            <strong>{loc.rating}</strong> rating
          </div>
          <div className="pkloc-footer-right">
            <span className="pkloc-price">{loc.price}</span>
            <button className="pkloc-btn-details" onClick={() => onViewDetails(loc)} disabled={isLoadingDetails}>
              {isLoadingDetails ? "Loading…" : "View Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main export ---------------- */

export default function ParkingLocations({ onNavigate }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLocation, setDetailsLocation] = useState(null);
  const [viewingId, setViewingId] = useState(null); // which card's "View Details" is loading
  const [submitting, setSubmitting] = useState(false);

  // GET /api/Parkings/mine — the owner's own locations.
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await parkingsApi.getMine(controller.signal);
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.items ?? [];
        setLocations(list.map(mapParkingToCard));
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setError(err.message || "Failed to load your parking locations.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  // "View Details" → GET /api/Parkings/{id}/details (the endpoint built
  // specifically for this modal, per the Swagger description).
  const openDetailsFor = useCallback(async (loc) => {
    setViewingId(loc.id);
    try {
      const details = await parkingsApi.getDetails(loc.id);
      setDetailsLocation(mapDetails(details, loc.name));
      setIsDetailsOpen(true);
    } catch (err) {
      console.error("Failed to load location details:", err);
      // Fall back to what we already know from the list, so the modal
      // still opens with something useful instead of silently failing.
      setDetailsLocation({
        name: loc.name,
        address: `${loc.addr1}, ${loc.addr2}`,
        cityState: loc.addr2,
        total: loc.total,
        available: loc.available,
        occupied: loc.occupied,
        reserved: loc.reserved,
        price: `$${parseFloat(loc.price.replace(/[^\d.]/g, "")).toFixed(2)} / hour`,
        rating: `${loc.rating} / 5.0`,
        revenue: loc.revenue,
        active: loc.status === "active",
      });
      setIsDetailsOpen(true);
    } finally {
      setViewingId(null);
    }
  }, []);

  // Add Location form submit → POST /api/Parkings, then show the new
  // location's details (fetched fresh if the backend returns an id).
  const submitNewLocation = useCallback(async (form) => {
    setSubmitting(true);
    try {
      const created = await parkingsApi.create(toCreateParkingPayload(form));
      setIsAddOpen(false);

      // Refresh the list in the background so the new card shows up.
      setReloadKey((k) => k + 1);

      const newId = created?.id;
      if (newId) {
        try {
          const details = await parkingsApi.getDetails(newId);
          setDetailsLocation(mapDetails(details, form.name));
        } catch {
          setDetailsLocation(fromNewLocationForm(form));
        }
      } else {
        setDetailsLocation(fromNewLocationForm(form));
      }
      setIsDetailsOpen(true);
    } catch (err) {
      console.error("Failed to create parking location:", err);
      setError(err.message || "Failed to create the new location.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  const totalSpaces = locations.reduce((sum, l) => sum + l.total, 0);

  return (
    <div className="pkloc">
      <div className="pkloc-app">
        <Sidebar active="locations" onNavigate={onNavigate} showFooter />

        <main>
          <TopHeader />
          <div className="pkloc-main">
            <PageHead onAddClick={() => setIsAddOpen(true)} locationCount={locations.length} totalSpaces={totalSpaces} />

            {error ? (
              <div
                style={{
                  background: "#fdeceb",
                  border: "1px solid #f6cfcd",
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  color: "#b64542",
                  fontSize: 13,
                }}
              >
                <span>{error}</span>
                <button
                  onClick={retry}
                  style={{
                    background: "#e5484d",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 14px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Retry
                </button>
              </div>
            ) : null}

            <StatsRow locations={locations} />

            {loading ? (
              <div style={{ textAlign: "center", color: "#9598a8", padding: "40px 0" }}>Loading locations…</div>
            ) : locations.length === 0 ? (
              <div style={{ textAlign: "center", color: "#9598a8", padding: "40px 0" }}>
                No parking locations yet — click "Add Location" to create your first one.
              </div>
            ) : (
              <div className="pkloc-grid">
                {locations.map((loc) => (
                  <LocationCard loc={loc} key={loc.id ?? loc.name} onViewDetails={openDetailsFor} viewingId={viewingId} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AddLocationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={submitNewLocation}
        submitting={submitting}
      />

      <LocationDetailsModal
        isOpen={isDetailsOpen}
        location={detailsLocation}
        onClose={() => setIsDetailsOpen(false)}
        onManageSpaces={() => {
          // Hook this up to your Space Management page/flow.
          console.log("Manage spaces for:", detailsLocation);
        }}
        onEdit={() => {
          // Send the user back to the Add Location form to re-enter details,
          // exactly as requested — the form always starts blank.
          setIsDetailsOpen(false);
          setIsAddOpen(true);
        }}
      />
    </div>
  );
}