import { useState, useEffect, useCallback } from "react";

import Sidebar from "./Sidebar";
import { dashboardApi } from "../api/Dashboardapi";

/* ---------------- Icons (plain inline SVG, no external icon lib) ---------------- */

const Icon = {
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M7 15l4-6 4 3 5-8" />
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
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4h8v2" />
    </svg>
  ),
};

/* =========================================================================
   ADAPTERS — turn API JSON into the exact shapes the UI below expects.
   Every backend field is read defensively (with fallbacks), and the
   assumed field names are written next to each line as a comment.
   If your DTOs use different names, this is the only place you need to
   edit — none of the render code below needs to change.
   ========================================================================= */

/** GET /api/Dashboard/summary → banner text + the four stat cards. */
function mapSummary(s) {
  const safe = s || {};
  const trendFromChange = (changeText) => {
    if (typeof changeText !== "string") return "up";
    if (changeText.trim().startsWith("-")) return "down";
    if (changeText.trim().startsWith("+")) return "up";
    return "warn";
  };

  const totalSpacesChange = safe.totalSpacesChange ?? safe.totalSpacesChangeLabel ?? "";
  const availableChange = safe.availableChange ?? safe.availableChangeLabel ?? "";
  const activeChange = safe.activeChange ?? safe.activeReservationsChange ?? "";
  const revenueChange = safe.revenueChange ?? safe.revenueChangeLabel ?? "";

  const statCards = [
    {
      icon: Icon.wallet,
      iconClass: "parkly-icon-blue",
      badge: totalSpacesChange,
      badgeClass: trendFromChange(totalSpacesChange),
      value: String(safe.totalSpaces ?? "—"),
      label: "Total Spaces",
      sub: safe.totalSpacesSub ?? "",
    },
    {
      icon: Icon.checkCircle,
      iconClass: "parkly-icon-green",
      badge: availableChange,
      badgeClass: trendFromChange(availableChange),
      value: String(safe.availableNow ?? "—"),
      label: "Available Now",
      sub: safe.availableSub ?? "",
    },
    {
      icon: Icon.calendar,
      iconClass: "parkly-icon-yellow",
      badge: activeChange,
      badgeClass: trendFromChange(activeChange),
      value: String(safe.activeReservations ?? "—"),
      label: "Active Reservations",
      sub: safe.activeSub ?? "",
    },
    {
      icon: Icon.chart,
      iconClass: "parkly-icon-purple",
      badge: revenueChange,
      badgeClass: trendFromChange(revenueChange),
      value: safe.todaysRevenue != null ? `$${Number(safe.todaysRevenue).toLocaleString()}` : "—",
      label: "Today's Revenue",
      sub: safe.revenueSub ?? "",
    },
  ];

  const banner = {
    ownerFirstName: safe.ownerFirstName ?? safe.ownerName ?? "there",
    occupancyPercent: safe.occupancyPercent ?? safe.occupancy ?? 0,
    avgRating: safe.avgRating ?? safe.averageRating ?? 0,
    todayBookings: safe.todayBookings ?? safe.bookingsToday ?? 0,
  };

  return { statCards, banner };
}

/** GET /api/Dashboard/revenue?period=... → { total, points: [{label, value}] } */
function mapRevenue(data) {
  const safe = data || {};
  const rawPoints = safe.points ?? safe.data ?? safe.series ?? [];
  const points = rawPoints.map((p) => ({
    label: p.label ?? p.day ?? p.date ?? "",
    value: Number(p.value ?? p.amount ?? p.revenue ?? 0),
  }));
  const total = safe.total ?? safe.totalRevenue ?? points.reduce((sum, p) => sum + p.value, 0);
  return { total, points };
}

/** GET /api/Dashboard/locations → array of { name, city, status, usedSpaces, totalSpaces } */
function mapLocations(data) {
  const list = Array.isArray(data) ? data : data?.items ?? [];
  return list.map((loc) => {
    const total = loc.totalSpaces ?? loc.total ?? 0;
    const used = loc.usedSpaces ?? loc.occupiedSpaces ?? loc.used ?? 0;
    const status = (loc.status ?? (loc.isActive ? "active" : "inactive") ?? "active").toLowerCase();
    return {
      name: loc.name ?? "Unnamed location",
      city: loc.city ?? loc.cityState ?? "",
      status,
      used,
      total,
      barClass: status === "inactive" ? "inactive" : "",
    };
  });
}

/** GET /api/Dashboard/reservations/today?page=&pageSize= → paginated list */
const AVATAR_PALETTE = ["#e75c5c", "#4d8ff0", "#4dbf8f", "#c98a12", "#7c5cf0", "#e5484d", "#0fa585", "#2f6df0"];

function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function colorForName(fullName) {
  const str = fullName || "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function mapReservations(data) {
  const list = Array.isArray(data) ? data : data?.items ?? [];
  return list.map((r, i) => {
    const name = r.customerName ?? r.name ?? "Guest";
    const timeRange =
      r.timeRange ?? (r.startTime && r.endTime ? `${r.startTime} – ${r.endTime}` : r.time ?? "");
    return {
      initials: getInitials(name),
      color: colorForName(name),
      name,
      id: r.code ?? r.bookingCode ?? r.id ?? `res-${i}`,
      location: r.location ?? r.locationName ?? "",
      space: r.space ?? r.spaceCode ?? "",
      time: timeRange,
      duration: r.durationLabel ?? r.duration ?? "",
    };
  });
}

/** GET /api/Dashboard/activity?limit= → array of { type, message, timeAgo } */
const ACTIVITY_TYPE_COLOR = {
  checkin: "green",
  booking: "blue",
  "booking-confirmed": "blue",
  cancellation: "red",
  maintenance: "yellow",
  milestone: "blue",
};

function mapActivity(data) {
  const list = Array.isArray(data) ? data : data?.items ?? [];
  return list.map((a) => ({
    color: ACTIVITY_TYPE_COLOR[a.type] ?? a.color ?? "blue",
    text: a.message ?? a.text ?? "",
    time: a.timeAgo ?? a.time ?? "",
  }));
}

/* ---------------- Sub components ---------------- */

function TopHeader() {
  return (
    <div className="parkly-header-row">
      <div className="parkly-search-box">
        {Icon.search}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="parkly-header-right">
        <button className="parkly-bell">
          {Icon.bell}
          <span className="parkly-dot" />
        </button>
        <div className="parkly-user-chip">
          <div className="parkly-avatar">AA</div>
          <div className="parkly-who">
            <div className="parkly-name">Ahmed Al-Rashid</div>
            <div className="parkly-role">Parking Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeBanner({ banner }) {
  return (
    <div className="parkly-banner">
      <div>
        <h2>Good morning, {banner.ownerFirstName}</h2>
        <p>Here's what's happening across all your parking locations today.</p>
      </div>
      <div className="parkly-banner-stats">
        <div className="parkly-banner-stat">
          <div className="parkly-val">{banner.occupancyPercent}%</div>
          <div className="parkly-lbl">Occupancy</div>
        </div>
        <div className="parkly-banner-stat">
          <div className="parkly-val">{banner.avgRating}★</div>
          <div className="parkly-lbl">Avg Rating</div>
        </div>
        <div className="parkly-banner-stat">
          <div className="parkly-val">{banner.todayBookings}</div>
          <div className="parkly-lbl">Today Bookings</div>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ statCards }) {
  return (
    <div className="parkly-stats-grid">
      {statCards.map((s) => (
        <div className="parkly-stat-card" key={s.label}>
          <div className="parkly-stat-top">
            <div className={`parkly-stat-icon ${s.iconClass}`}>{s.icon}</div>
            {s.badge ? <span className={`parkly-badge ${s.badgeClass}`}>{s.badge}</span> : null}
          </div>
          <div className="parkly-value">{s.value}</div>
          <div className="parkly-label">{s.label}</div>
          <div className="parkly-sub">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

const REVENUE_RANGES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

function RevenueChart({ revenue, range, onRangeChange, loading }) {
  const points = revenue.points;
  const w = 640;
  const h = 160;

  let linePath = "";
  let areaPath = "";
  let lastPoint = null;

  if (points.length > 0) {
    const max = Math.max(...points.map((p) => p.value), 1) * 1.15;
    const stepX = points.length > 1 ? w / (points.length - 1) : 0;
    const coords = points.map((p, i) => [points.length > 1 ? i * stepX : w / 2, h - (p.value / max) * h]);
    linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    areaPath = `${linePath} L${coords[coords.length - 1][0]},${h} L${coords[0][0]},${h} Z`;
    lastPoint = coords[coords.length - 1];
  }

  return (
    <div className="parkly-card">
      <div className="parkly-card-head">
        <div>
          <h3>Revenue Overview</h3>
          <div className="parkly-muted">
            Total <strong style={{ color: "var(--text)" }}>${revenue.total.toLocaleString()}</strong> · {range}
          </div>
        </div>
        <div className="parkly-tabs">
          {REVENUE_RANGES.map((r) => (
            <button key={r.key} className={range === r.key ? "active" : ""} onClick={() => onRangeChange(r.key)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="parkly-chart-wrap">
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-mute)", fontSize: 13 }}>
            Loading revenue…
          </div>
        ) : points.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-mute)", fontSize: 13 }}>
            No revenue data for this period.
          </div>
        ) : (
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b6df0" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#3b6df0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="10" x2={w} y2="10" stroke="#eef0f5" strokeWidth="1" />
            <line x1="0" y1="55" x2={w} y2="55" stroke="#eef0f5" strokeWidth="1" />
            <line x1="0" y1="100" x2={w} y2="100" stroke="#eef0f5" strokeWidth="1" />
            <line x1="0" y1="145" x2={w} y2="145" stroke="#eef0f5" strokeWidth="1" />

            <path d={areaPath} fill="url(#revFill)" stroke="none" />
            <path d={linePath} fill="none" stroke="#3b6df0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {lastPoint && <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4.5" fill="#3b6df0" stroke="#fff" strokeWidth="2" />}
          </svg>
        )}
      </div>
      <div className="parkly-chart-x">
        {points.map((p, i) => (
          <span key={i}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}

function LocationsCard({ locations }) {
  return (
    <div className="parkly-card">
      <div className="parkly-card-head">
        <h3>Locations</h3>
        <button className="parkly-view-all">View all →</button>
      </div>
      <div className="parkly-loc-list">
        {locations.length === 0 && <div className="parkly-muted">No locations found.</div>}
        {locations.map((loc) => (
          <div className="parkly-loc-item" key={loc.name}>
            <div className="parkly-loc-top">
              <div>
                <div className="parkly-loc-name">{loc.name}</div>
                <div className="parkly-loc-city">{loc.city}</div>
              </div>
              <span className={`parkly-status-pill ${loc.status}`}>
                {loc.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="parkly-loc-bottom">
              <div className="parkly-bar-track">
                <div
                  className={`parkly-bar-fill ${loc.barClass}`}
                  style={{ width: `${loc.total > 0 ? (loc.used / loc.total) * 100 : 0}%` }}
                />
              </div>
              <span className="parkly-loc-count">
                {loc.used}/{loc.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationsTable({ reservations }) {
  return (
    <div className="parkly-card">
      <div className="parkly-card-head">
        <div>
          <h3>Today's Reservations</h3>
          <div className="parkly-muted">
            {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <button className="parkly-view-all">View All</button>
      </div>

      <table className="parkly-res-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Location</th>
            <th>Space</th>
            <th>Time</th>
            <th>Duration</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 && (
            <tr>
              <td colSpan={6} className="parkly-muted" style={{ padding: "16px 4px" }}>
                No reservations today yet.
              </td>
            </tr>
          )}
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="parkly-cust">
                  <div className="parkly-avatar" style={{ background: r.color }}>
                    {r.initials}
                  </div>
                  <div>
                    <div className="parkly-name">{r.name}</div>
                    <div className="parkly-id">{r.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="parkly-cell-main">{r.location}</div>
              </td>
              <td>
                <span className="parkly-space-chip">{r.space}</span>
              </td>
              <td>
                <div className="parkly-cell-main">{r.time}</div>
              </td>
              <td>
                <div className="parkly-cell-sub">{r.duration}</div>
              </td>
              <td>
                <button className="parkly-more-dots">⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentActivity({ activity }) {
  return (
    <div className="parkly-card">
      <div className="parkly-card-head">
        <h3>Recent Activity</h3>
      </div>
      <div className="parkly-activity-list">
        {activity.length === 0 && <div className="parkly-muted">No recent activity.</div>}
        {activity.map((a, i) => (
          <div className="parkly-activity-item" key={i}>
            <div className={`parkly-act-dot ${a.color}`} />
            <div>
              <div className="parkly-act-text">{a.text}</div>
              <div className="parkly-act-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Main export ---------------- */

const EMPTY_SUMMARY = { statCards: [], banner: { ownerFirstName: "", occupancyPercent: 0, avgRating: 0, todayBookings: 0 } };
const EMPTY_REVENUE = { total: 0, points: [] };

export default function Dashboard({ onNavigate }) {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [locations, setLocations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [revenue, setRevenue] = useState(EMPTY_REVENUE);
  const [revenueRange, setRevenueRange] = useState("daily");

  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Summary + Locations + Reservations + Activity — fetched together on mount
  // (and whenever the user hits "retry" after an error).
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, locationsRes, reservationsRes, activityRes] = await Promise.all([
          dashboardApi.getSummary(controller.signal),
          dashboardApi.getLocations(controller.signal),
          dashboardApi.getReservationsToday(1, 6, controller.signal),
          dashboardApi.getActivity(6, controller.signal),
        ]);
        if (cancelled) return;
        setSummary(mapSummary(summaryRes));
        setLocations(mapLocations(locationsRes));
        setReservations(mapReservations(reservationsRes));
        setActivity(mapActivity(activityRes));
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setError(err.message || "Failed to load dashboard data.");
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

  // Revenue — fetched separately since it depends on the selected range
  // (Daily / Weekly / Monthly), so switching tabs shouldn't refetch everything else.
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadRevenue() {
      setRevenueLoading(true);
      try {
        const res = await dashboardApi.getRevenue(revenueRange, controller.signal);
        if (!cancelled) setRevenue(mapRevenue(res));
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          console.error("Failed to load revenue:", err);
        }
      } finally {
        if (!cancelled) setRevenueLoading(false);
      }
    }

    loadRevenue();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [revenueRange, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div className="parkly">
      <div className="parkly-app">
        <div className="parkly-topbar">
          <h1>Dashboard Overview</h1>
        </div>

        <div className="parkly-body">
          <Sidebar active="dashboard" onNavigate={onNavigate} showFooter />

          <main className="parkly-main">
            <TopHeader />

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
                <span>Couldn't load the dashboard: {error}</span>
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

            {loading ? (
              <div className="parkly-card" style={{ textAlign: "center", color: "var(--text-mute)", padding: "40px 0" }}>
                Loading dashboard…
              </div>
            ) : (
              <>
                <WelcomeBanner banner={summary.banner} />
                <StatsGrid statCards={summary.statCards} />

                <div className="parkly-mid-grid">
                  <RevenueChart revenue={revenue} range={revenueRange} onRangeChange={setRevenueRange} loading={revenueLoading} />
                  <LocationsCard locations={locations} />
                </div>

                <div className="parkly-bottom-grid">
                  <ReservationsTable reservations={reservations} />
                  <RecentActivity activity={activity} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}