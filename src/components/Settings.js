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
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6l8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
};

/* ---------------- Static data — swap for real data/props/API calls ---------------- */

const PROFILE = {
  initials: "AR",
  name: "Ahmed Rashid",
  email: "ahmed.rashid@parkly.com",
  since: "Parkly Owner since Jan 2024",
  stats: [
    { value: "4", label: "Locations" },
    { value: "18", label: "Total Spaces" },
    { value: "352", label: "Bookings" },
    { value: "$18.2k", label: "Avg Revenue" },
    { value: "4.6★", label: "Avg Rating" },
  ],
};

const TABS = ["Personal", "Business", "Security", "Notifications"];

/* ---------------- Sub components ---------------- */

function TopHeader() {
  return (
    <div className="pkset-topheader">
      <div className="pkset-search-box">
        {Icon.search}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="pkset-header-right">
        <button className="pkset-bell">
          {Icon.bell}
          <span className="pkset-dot" />
        </button>
        <div className="pkset-user-chip">
          <div className="pkset-avatar">AA</div>
          <div className="pkset-who">
            <div className="pkset-name">Ahmed Al-Rashid</div>
            <div className="pkset-role">Parking Owner</div>
          </div>
          {Icon.chevronDown}
        </div>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="pkset-profile-card">
      <div className="pkset-profile-banner" />
      <div className="pkset-profile-body">
        <div className="pkset-profile-row">
          <div className="pkset-profile-left">
            <div className="pkset-profile-avatar">{PROFILE.initials}</div>
            <div>
              <div className="pkset-profile-name">{PROFILE.name}</div>
              <div className="pkset-profile-meta">{PROFILE.email} · {PROFILE.since}</div>
            </div>
          </div>
          <div className="pkset-profile-actions">
            <span className="pkset-verified-pill">{Icon.shield} Verified Owner</span>
            <button className="pkset-btn-editphoto">{Icon.pencil} Edit Photo</button>
          </div>
        </div>
        <div className="pkset-stats-row">
          {PROFILE.stats.map((s) => (
            <div className="pkset-stat" key={s.label}>
              <div className="pkset-stat-value">{s.value}</div>
              <div className="pkset-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="pkset-field">
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}

function PersonalForm() {
  const [form, setForm] = useState({
    fullName: "Ahmed Rashid",
    email: "ahmed.rashid@parkly.com",
    phone: "+1 212-555-8800",
    cityState: "New York, NY",
    bio: "Parking lot operator based in New York. Managing 4 locations across the city.",
  });
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form className="pkset-form" onSubmit={(e) => { e.preventDefault(); console.log("Save personal info:", form); }}>
      <div className="pkset-form-row">
        <Field label="Full Name" value={form.fullName} onChange={update("fullName")} />
        <Field label="Email Address" type="email" value={form.email} onChange={update("email")} />
      </div>
      <div className="pkset-form-row">
        <Field label="Phone Number" value={form.phone} onChange={update("phone")} />
        <Field label="City, State" value={form.cityState} onChange={update("cityState")} />
      </div>
      <div className="pkset-field pkset-field-full">
        <label>Bio (optional)</label>
        <textarea rows={2} value={form.bio} onChange={update("bio")} />
      </div>
      <button type="submit" className="pkset-btn-save">{Icon.check} Save Changes</button>
    </form>
  );
}

function BusinessForm() {
  const [form, setForm] = useState({
    businessName: "Rashid Parking LLC",
    taxId: "12-3456789",
    streetAddress: "100 Business Ave, Suite 400",
    cityStateZip: "New York, NY 10001",
  });
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form className="pkset-form" onSubmit={(e) => { e.preventDefault(); console.log("Save business info:", form); }}>
      <div className="pkset-form-row">
        <Field label="Business Name" value={form.businessName} onChange={update("businessName")} />
        <Field label="EIN / Tax ID" value={form.taxId} onChange={update("taxId")} />
      </div>
      <div className="pkset-form-row">
        <Field label="Street Address" value={form.streetAddress} onChange={update("streetAddress")} />
        <Field label="City, State ZIP" value={form.cityStateZip} onChange={update("cityStateZip")} />
      </div>

      <div className="pkset-verified-banner">
        {Icon.shield} Business identity verified · Last verified Aug 1, 2026
      </div>

      <button type="submit" className="pkset-btn-save">{Icon.check} Save Business Info</button>
    </form>
  );
}

const ACTIVE_SESSIONS = [
  { device: "MacBook Pro · Chrome 126", location: "New York, NY · Current session", status: "current" },
  { device: "iPhone 15 · Safari", location: "New York, NY", status: "2 days ago" },
];

function SecurityForm() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [smsTwoFactor, setSmsTwoFactor] = useState(true);
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const revokeSession = (device) => {
    setSessions((prev) => prev.filter((s) => s.device !== device));
  };

  return (
    <div className="pkset-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Update password:", form);
        }}
      >
        <h4 className="pkset-section-title">Change Password</h4>
        <div className="pkset-field pkset-field-full">
          <label>Current Password</label>
          <input type="password" value={form.current} onChange={update("current")} />
        </div>
        <div className="pkset-field pkset-field-full">
          <label>New Password</label>
          <input type="password" value={form.next} onChange={update("next")} />
          <div className="pkset-field-hint">Minimum 8 characters with at least one number and symbol.</div>
        </div>
        <div className="pkset-field pkset-field-full">
          <label>Confirm Password</label>
          <input type="password" value={form.confirm} onChange={update("confirm")} />
        </div>
        <button type="submit" className="pkset-btn-save">Update Password</button>
      </form>

      <div className="pkset-section-divider" />

      <h4 className="pkset-section-title">Two-Factor Authentication</h4>
      <div className="pkset-toggle-row pkset-toggle-row-boxed">
        <div>
          <div className="pkset-toggle-row-label">SMS Two-Factor Authentication</div>
          <div className="pkset-toggle-row-sub">Secure your account with a code sent to your phone.</div>
        </div>
        <button
          type="button"
          className={`pkset-toggle${smsTwoFactor ? " on" : ""}`}
          onClick={() => setSmsTwoFactor((v) => !v)}
          aria-pressed={smsTwoFactor}
        >
          <span className="pkset-toggle-knob" />
        </button>
      </div>

      <div className="pkset-section-divider" />

      <h4 className="pkset-section-title">Active Sessions</h4>
      {sessions.map((s) => (
        <div className="pkset-session-row" key={s.device}>
          <div>
            <div className="pkset-session-device">{s.device}</div>
            <div className="pkset-session-location">{s.location}</div>
          </div>
          {s.status === "current" ? (
            <span className="pkset-session-active">Active now</span>
          ) : (
            <div className="pkset-session-right">
              <span className="pkset-session-time">{s.status}</span>
              <button className="pkset-btn-revoke" onClick={() => revokeSession(s.device)}>
                Revoke
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NotificationsForm() {
  const [prefs, setPrefs] = useState({
    newBookings: true,
    cancellations: true,
    revenueMilestones: true,
    spaceAlerts: true,
    marketing: false,
  });
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const rows = [
    { key: "newBookings", label: "New Bookings", sub: "Receive alerts when a new booking is made" },
    { key: "cancellations", label: "Cancellations", sub: "Notify me when a customer cancels" },
    { key: "revenueMilestones", label: "Revenue Milestones", sub: "Monthly revenue targets and achievements" },
    { key: "spaceAlerts", label: "Space Alerts", sub: "Maintenance flags and availability changes" },
    { key: "marketing", label: "Marketing Updates", sub: "Tips, guides, and Parkly product updates" },
  ];

  return (
    <div className="pkset-form">
      {rows.map((r) => (
        <div className="pkset-toggle-row" key={r.key}>
          <div>
            <div className="pkset-toggle-row-label">{r.label}</div>
            <div className="pkset-toggle-row-sub">{r.sub}</div>
          </div>
          <button
            type="button"
            className={`pkset-toggle${prefs[r.key] ? " on" : ""}`}
            onClick={() => toggle(r.key)}
            aria-pressed={prefs[r.key]}
          >
            <span className="pkset-toggle-knob" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="pkset-btn-save"
        style={{ marginTop: 18 }}
        onClick={() => console.log("Save notification prefs:", prefs)}
      >
        Save Preferences
      </button>
    </div>
  );
}

function TabsCard() {
  const [active, setActive] = useState("Personal");
  return (
    <div className="pkset-tabs-card">
      <div className="pkset-tabs">
        {TABS.map((t) => (
          <button key={t} className={`pkset-tab${t === active ? " active" : ""}`} onClick={() => setActive(t)}>
            {t}
          </button>
        ))}
      </div>
      {active === "Personal" && <PersonalForm />}
      {active === "Business" && <BusinessForm />}
      {active === "Security" && <SecurityForm />}
      {active === "Notifications" && <NotificationsForm />}
    </div>
  );
}

function DangerZone({ onDelete }) {
  return (
    <div className="pkset-danger">
      <div>
        <h4>Danger Zone</h4>
        <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
      </div>
      <button className="pkset-btn-delete" onClick={onDelete}>
        {Icon.trash} Delete Account
      </button>
    </div>
  );
}

/* ---------------- Main export ---------------- */

export default function Settings({ onNavigate }) {
  return (
    <div className="pkset">
      <div className="pkset-app">
        <Sidebar active="settings" onNavigate={onNavigate} showFooter />

        <main>
          <TopHeader />
          <div className="pkset-main">
            <div className="pkset-page-head">
              <h1>Profile &amp; Settings</h1>
              <div className="pkset-sub">Manage your account, business, and security settings</div>
            </div>

            <ProfileCard />
            <TabsCard />
            <DangerZone onDelete={() => console.log("Delete account requested")} />
          </div>
        </main>
      </div>
    </div>
  );
}