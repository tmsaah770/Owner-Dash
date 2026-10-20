import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import EditPricingModal from "./Editpricingmodal";
import pricingApi from "../api/pricingApi";

/* ---------------- Icons ---------------- */

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

  square: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="2"
      />
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

  bolt: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  ),

  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6l8-3z" />
    </svg>
  ),

  pencil: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),

  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v5h5" />
      <path d="M12 8v5l3 2" />
    </svg>
  ),
};

/* ---------------- Space Types ---------------- */

const SPACE_TYPES = [
  {
    key: "Standard",
    label: "Standard",
    icon: Icon.square,
    iconClass: "pkpr-icon-blue",
  },

  {
    key: "Compact",
    label: "Compact",
    icon: Icon.check,
    iconClass: "pkpr-icon-green",
  },

  {
    key: "EV Charging",
    label: "EV Charging",
    icon: Icon.bolt,
    iconClass: "pkpr-icon-green",
  },

  {
    key: "Accessible",
    label: "Accessible",
    icon: Icon.shield,
    iconClass: "pkpr-icon-purple",
  },
];

/* ---------------- Helpers ---------------- */

const fmt = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "$0.00";
  }

  return `$${number.toFixed(2)}`;
};

/* ---------------- Top Header ---------------- */

function TopHeader() {
  return (
    <div className="pkpr-topheader">
      <div className="pkpr-search-box">
        {Icon.search}

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="pkpr-header-right">
        <button className="pkpr-bell">
          {Icon.bell}
          <span className="pkpr-dot" />
        </button>

        <div className="pkpr-user-chip">
          <div className="pkpr-avatar">AA</div>

          <div className="pkpr-who">
            <div className="pkpr-name">
              Ahmed Al-Rashid
            </div>

            <div className="pkpr-role">
              Parking Owner
            </div>
          </div>

          {Icon.chevronDown}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Location Tabs ---------------- */

function LocationTabs({
  locations,
  activeLocation,
  onChange,
}) {
  return (
    <div className="pkpr-tabs">
      {locations.map((location) => (
        <button
          key={location.parkingId}
          className={`pkpr-tab${
            location.parkingId ===
            activeLocation?.parkingId
              ? " active"
              : ""
          }`}
          onClick={() => onChange(location)}
        >
          {location.parkingName}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Pricing Card ---------------- */

function PricingCard({
  type,
  rates,
  onEdit,
}) {
  const safeRates = rates || {
    hourlyRate: 0,
    dailyRate: 0,
    weeklyRate: 0,
  };

  return (
    <div className="pkpr-card">
      <div className="pkpr-card-top">
        <div className="pkpr-card-title">
          <div
            className={`pkpr-type-icon ${type.iconClass}`}
          >
            {type.icon}
          </div>

          <div>
            <h3>{type.label}</h3>

            <div className="pkpr-type-sub">
              Space Type
            </div>
          </div>
        </div>

        <button
          className="pkpr-btn-edit"
          onClick={onEdit}
        >
          {Icon.pencil}
          Edit
        </button>
      </div>

      <div className="pkpr-rate-row">
        <span className="pkpr-rate-label">
          Hourly
        </span>

        <span>
          <span className="pkpr-rate-value">
            {fmt(safeRates.hourlyRate)}
          </span>

          <span className="pkpr-rate-unit">
            / hour
          </span>
        </span>
      </div>

      <div className="pkpr-rate-row">
        <span className="pkpr-rate-label">
          Daily
        </span>

        <span>
          <span className="pkpr-rate-value">
            {fmt(safeRates.dailyRate)}
          </span>

          <span className="pkpr-rate-unit">
            / day
          </span>
        </span>
      </div>

      <div className="pkpr-rate-row">
        <span className="pkpr-rate-label">
          Weekly
        </span>

        <span>
          <span className="pkpr-rate-value">
            {fmt(safeRates.weeklyRate)}
          </span>

          <span className="pkpr-rate-unit">
            / week
          </span>
        </span>
      </div>
    </div>
  );
}

/* ---------------- Pricing Tips ---------------- */

function PricingTips() {
  return (
    <div className="pkpr-tips">
      <div className="pkpr-tips-icon">
        {Icon.clock}
      </div>

      <div className="pkpr-tips-body">
        <h4>Pricing Tips</h4>

        <p>
          Offer daily and weekly discounts to
          encourage longer stays and improve
          revenue predictability.
          <br />
          EV charging spaces command a 20–30%
          premium — reflect that in your rates.
          <br />
          Review competitor rates quarterly to
          stay competitive in your local market.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */

export default function Pricing({
  onNavigate,
}) {
  const [locations, setLocations] =
    useState([]);

  const [activeLocation, setActiveLocation] =
    useState(null);

  const [rates, setRates] = useState([]);

  const [loadingLocations, setLoadingLocations] =
    useState(true);

  const [loadingRates, setLoadingRates] =
    useState(false);

  const [error, setError] = useState("");

  const [editingType, setEditingType] =
    useState(null);

  /* ---------------- Load Locations ---------------- */

  useEffect(() => {
    const controller = new AbortController();

    async function loadLocations() {
      try {
        setLoadingLocations(true);
        setError("");

        const response =
          await pricingApi.getLocations(
            controller.signal
          );

        /*
          Expected:

          {
            isSuccess: true,
            message: "...",
            data: [
              {
                parkingId: "...",
                parkingName: "..."
              }
            ]
          }
        */

        const locationData =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : [];

        setLocations(locationData);

        if (locationData.length > 0) {
          setActiveLocation(
            locationData[0]
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            "Failed to load pricing locations:",
            err
          );

          setError(
            `Couldn't load pricing locations: ${err.message}`
          );
        }
      } finally {
        setLoadingLocations(false);
      }
    }

    loadLocations();

    return () => {
      controller.abort();
    };
  }, []);

  /* ---------------- Load Pricing ---------------- */

  useEffect(() => {
    if (!activeLocation?.parkingId) {
      setRates([]);
      return;
    }

    const controller = new AbortController();

    async function loadPricing() {
      try {
        setLoadingRates(true);
        setError("");

        const response =
          await pricingApi.getParkingPricing(
            activeLocation.parkingId,
            controller.signal
          );

        /*
          Expected:

          {
            isSuccess: true,
            message: "OK",
            data: {
              parkingId: "...",
              parkingName: "...",
              rates: [
                {
                  pricingId: "...",
                  spaceType: "Standard",
                  hourlyRate: 0,
                  dailyRate: 0,
                  weeklyRate: 0,
                  isConfigured: false,
                  updatedAt: "..."
                }
              ]
            }
          }
        */

        const pricingData =
          response?.data || response;

        const receivedRates =
          Array.isArray(pricingData?.rates)
            ? pricingData.rates
            : [];

        setRates(receivedRates);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            "Failed to load pricing:",
            err
          );

          setError(
            `Couldn't load pricing: ${err.message}`
          );
        }
      } finally {
        setLoadingRates(false);
      }
    }

    loadPricing();

    return () => {
      controller.abort();
    };
  }, [activeLocation]);

  /* ---------------- Find Rate ---------------- */

  const getRateForType = (typeKey) => {
    return (
      rates.find(
        (rate) =>
          String(rate.spaceType)
            .toLowerCase() ===
          String(typeKey).toLowerCase()
      ) || {
        pricingId: null,
        spaceType: typeKey,
        hourlyRate: 0,
        dailyRate: 0,
        weeklyRate: 0,
        isConfigured: false,
        updatedAt: null,
      }
    );
  };

  /* ---------------- Edit ---------------- */

  const editingRate = editingType
    ? getRateForType(editingType)
    : null;

  const editingTypeInfo =
    SPACE_TYPES.find(
      (type) => type.key === editingType
    );

  /* ---------------- Save ---------------- */

  const saveRates = async (newRates) => {
    if (!activeLocation?.parkingId) {
      return;
    }

    try {
      setError("");

      /*
        PUT body based on the fields provided
        by the Backend response.

        {
          spaceType,
          hourlyRate,
          dailyRate,
          weeklyRate
        }
      */

      const payload = {
        spaceType: editingType,

        hourlyRate: Number(
          newRates.hourlyRate
        ),

        dailyRate: Number(
          newRates.dailyRate
        ),

        weeklyRate: Number(
          newRates.weeklyRate
        ),
      };

      await pricingApi.updateSpaceType(
        activeLocation.parkingId,
        payload
      );

      /*
        Update the UI immediately.
      */

      setRates((previousRates) => {
        const exists = previousRates.some(
          (rate) =>
            String(rate.spaceType)
              .toLowerCase() ===
            String(editingType).toLowerCase()
        );

        if (exists) {
          return previousRates.map((rate) =>
            String(rate.spaceType)
              .toLowerCase() ===
            String(editingType).toLowerCase()
              ? {
                  ...rate,
                  ...payload,
                }
              : rate
          );
        }

        return [
          ...previousRates,
          {
            pricingId: null,
            ...payload,
            isConfigured: true,
            updatedAt:
              new Date().toISOString(),
          },
        ];
      });

      setEditingType(null);
    } catch (err) {
      console.error(
        "Failed to save pricing:",
        err
      );

      setError(
        `Couldn't save pricing: ${err.message}`
      );
    }
  };

  /* ---------------- Loading Locations ---------------- */

  if (loadingLocations) {
    return (
      <div className="pkpr">
        <div className="pkpr-app">
          <Sidebar
            active="pricing"
            onNavigate={onNavigate}
            showFooter
          />

          <main>
            <TopHeader />

            <div className="pkpr-main">
              <div className="pkpr-page-head">
                <h1>
                  Pricing Management
                </h1>

                <div className="pkpr-sub">
                  Set hourly, daily, and weekly
                  rates per space type and
                  location
                </div>
              </div>

              <div className="pkpr-loading">
                Loading locations...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ---------------- Main UI ---------------- */

  return (
    <div className="pkpr">
      <div className="pkpr-app">
        <Sidebar
          active="pricing"
          onNavigate={onNavigate}
          showFooter
        />

        <main>
          <TopHeader />

          <div className="pkpr-main">
            <div className="pkpr-page-head">
              <h1>
                Pricing Management
              </h1>

              <div className="pkpr-sub">
                Set hourly, daily, and weekly
                rates per space type and
                location
              </div>
            </div>

            {/* Error */}

            {error && (
              <div
                className="pkpr-error"
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  color: "#c62828",
                  border:
                    "1px solid #f0b7b7",
                }}
              >
                {error}
              </div>
            )}

            {/* No Locations */}

            {locations.length === 0 ? (
              <div className="pkpr-empty">
                <h3>
                  No parking locations found
                </h3>

                <p>
                  Add a parking location first
                  to manage its pricing.
                </p>
              </div>
            ) : (
              <>
                {/* Location Tabs */}

                <LocationTabs
                  locations={locations}
                  activeLocation={
                    activeLocation
                  }
                  onChange={
                    setActiveLocation
                  }
                />

                {/* Loading Pricing */}

                {loadingRates ? (
                  <div className="pkpr-loading">
                    Loading pricing...
                  </div>
                ) : (
                  <>
                    {/* Pricing Cards */}

                    <div className="pkpr-grid">
                      {SPACE_TYPES.map(
                        (type) => (
                          <PricingCard
                            key={type.key}
                            type={type}
                            rates={getRateForType(
                              type.key
                            )}
                            onEdit={() =>
                              setEditingType(
                                type.key
                              )
                            }
                          />
                        )
                      )}
                    </div>

                    <PricingTips />
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}

      <EditPricingModal
        key={editingType}
        isOpen={
          editingType !== null
        }
        spaceType={
          editingTypeInfo
            ? editingTypeInfo.label
            : ""
        }
        rates={
          editingRate
            ? {
                hourly:
                  editingRate.hourlyRate,
                daily:
                  editingRate.dailyRate,
                weekly:
                  editingRate.weeklyRate,
              }
            : null
        }
        onClose={() =>
          setEditingType(null)
        }
        onSave={saveRates}
      />
    </div>
  );
}