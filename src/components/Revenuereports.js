import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import reportsApi from "../api/reportsApi";

/* ---------------- Icons ---------------- */

const Icon = {
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

  download: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  ),

  revenue: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 3v18h18" />
      <path d="m7 16 4-5 3 3 6-8" />
    </svg>
  ),
};

/* ---------------- Header ---------------- */

function TopHeader() {
  return (
    <div className="pkpr-topheader">
      <div className="pkpr-search-box">
        {Icon.search}

        <input type="text" placeholder="Search..." />
      </div>

      <div className="pkpr-header-right">
        <button className="pkpr-bell">
          {Icon.bell}
          <span className="pkpr-dot" />
        </button>

        <div className="pkpr-user-chip">
          <div className="pkpr-avatar">AA</div>

          <div className="pkpr-who">
            <div className="pkpr-name">Ahmed Al-Rashid</div>
            <div className="pkpr-role">Parking Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function formatCurrency(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(number);
}

function getRevenueData(response) {
  /*
    The backend may return:

    {
      isSuccess: true,
      data: ...
    }

    So we safely extract data.
  */

  return response?.data?.data ?? response?.data ?? {};
}

/* ---------------- Main Reports Page ---------------- */

export default function Revenuereports({ onNavigate }) {
  const [revenueData, setRevenueData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);

  const [error, setError] = useState("");

  const [period, setPeriod] = useState("monthly");

  /* ---------------- Load Revenue ---------------- */

  const loadRevenue = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await reportsApi.getRevenue({
        period,
      });

      console.log("Revenue API response:", response);

      const data = getRevenueData(response);

      setRevenueData(data);
    } catch (err) {
      console.error("Revenue API error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to load revenue reports.";

      setError(
        typeof message === "string"
          ? message
          : "Failed to load revenue reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, [period]);

  /* ---------------- Export Revenue ---------------- */

  const handleExport = async () => {
    try {
      setExporting(true);
      setError("");

      const response = await reportsApi.exportRevenue({
        period,
      });

      /*
        The API returns a file/blob.
      */

      const blob = new Blob([response.data], {
        type:
          response.headers?.["content-type"] ||
          "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `revenue-report-${period}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export revenue error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to export revenue report.";

      setError(message);
    } finally {
      setExporting(false);
    }
  };

  /* ---------------- Extract Values ---------------- */

  const data = revenueData || {};

  /*
    These names are handled flexibly because
    the exact revenue response body was not included
    in the Swagger screenshot.
  */

  const totalRevenue =
    data.totalRevenue ??
    data.revenue ??
    data.total ??
    0;

  const dataPoints =
    data.dataPoints ??
    data.items ??
    data.records ??
    data.revenueData ??
    [];

  /* ---------------- Render ---------------- */

  return (
    <div className="pkpr">
      <div className="pkpr-app">

        <Sidebar
          active="revenue-reports"
          onNavigate={onNavigate}
          showFooter
        />

        <main>

          <TopHeader />

          <div className="pkpr-main">

            {/* Page Header */}

            <div className="pkpr-page-head">

              <div>
                <h1>Reports</h1>

                <div className="pkpr-sub">
                  View and export your revenue reports
                </div>
              </div>

              <button
                className="pkpr-btn-edit"
                onClick={handleExport}
                disabled={exporting}
              >
                {Icon.download}

                {exporting
                  ? "Exporting..."
                  : "Export Report"}
              </button>

            </div>

            {/* Error */}

            {error && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 18px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  border: "1px solid #ffb3b3",
                  color: "#c62828",
                }}
              >
                {error}
              </div>
            )}

            {/* Period */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
                marginBottom: "25px",
              }}
            >

              <button
                onClick={() => setPeriod("daily")}
                className={
                  period === "daily"
                    ? "pkpr-tab active"
                    : "pkpr-tab"
                }
              >
                Daily
              </button>

              <button
                onClick={() => setPeriod("weekly")}
                className={
                  period === "weekly"
                    ? "pkpr-tab active"
                    : "pkpr-tab"
                }
              >
                Weekly
              </button>

              <button
                onClick={() => setPeriod("monthly")}
                className={
                  period === "monthly"
                    ? "pkpr-tab active"
                    : "pkpr-tab"
                }
              >
                Monthly
              </button>

            </div>

            {/* Loading */}

            {loading ? (
              <div
                style={{
                  padding: "50px",
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                Loading revenue...
              </div>
            ) : (
              <>
                {/* Total Revenue Card */}

                <div
                  className="pkpr-card"
                  style={{
                    marginBottom: "25px",
                  }}
                >

                  <div className="pkpr-card-top">

                    <div className="pkpr-card-title">

                      <div
                        className="pkpr-type-icon pkpr-icon-green"
                      >
                        {Icon.revenue}
                      </div>

                      <div>
                        <h3>Total Revenue</h3>

                        <div className="pkpr-type-sub">
                          {period.charAt(0).toUpperCase() +
                            period.slice(1)}
                        </div>
                      </div>

                    </div>

                  </div>

                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginTop: "20px",
                    }}
                  >
                    {formatCurrency(totalRevenue)}
                  </div>

                </div>

                {/* Revenue Data */}

                <div className="pkpr-card">

                  <div className="pkpr-card-top">

                    <div className="pkpr-card-title">

                      <div
                        className="pkpr-type-icon pkpr-icon-blue"
                      >
                        {Icon.revenue}
                      </div>

                      <div>
                        <h3>Revenue Details</h3>

                        <div className="pkpr-type-sub">
                          Revenue breakdown
                        </div>
                      </div>

                    </div>

                  </div>

                  {Array.isArray(dataPoints) &&
                  dataPoints.length > 0 ? (
                    <div
                      style={{
                        marginTop: "20px",
                        overflowX: "auto",
                      }}
                    >

                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                        }}
                      >

                        <thead>

                          <tr>

                            <th
                              style={{
                                textAlign: "left",
                                padding: "14px",
                                borderBottom:
                                  "1px solid #ddd",
                              }}
                            >
                              Period
                            </th>

                            <th
                              style={{
                                textAlign: "right",
                                padding: "14px",
                                borderBottom:
                                  "1px solid #ddd",
                              }}
                            >
                              Revenue
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {dataPoints.map(
                            (item, index) => (
                              <tr key={index}>

                                <td
                                  style={{
                                    padding: "14px",
                                    borderBottom:
                                      "1px solid #eee",
                                  }}
                                >
                                  {item.label ??
                                    item.date ??
                                    item.period ??
                                    `Item ${index + 1}`}
                                </td>

                                <td
                                  style={{
                                    padding: "14px",
                                    textAlign: "right",
                                    borderBottom:
                                      "1px solid #eee",
                                    fontWeight: "600",
                                  }}
                                >
                                  {formatCurrency(
                                    item.revenue ??
                                      item.amount ??
                                      item.total ??
                                      0
                                  )}
                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "35px 10px",
                        textAlign: "center",
                        color: "#777",
                      }}
                    >
                      No revenue data available.
                    </div>
                  )}

                </div>
              </>
            )}

          </div>

        </main>

      </div>
    </div>
  );
}