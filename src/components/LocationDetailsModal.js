

const carIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 16V11.5a1 1 0 0 1 .3-.7l1.6-1.6c.2-.2.5-.4.8-.4h10.6c.3 0 .6.1.8.4l1.6 1.6c.2.2.3.4.3.7V16" />
    <path d="M3 16h18v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H6.5v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z" />
  </svg>
);

const Icon = {
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.3 2.3 2.3 4.7-4.7" />
    </svg>
  ),
  dot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
};

/**
 * Read-only "Location Details" view.
 * `location` shape:
 * {
 *   name, address, cityState,
 *   total, available, occupied, reserved,
 *   price,     // e.g. "$4.50 / hour"
 *   rating,    // e.g. "4.8 / 5.0" or "New"
 *   revenue,   // e.g. "$8,420" or "$0"
 *   active,    // boolean
 * }
 */
export default function LocationDetailsModal({ isOpen, location, onClose, onEdit, onManageSpaces }) {
  if (!isOpen || !location) return null;

  return (
    <div className="pkd-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="pkd-modal" role="dialog" aria-modal="true" aria-labelledby="pkd-title">
        <div className="pkd-head">
          <div>
            <h2 id="pkd-title">Location Details</h2>
            <p className="pkd-sub">{location.cityState}</p>
          </div>
          <button className="pkd-close" onClick={onClose} aria-label="Close">
            {Icon.close}
          </button>
        </div>

        <div className="pkd-photo">
          <div className="pkd-photo-cars">
            {carIcon}
            {carIcon}
            {carIcon}
            {carIcon}
          </div>
          <div className="pkd-photo-text">
            <div className="pkd-name">{location.name}</div>
            <div className="pkd-addr">{location.address}</div>
          </div>
        </div>

        <div className="pkd-stats">
          <div className="pkd-stat total">
            <div className="pkd-stat-value">{location.total}</div>
            <div className="pkd-stat-label">Total</div>
          </div>
          <div className="pkd-stat available">
            <div className="pkd-stat-value">{location.available}</div>
            <div className="pkd-stat-label">Available</div>
          </div>
          <div className="pkd-stat occupied">
            <div className="pkd-stat-value">{location.occupied}</div>
            <div className="pkd-stat-label">Occupied</div>
          </div>
          <div className="pkd-stat reserved">
            <div className="pkd-stat-value">{location.reserved}</div>
            <div className="pkd-stat-label">Reserved</div>
          </div>
        </div>

        <div className="pkd-rows">
          <div className="pkd-row">
            <span className="pkd-row-label">Base Price</span>
            <span className="pkd-row-value">{location.price}</span>
          </div>
          <div className="pkd-row">
            <span className="pkd-row-label">Rating</span>
            <span className="pkd-row-value star">
              {location.rating} {location.rating !== "New" && Icon.star}
            </span>
          </div>
          <div className="pkd-row">
            <span className="pkd-row-label">This Month Revenue</span>
            <span className="pkd-row-value">{location.revenue}</span>
          </div>
          <div className="pkd-row">
            <span className="pkd-row-label">Status</span>
            <span className={`pkd-status ${location.active ? "active" : "inactive"}`}>
              {location.active ? Icon.check : Icon.dot}
              {location.active ? "Active & Accepting Bookings" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="pkd-actions">
          <button className="pkd-btn-primary" onClick={onEdit}>
            {Icon.pencil} Edit Location
          </button>
          <button className="pkd-btn-secondary" onClick={onManageSpaces}>
            Manage Spaces
          </button>
          <button className="pkd-btn-text" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}