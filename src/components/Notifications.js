import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import notificationsApi from "../api/Notificationsapi";

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
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  ),
};

const TYPE_META = {
  booking: { icon: Icon.calendar, iconClass: "pknot-icon-blue" },
  cancellation: { icon: Icon.x, iconClass: "pknot-icon-red" },
  alert: { icon: Icon.bell, iconClass: "pknot-icon-yellow" },
  update: { icon: Icon.refresh, iconClass: "pknot-icon-purple" },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "booking", label: "Booking" },
  { key: "cancellation", label: "Cancellation" },
  { key: "alert", label: "Alert" },
  { key: "update", label: "Update" },
];

/* =========================================================================
   ADAPTERS — turn API JSON into the exact shapes the UI below expects.
   Every field is read defensively (with fallbacks); the assumed field
   name is written next to each line. If your DTOs use different names,
   this is the only place you need to edit.
   ========================================================================= */

/** Turns a Date/ISO string into a relative "x ago" label, for when the
 *  backend sends `createdAt` instead of an already-formatted `timeAgo`. */
function relativeTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs < 24) return remMins ? `${hrs}h ${remMins}m ago` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/** GET /api/Notifications → { items: [...], total, page, pageSize } (or a bare array). */
function mapNotificationList(data) {
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return items.map((n) => ({
    id: n.id,
    type: n.type ?? "update",
    unread: n.unread ?? !(n.isRead ?? n.read ?? false),
    title: n.title ?? "",
    desc: n.desc ?? n.message ?? n.description ?? "",
    time: n.timeAgo ?? n.time ?? relativeTime(n.createdAt ?? n.date),
  }));
}

/** GET /api/Notifications/summary → total/unread counts, overall and per category. */
function mapSummary(data) {
  const safe = data || {};
  const byType = safe.byType ?? safe.categories ?? {};
  const countFor = (key) => byType[key]?.total ?? byType[key] ?? 0;

  return {
    total: safe.total ?? 0,
    unread: safe.unread ?? 0,
    counts: {
      all: safe.total ?? 0,
      booking: countFor("booking"),
      cancellation: countFor("cancellation"),
      alert: countFor("alert"),
      update: countFor("update"),
    },
  };
}

/* ---------------- Sub components ---------------- */

function TopHeader() {
  return (
    <div className="pknot-topheader">
      <div className="pknot-search-box">
        {Icon.search}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="pknot-header-right">
        <button className="pknot-bell">
          {Icon.bell}
          <span className="pknot-dot" />
        </button>
        <div className="pknot-user-chip">
          <div className="pknot-avatar">AA</div>
          <div className="pknot-who">
            <div className="pknot-name">Ahmed Al-Rashid</div>
            <div className="pknot-role">Parking Owner</div>
          </div>
          {Icon.chevronDown}
        </div>
      </div>
    </div>
  );
}

function PageHead({ unreadCount, onMarkAllRead, markingAll }) {
  return (
    <div className="pknot-page-head">
      <div>
        <h1>Notifications</h1>
        <div className="pknot-sub">{unreadCount} unread notifications</div>
      </div>
      <button className="pknot-btn-markread" onClick={onMarkAllRead} disabled={unreadCount === 0 || markingAll}>
        {Icon.check} {markingAll ? "Marking…" : "Mark All as Read"}
      </button>
    </div>
  );
}

function StatsRow({ counts }) {
  const cards = [
    { icon: Icon.calendar, iconClass: "pknot-icon-blue", value: counts.booking, label: "Bookings" },
    { icon: Icon.x, iconClass: "pknot-icon-red", value: counts.cancellation, label: "Cancellations" },
    { icon: Icon.bell, iconClass: "pknot-icon-yellow", value: counts.alert, label: "Alerts" },
    { icon: Icon.refresh, iconClass: "pknot-icon-purple", value: counts.update, label: "Updates" },
  ];
  return (
    <div className="pknot-stats-grid">
      {cards.map((c) => (
        <div className="pknot-stat-card" key={c.label}>
          <div className={`pknot-stat-icon ${c.iconClass}`}>{c.icon}</div>
          <div className="pknot-value">{c.value}</div>
          <div className="pknot-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function Tabs({ active, onChange, counts }) {
  return (
    <div className="pknot-tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`pknot-tab${t.key === active ? " active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          <span className="pknot-tab-count">{counts[t.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

function NotificationItem({ n, onOpen }) {
  const meta = TYPE_META[n.type] ?? TYPE_META.update;
  return (
    <div
      className={`pknot-item${n.unread ? " unread" : ""}`}
      onClick={() => n.unread && onOpen(n.id)}
      style={{ cursor: n.unread ? "pointer" : "default" }}
    >
      <div className={`pknot-item-icon ${meta.iconClass}`}>{meta.icon}</div>
      <div className="pknot-item-body">
        <div className="pknot-item-title">{n.title}</div>
        <div className="pknot-item-desc">{n.desc}</div>
      </div>
      <div className="pknot-item-meta">
        {n.unread && <span className="pknot-unread-dot" />}
        {n.time}
      </div>
    </div>
  );
}

/* ---------------- Main export ---------------- */

const EMPTY_SUMMARY = { total: 0, unread: 0, counts: { all: 0, booking: 0, cancellation: 0, alert: 0, update: 0 } };

export default function Notifications({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Reload the notification list whenever the active tab changes (server-side
  // filtering via ?type=), and reload the summary (counts) alongside it.
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [listRes, summaryRes] = await Promise.all([
          notificationsApi.list({
            page: 1,
            pageSize: 50,
            type: activeTab === "all" ? undefined : activeTab,
            signal: controller.signal,
          }),
          notificationsApi.getSummary(controller.signal),
        ]);
        if (cancelled) return;
        setNotifications(mapNotificationList(listRes));
        setSummary(mapSummary(summaryRes));
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setError(err.message || "Failed to load notifications.");
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
  }, [activeTab, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  // Clicking an unread notification marks just that one as read (optimistic
  // update + PATCH call), matching PATCH /api/Notifications/{id}/read.
  const markOneRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    setSummary((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    try {
      await notificationsApi.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Not rolling back the optimistic update to keep the UI simple; the
      // next full reload (tab switch / refresh) will reconcile with the server.
    }
  }, []);

  // "Mark All as Read" → PATCH /api/Notifications/read-all, then refresh.
  const markAllRead = useCallback(async () => {
    setMarkingAll(true);
    const prevNotifications = notifications;
    const prevSummary = summary;
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setSummary((prev) => ({ ...prev, unread: 0 }));
    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setNotifications(prevNotifications);
      setSummary(prevSummary);
      setError(err.message || "Failed to mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  }, [notifications, summary]);

  return (
    <div className="pknot">
      <div className="pknot-app">
        <Sidebar active="notifications" onNavigate={onNavigate} showFooter />

        <main>
          <TopHeader />
          <div className="pknot-main">
            <PageHead unreadCount={summary.unread} onMarkAllRead={markAllRead} markingAll={markingAll} />

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
                <span>Couldn't load notifications: {error}</span>
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

            <StatsRow counts={summary.counts} />

            <div className="pknot-list-card">
              <Tabs active={activeTab} onChange={setActiveTab} counts={summary.counts} />
              {loading ? (
                <div className="pknot-empty">Loading notifications…</div>
              ) : notifications.length === 0 ? (
                <div className="pknot-empty">No notifications in this category.</div>
              ) : (
                notifications.map((n) => <NotificationItem n={n} key={n.id} onOpen={markOneRead} />)
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}