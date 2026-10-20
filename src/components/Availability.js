import { useState } from "react";
import Sidebar from "./Sidebar";

/* ---------------- Icons (plain inline SVG, no external icon lib) ---------------- */

const Icon = {
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
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
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
};

/* ---------------- Static data — swap for real data/props/API calls ----------------
   Each location has its own stat counts + a set of spaces grouped by floor.
   Counts always add up: available + occupied + reserved + maintenance = total,
   and occupancy% = (occupied + reserved) / total.
*/

const LOCATIONS_DATA = {
  "CityPark Central": {
    total: 10,
    available: 5,
    occupied: 3,
    reserved: 1,
    maintenance: 1,
    floors: [
      {
        label: "Floor 1",
        spaces: [
          { id: "B-01", type: "Standard", status: "available", price: "$4.50/hr" },
          { id: "B-02", type: "Accessible", status: "occupied", price: "$4.50/hr" },
          { id: "B-03", type: "Standard", status: "available", price: "$4.50/hr" },
          { id: "B-04", type: "Standard", status: "maintenance", price: "$4.50/hr" },
          { id: "B-05", type: "Compact", status: "available", price: "$3.50/hr" },
        ],
      },
      {
        label: "Ground Floor",
        spaces: [
          { id: "A-01", type: "Standard", status: "available", price: "$4.50/hr" },
          { id: "A-02", type: "Standard", status: "occupied", price: "$4.50/hr" },
          { id: "A-03", type: "Compact", status: "available", price: "$3.50/hr" },
          { id: "A-04", type: "Standard", status: "reserved", price: "$4.50/hr" },
          { id: "A-05", type: "EV", status: "occupied", price: "$5.50/hr" },
        ],
      },
    ],
  },
  "Marina Bay Lot": {
    total: 8,
    available: 4,
    occupied: 2,
    reserved: 1,
    maintenance: 1,
    floors: [
      {
        label: "Floor 1",
        spaces: [
          { id: "B-01", type: "Standard", status: "available", price: "$3.75/hr" },
          { id: "B-02", type: "Standard", status: "occupied", price: "$3.75/hr" },
          { id: "B-03", type: "Compact", status: "available", price: "$2.75/hr" },
          { id: "B-04", type: "Standard", status: "maintenance", price: "$3.75/hr" },
        ],
      },
      {
        label: "Ground Floor",
        spaces: [
          { id: "A-01", type: "Standard", status: "available", price: "$3.75/hr" },
          { id: "A-02", type: "EV", status: "occupied", price: "$4.75/hr" },
          { id: "A-03", type: "Standard", status: "reserved", price: "$3.75/hr" },
          { id: "A-04", type: "Compact", status: "available", price: "$2.75/hr" },
        ],
      },
    ],
  },
  "Westfield Mall Deck": {
    total: 12,
    available: 6,
    occupied: 4,
    reserved: 1,
    maintenance: 1,
    floors: [
      {
        label: "Floor 1",
        spaces: [
          { id: "B-01", type: "Standard", status: "available", price: "$3/hr" },
          { id: "B-02", type: "Standard", status: "occupied", price: "$3/hr" },
          { id: "B-03", type: "Compact", status: "available", price: "$2.25/hr" },
          { id: "B-04", type: "Accessible", status: "occupied", price: "$3/hr" },
          { id: "B-05", type: "Standard", status: "available", price: "$3/hr" },
          { id: "B-06", type: "Standard", status: "maintenance", price: "$3/hr" },
        ],
      },
      {
        label: "Ground Floor",
        spaces: [
          { id: "A-01", type: "Standard", status: "available", price: "$3/hr" },
          { id: "A-02", type: "EV", status: "occupied", price: "$4/hr" },
          { id: "A-03", type: "Compact", status: "available", price: "$2.25/hr" },
          { id: "A-04", type: "Standard", status: "reserved", price: "$3/hr" },
          { id: "A-05", type: "Standard", status: "available", price: "$3/hr" },
          { id: "A-06", type: "Standard", status: "occupied", price: "$3/hr" },
        ],
      },
    ],
  },
  "North Deck Garage": {
    total: 6,
    available: 2,
    occupied: 2,
    reserved: 1,
    maintenance: 1,
    floors: [
      {
        label: "Floor 1",
        spaces: [
          { id: "B-01", type: "Standard", status: "available", price: "$2.50/hr" },
          { id: "B-02", type: "Standard", status: "occupied", price: "$2.50/hr" },
          { id: "B-03", type: "Compact", status: "maintenance", price: "$2/hr" },
        ],
      },
      {
        label: "Ground Floor",
        spaces: [
          { id: "A-01", type: "Standard", status: "reserved", price: "$2.50/hr" },
          { id: "A-02", type: "Standard", status: "available", price: "$2.50/hr" },
          { id: "A-03", type: "Standard", status: "occupied", price: "$2.50/hr" },
        ],
      },
    ],
  },
};

const LOCATION_NAMES = Object.keys(LOCATIONS_DATA);
const STATUS_LABEL = { available: "Available", occupied: "Occupied", reserved: "Reserved" };

/* ---------------- Sub components ---------------- */

function TopHeader() {
  return (
    <div className="pkav-topheader">
      <div className="pkav-search-box">
        {Icon.search}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="pkav-header-right">
        <button className="pkav-bell">
          {Icon.bell}
          <span className="pkav-dot" />
        </button>
        <div className="pkav-user-chip">
          <div className="pkav-avatar">AA</div>
          <div className="pkav-who">
            <div className="pkav-name">Ahmed Al-Rashid</div>
            <div className="pkav-role">Parking Owner</div>
          </div>
          {Icon.chevronDown}
        </div>
      </div>
    </div>
  );
}

function LocationTabs({ active, onChange }) {
  return (
    <div className="pkav-tabs">
      {LOCATION_NAMES.map((name) => (
        <button
          key={name}
          className={`pkav-tab${name === active ? " active" : ""}`}
          onClick={() => onChange(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function StatsRow({ data }) {
  const occupancyPct = Math.round(((data.occupied + data.reserved) / data.total) * 100);
  const cards = [
    { icon: Icon.check, iconClass: "pkav-icon-green", value: data.available, label: "Available" },
    { icon: Icon.x, iconClass: "pkav-icon-red", value: data.occupied, label: "Occupied" },
    { icon: Icon.calendar, iconClass: "pkav-icon-blue", value: data.reserved, label: "Reserved" },
    { icon: Icon.chart, iconClass: "pkav-icon-purple", value: `${occupancyPct}%`, label: "Occupancy %" },
  ];
  return (
    <div className="pkav-stats-grid">
      {cards.map((c) => (
        <div className="pkav-stat-card" key={c.label}>
          <div className={`pkav-stat-icon ${c.iconClass}`}>{c.icon}</div>
          <div className="pkav-value">{c.value}</div>
          <div className="pkav-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function OccupancyBreakdown({ location, data }) {
  const used = data.occupied + data.reserved;
  const pct = (n) => (n / data.total) * 100;
  return (
    <div className="pkav-breakdown">
      <div className="pkav-breakdown-head">
        <h3>Occupancy Breakdown — {location}</h3>
        <div className="pkav-used">
          <strong>{used}</strong> / {data.total} used
        </div>
      </div>
      <div className="pkav-bar-track">
        <div className="pkav-bar-seg occupied" style={{ width: `${pct(data.occupied)}%` }} />
        <div className="pkav-bar-seg reserved" style={{ width: `${pct(data.reserved)}%` }} />
        <div className="pkav-bar-seg available" style={{ width: `${pct(data.available)}%` }} />
        <div className="pkav-bar-seg maintenance" style={{ width: `${pct(data.maintenance)}%` }} />
      </div>
      <div className="pkav-legend">
        <div className="pkav-legend-item"><span className="pkav-legend-dot occupied" /> Occupied</div>
        <div className="pkav-legend-item"><span className="pkav-legend-dot reserved" /> Reserved</div>
        <div className="pkav-legend-item"><span className="pkav-legend-dot available" /> Available</div>
        <div className="pkav-legend-item"><span className="pkav-legend-dot maintenance" /> Maintenance</div>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button className={`pkav-toggle${on ? " on" : ""}`} onClick={onToggle} aria-pressed={on} aria-label="Toggle space open/closed">
      <span className="pkav-toggle-knob" />
    </button>
  );
}

function SpaceCard({ space }) {
  const [isOpen, setIsOpen] = useState(space.status !== "maintenance" && space.status === "available");
  const typeClass = space.type.toLowerCase().replace(/\s+/g, "-").includes("ev") ? "ev" : space.type.toLowerCase();

  return (
    <div className={`pkav-space-card ${space.status}`}>
      <div className="pkav-space-top">
        <span className="pkav-space-id">{space.id}</span>
        {space.status === "maintenance" ? (
          <span className="pkav-maint-badge">Maint.</span>
        ) : (
          <Toggle on={isOpen} onToggle={() => setIsOpen((o) => !o)} />
        )}
      </div>
      <div className={`pkav-space-type ${typeClass}`}>{space.type === "EV" ? "EV" : space.type}</div>
      <div className="pkav-space-bottom">
        <span className={`pkav-space-status ${space.status}`}>
          {space.status === "maintenance" ? "Maintenance" : STATUS_LABEL[space.status]}
        </span>
        <span className="pkav-space-price">{space.price}</span>
      </div>
    </div>
  );
}

function FloorSection({ floor }) {
  return (
    <div>
      <div className="pkav-floor-label">{floor.label}</div>
      <div className="pkav-floor-grid">
        {floor.spaces.map((s) => (
          <SpaceCard space={s} key={s.id} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Main export ---------------- */

export default function Availability({ onNavigate }) {
  const [activeLocation, setActiveLocation] = useState(LOCATION_NAMES[0]);
  const data = LOCATIONS_DATA[activeLocation];

  return (
    <div className="pkav">
      <div className="pkav-app">
        <Sidebar active="availability" onNavigate={onNavigate} showFooter />

        <main>
          <TopHeader />
          <div className="pkav-main">
            <div className="pkav-page-head">
              <h1>Space Availability</h1>
              <div className="pkav-sub">Toggle individual spaces open or closed in real time</div>
            </div>

            <LocationTabs active={activeLocation} onChange={setActiveLocation} />
            <StatsRow data={data} />
            <OccupancyBreakdown location={activeLocation} data={data} />

            {data.floors.map((floor) => (
              <FloorSection floor={floor} key={floor.label} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}