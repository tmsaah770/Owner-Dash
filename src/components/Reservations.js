import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import reservationsApi from "../api/reservationsApi";

/* =========================================================
   ICONS
========================================================= */

const Icon = {
  bell: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),

  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),

  chevronDown: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),

  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  ),

  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),

  checkCircle: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.3 2.3 2.3 4.7-4.7" />
    </svg>
  ),

  x: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),

  eye: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
};

/* =========================================================
   STATUS
========================================================= */

const STATUS_LABEL = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  pending: "Upcoming",
  confirmed: "Upcoming",
};

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(status) {
  if (!status) return "upcoming";

  const value = String(status).toLowerCase().trim();

  if (
    value.includes("cancel") ||
    value === "canceled"
  ) {
    return "cancelled";
  }

  if (
    value.includes("complete") ||
    value.includes("finished")
  ) {
    return "completed";
  }

  if (
    value.includes("active") ||
    value.includes("checkedin") ||
    value.includes("checked-in") ||
    value.includes("inprogress")
  ) {
    return "active";
  }

  if (
    value.includes("pending") ||
    value.includes("confirm") ||
    value.includes("upcoming")
  ) {
    return "upcoming";
  }

  return value;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(hours) {
  if (
    hours === undefined ||
    hours === null ||
    hours === ""
  ) {
    return "-";
  }

  const number = Number(hours);

  if (Number.isNaN(number)) {
    return String(hours);
  }

  if (number === 1) {
    return "1h";
  }

  if (Number.isInteger(number)) {
    return `${number}h`;
  }

  return `${number}h`;
}

function formatAmount(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return value || "$0.00";
  }

  return `$${number.toFixed(2)}`;
}

/* =========================================================
   EXTRACT RESPONSE
========================================================= */

function extractResponseData(response) {
  const payload = response?.data;

  /*
   Backend responses normally look like:

   {
     isSuccess: true,
     message: "...",
     data: ...
   }
  */

  return payload?.data ?? payload ?? {};
}

function extractItems(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.reservations)) {
    return data.reservations;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

/* =========================================================
   NORMALIZE RESERVATION
========================================================= */

function normalizeReservation(item, index) {
  const customerName =
    item.customerName ||
    item.userName ||
    item.name ||
    item.customer?.name ||
    "Customer";

  const initials =
    item.customerInitials ||
    item.initials ||
    customerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const arrival =
    item.arrivalTime ||
    item.startTime ||
    item.startDateTime ||
    item.checkInTime ||
    item.from;

  const departure =
    item.departureTime ||
    item.endTime ||
    item.endDateTime ||
    item.checkOutTime ||
    item.to;

  const duration =
    item.durationHours ??
    item.duration ??
    (arrival && departure
      ? (
          (new Date(departure).getTime() -
            new Date(arrival).getTime()) /
          (1000 * 60 * 60)
        ).toFixed(1)
      : null);

  const rawStatus =
    item.status ||
    item.reservationStatus ||
    "Upcoming";

  const status = normalizeStatus(rawStatus);

  return {
    id:
      item.reservationId ||
      item.id ||
      item.reservationID ||
      `reservation-${index}`,

    customer: customerName,

    email:
      item.customerEmail ||
      item.email ||
      item.userEmail ||
      "-",

    initials,

    color:
      item.color ||
      "#2f6df0",

    code:
      item.bookingReference ||
      item.bookingCode ||
      item.reference ||
      item.code ||
      "-",

    location:
      item.parkingName ||
      item.locationName ||
      item.parking?.name ||
      item.location ||
      "-",

    space:
      item.spotNumber ||
      item.spaceNumber ||
      item.spot ||
      item.space ||
      "-",

    date:
      formatDate(
        item.date ||
          item.arrivalTime ||
          item.startTime ||
          item.startDateTime
      ),

    time:
      formatTime(arrival),

    duration:
      formatDuration(duration),

    amount:
      formatAmount(
        item.totalPrice ??
          item.totalAmount ??
          item.amount ??
          item.price ??
          0
      ),

    status,

    raw: item,
  };
}

/* =========================================================
   TOP HEADER
========================================================= */

function TopHeader() {
  return (
    <div className="pkres-topheader">

      <div className="pkres-search-box">
        {Icon.search}

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="pkres-header-right">

        <button className="pkres-bell">
          {Icon.bell}
          <span className="pkres-dot" />
        </button>

        <div className="pkres-user-chip">

          <div className="pkres-avatar">
            AA
          </div>

          <div className="pkres-who">

            <div className="pkres-name">
              Ahmed Al-Rashid
            </div>

            <div className="pkres-role">
              Parking Owner
            </div>

          </div>

          {Icon.chevronDown}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHead({
  search,
  onSearchChange,
  total,
}) {
  return (
    <div className="pkres-page-head">

      <div>

        <h1>
          Reservations
        </h1>

        <div className="pkres-sub">
          {total} total bookings
        </div>

      </div>

      <div className="pkres-search-box">

        {Icon.search}

        <input
          type="text"
          placeholder="Search customer or code..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />

      </div>

    </div>
  );
}

/* =========================================================
   STATS
========================================================= */

function StatsRow({
  rows,
  summary,
}) {
  const upcoming =
    summary?.upcoming ??
    rows.filter(
      (r) => r.status === "upcoming"
    ).length;

  const active =
    summary?.active ??
    rows.filter(
      (r) => r.status === "active"
    ).length;

  const completed =
    summary?.completed ??
    rows.filter(
      (r) => r.status === "completed"
    ).length;

  const cancelled =
    summary?.cancelled ??
    summary?.canceled ??
    rows.filter(
      (r) => r.status === "cancelled"
    ).length;

  const cards = [
    {
      icon: Icon.calendar,
      iconClass: "pkres-icon-blue",
      value: upcoming,
      label: "Upcoming",
    },

    {
      icon: Icon.check,
      iconClass: "pkres-icon-green",
      value: active,
      label: "Active Now",
    },

    {
      icon: Icon.checkCircle,
      iconClass: "pkres-icon-purple",
      value: completed,
      label: "Completed",
    },

    {
      icon: Icon.x,
      iconClass: "pkres-icon-red",
      value: cancelled,
      label: "Cancelled",
    },
  ];

  return (
    <div className="pkres-stats-grid">

      {cards.map((card) => (
        <div
          className="pkres-stat-card"
          key={card.label}
        >

          <div
            className={`pkres-stat-icon ${card.iconClass}`}
          >
            {card.icon}
          </div>

          <div className="pkres-value">
            {card.value}
          </div>

          <div className="pkres-label">
            {card.label}
          </div>

        </div>
      ))}

    </div>
  );
}

/* =========================================================
   TABS
========================================================= */

function Tabs({
  active,
  onChange,
  rows,
}) {
  return (
    <div className="pkres-tabs">

      {TABS.map((tab) => {

        const count =
          tab.key === "all"
            ? rows.length
            : rows.filter(
                (r) =>
                  r.status === tab.key
              ).length;

        return (
          <button
            key={tab.key}
            className={`pkres-tab${
              tab.key === active
                ? " active"
                : ""
            }`}
            onClick={() =>
              onChange(tab.key)
            }
          >

            {tab.label}

            <span className="pkres-tab-count">
              {count}
            </span>

          </button>
        );
      })}

    </div>
  );
}

/* =========================================================
   TABLE
========================================================= */

function ReservationsTable({
  rows,
  onView,
}) {
  return (
    <div className="pkres-table-scroll">

      <table className="pkres-table">

        <thead>

          <tr>
            <th>Customer</th>
            <th>Code</th>
            <th>Location</th>
            <th>Space</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {rows.map((r) => (

            <tr key={r.id}>

              <td>

                <div className="pkres-cust">

                  <div
                    className="pkres-avatar"
                    style={{
                      background:
                        r.color,
                    }}
                  >
                    {r.initials}
                  </div>

                  <div>

                    <div className="pkres-cname">
                      {r.customer}
                    </div>

                    <div className="pkres-cemail">
                      {r.email}
                    </div>

                  </div>

                </div>

              </td>

              <td>
                <span className="pkres-code">
                  {r.code}
                </span>
              </td>

              <td>
                <span className="pkres-cell">
                  {r.location}
                </span>
              </td>

              <td>
                <span className="pkres-space-chip">
                  {r.space}
                </span>
              </td>

              <td>
                <span className="pkres-cell">
                  {r.date}
                </span>
              </td>

              <td>
                <span className="pkres-cell">
                  {r.time}
                </span>
              </td>

              <td>
                <span className="pkres-cell-sub">
                  {r.duration}
                </span>
              </td>

              <td>
                <span className="pkres-amount">
                  {r.amount}
                </span>
              </td>

              <td>

                <span
                  className={`pkres-status-pill ${r.status}`}
                >
                  {STATUS_LABEL[r.status] ||
                    r.status}
                </span>

              </td>

              <td>

                <button
                  className="pkres-btn-view"
                  onClick={() =>
                    onView(r)
                  }
                >
                  {Icon.eye}
                  View
                </button>

              </td>

            </tr>

          ))}

          {rows.length === 0 && (

            <tr>

              <td colSpan={10}>

                <div className="pkres-empty">
                  No reservations match
                  this filter.
                </div>

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

/* =========================================================
   DETAILS MODAL
========================================================= */

function ReservationModal({
  reservation,
  loading,
  onClose,
}) {
  if (!reservation) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >

      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "650px",
          borderRadius: "14px",
          padding: "25px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,
              }}
            >
              Reservation Details
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#777",
              }}
            >
              {reservation.code}
            </p>

          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background:
                "transparent",
              cursor: "pointer",
              width: "35px",
              height: "35px",
            }}
          >
            {Icon.close}
          </button>

        </div>

        {loading ? (

          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading reservation...
          </div>

        ) : (

          <div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "15px",
              }}
            >

              <Detail
                label="Customer"
                value={
                  reservation.customer
                }
              />

              <Detail
                label="Email"
                value={
                  reservation.email
                }
              />

              <Detail
                label="Location"
                value={
                  reservation.location
                }
              />

              <Detail
                label="Space"
                value={
                  reservation.space
                }
              />

              <Detail
                label="Date"
                value={
                  reservation.date
                }
              />

              <Detail
                label="Time"
                value={
                  reservation.time
                }
              />

              <Detail
                label="Duration"
                value={
                  reservation.duration
                }
              />

              <Detail
                label="Amount"
                value={
                  reservation.amount
                }
              />

              <Detail
                label="Status"
                value={
                  STATUS_LABEL[
                    reservation.status
                  ] ||
                  reservation.status
                }
              />

            </div>

            <details
              style={{
                marginTop: "20px",
              }}
            >

              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                API Response
              </summary>

              <pre
                style={{
                  marginTop: "10px",
                  background: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "8px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {JSON.stringify(
                  reservation.raw,
                  null,
                  2
                )}
              </pre>

            </details>

          </div>

        )}

      </div>

    </div>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: "13px",
        borderRadius: "8px",
        background: "#f8f8f8",
      }}
    >

      <div
        style={{
          fontSize: "12px",
          color: "#777",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 600,
        }}
      >
        {value || "-"}
      </div>

    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Reservations({
  onNavigate,
}) {
  const [activeTab, setActiveTab] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [reservations, setReservations] =
    useState([]);

  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [pageSize] =
    useState(20);

  const [totalCount, setTotalCount] =
    useState(0);

  /* =======================================================
     LOAD OWNER RESERVATIONS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadReservations() {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          pageSize,
        };

        /*
         * Search is sent to backend.
         */

        if (search.trim()) {
          params.search =
            search.trim();
        }

        /*
         * Status is sent to backend
         * when a specific tab is selected.
         */

        if (
          activeTab !== "all"
        ) {
          params.status =
            activeTab;
        }

        const response =
          await reservationsApi.getOwnerReservations(
            params
          );

        console.log(
          "Reservations API response:",
          response
        );

        if (cancelled) {
          return;
        }

        const data =
          extractResponseData(
            response
          );

        const items =
          extractItems(data);

        const normalized =
          items.map(
            normalizeReservation
          );

        setReservations(
          normalized
        );

        /*
         * Try to read summary from
         * different possible backend shapes.
         */

        setSummary(
          data?.summary ||
            data?.counts ||
            data?.statistics ||
            null
        );

        setTotalCount(
          data?.totalCount ??
            data?.total ??
            normalized.length
        );
      } catch (err) {
        console.error(
          "Reservations API error:",
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to load reservations.";

        setError(
          typeof message === "string"
            ? message
            : "Failed to load reservations."
        );

        setReservations([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    pageSize,
    activeTab,
    search,
  ]);

  /* =======================================================
     LOCAL FILTER
  ======================================================= */

  const filteredRows = useMemo(() => {
    const q =
      search.trim().toLowerCase();

    return reservations.filter(
      (reservation) => {
        const matchesSearch =
          !q ||
          reservation.customer
            .toLowerCase()
            .includes(q) ||
          reservation.code
            .toLowerCase()
            .includes(q) ||
          reservation.location
            .toLowerCase()
            .includes(q) ||
          reservation.space
            .toLowerCase()
            .includes(q);

        const matchesTab =
          activeTab === "all" ||
          reservation.status ===
            activeTab;

        return (
          matchesSearch &&
          matchesTab
        );
      }
    );
  }, [
    reservations,
    search,
    activeTab,
  ]);

  /* =======================================================
     VIEW RESERVATION
  ======================================================= */

  const handleView = async (
    reservation
  ) => {
    setSelectedReservation(
      reservation
    );

    setDetailsLoading(true);

    try {
      const response =
        await reservationsApi.getOwnerReservationById(
          reservation.id
        );

      const data =
        extractResponseData(
          response
        );

      const detailed =
        normalizeReservation(
          data,
          0
        );

      setSelectedReservation(
        detailed
      );
    } catch (err) {
      console.error(
        "Reservation details error:",
        err
      );

      /*
       * Keep the row data if the
       * details endpoint fails.
       */
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =======================================================
     PAGE CONTROLS
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount / pageSize
    )
  );

  return (
    <div className="pkres">

      <div className="pkres-app">

        <Sidebar
          active="reservations"
          onNavigate={onNavigate}
          showFooter
        />

        <main>

          <TopHeader />

          <div className="pkres-main">

            <PageHead
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              total={
                totalCount ||
                reservations.length
              }
            />

            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "14px 18px",
                  background:
                    "#fff1f1",
                  border:
                    "1px solid #ffb3b3",
                  color: "#c62828",
                  borderRadius: "8px",
                }}
              >
                {error}
              </div>
            )}

            {/* STATS */}

            <StatsRow
              rows={reservations}
              summary={summary}
            />

            {/* TABLE CARD */}

            <div className="pkres-table-card">

              <Tabs
                active={activeTab}
                onChange={(tab) => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                rows={reservations}
              />

              {/* LOADING */}

              {loading ? (

                <div
                  style={{
                    padding: "60px",
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#666",
                  }}
                >
                  Loading reservations...
                </div>

              ) : (

                <ReservationsTable
                  rows={
                    filteredRows
                  }
                  onView={
                    handleView
                  }
                />

              )}

              {/* PAGINATION */}

              {!loading &&
                totalCount >
                  pageSize && (

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    gap: "15px",
                    padding:
                      "20px",
                  }}
                >

                  <button
                    disabled={
                      page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (prev) =>
                          Math.max(
                            1,
                            prev - 1
                          )
                      )
                    }
                    style={{
                      padding:
                        "8px 15px",
                      cursor:
                        page <= 1
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of{" "}
                    {totalPages}
                  </span>

                  <button
                    disabled={
                      page >=
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (prev) =>
                          Math.min(
                            totalPages,
                            prev + 1
                          )
                      )
                    }
                    style={{
                      padding:
                        "8px 15px",
                      cursor:
                        page >=
                        totalPages
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Next
                  </button>

                </div>

              )}

            </div>

          </div>

        </main>

      </div>

      {/* DETAILS MODAL */}

      <ReservationModal
        reservation={
          selectedReservation
        }
        loading={
          detailsLoading
        }
        onClose={() =>
          setSelectedReservation(
            null
          )
        }
      />

    </div>
  );
}