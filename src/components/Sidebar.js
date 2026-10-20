

/* Plain inline SVG icons — no external icon library required */
const Icon = {
  car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 16V11.5a1 1 0 0 1 .3-.7l1.6-1.6c.2-.2.5-.4.8-.4h10.6c.3 0 .6.1.8.4l1.6 1.6c.2.2.3.4.3.7V16" />
      <path d="M3 16h18v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H6.5v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z" />
      <circle cx="7.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
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
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
};

/* Single source of truth for the whole app's navigation.
   `route` must match the key used in App.jsx's page switch. */
export const NAV_ITEMS = [
  { label: "Dashboard", icon: Icon.grid, route: "dashboard" },
  { label: "Parking Locations", icon: Icon.pin, route: "locations" },
  { label: "Space Management", icon: Icon.box, route: "Spacemanagement" },
  { label: "Availability", icon: Icon.refresh, route: "availability" },
  { label: "Reservations", icon: Icon.calendar, route: "reservations" },
  { label: "Pricing", icon: Icon.tag, route: "pricing" },
  { label: "Revenue & Reports", icon: Icon.chart, route: "revenue-reports" },
  { label: "Notifications", icon: Icon.bell, route: "notifications", badge: 4 },
  { label: "Settings", icon: Icon.gear, route: "settings" },
];

/**
 * Shared sidebar — renders on every page.
 * @param {string} active   current route key (highlights the matching item)
 * @param {(route:string)=>void} onNavigate  called with the clicked item's route
 * @param {boolean} showFooter  whether to render the user footer block
 */
export default function Sidebar({ active, onNavigate, showFooter = false }) {
  return (
    <aside className="pk-sidebar">
      <div className="pk-brand">
        <div className="pk-brand-mark">{Icon.car}</div>
        <div className="pk-brand-name">PARKLY</div>
      </div>
      <div className="pk-brand-divider" />

      <nav className="pk-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.route}
            className={`pk-nav-item${item.route === active ? " active" : ""}`}
            onClick={() => onNavigate && onNavigate(item.route)}
          >
            {item.icon}
            {item.label}
            {item.badge != null && <span className="pk-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {showFooter && (
        <div className="pk-sidebar-footer">
          <div className="pk-avatar">AA</div>
          <div>
            <div className="pk-name">Ahmed Al-Rashid</div>
            <div className="pk-role">Parking Owner</div>
          </div>
        </div>
      )}
    </aside>
  );
}