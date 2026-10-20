import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import AddSpaceModal from "./AddSpaceModal";

import parkingSpacesApi from "../api/parkingSpacesApi";

/* =========================================================
   Icons
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
      <circle
        cx="11"
        cy="11"
        r="7"
      />

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

  plus: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

  x: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  ),

  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />

      <path d="M3 9h18" />
      <path d="M8 3v3" />
      <path d="M16 3v3" />
    </svg>
  ),

  wrench: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L15 12l-2-2 2.7-2.7Z" />
    </svg>
  ),

  pencil: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),

  trash: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />

      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />

      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />

      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  ),

  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  ),
};

/* =========================================================
   Status Helpers
========================================================= */

const STATUS_LABEL = {
  Available: "Available",
  Occupied: "Occupied",
  Reserved: "Reserved",
  Maintenance: "Maintenance",
};

const STATUS_CLASS = {
  Available: "available",
  Occupied: "occupied",
  Reserved: "reserved",
  Maintenance: "maintenance",
};

/* =========================================================
   Top Header
========================================================= */

function TopHeader() {
  return (
    <div className="pksm-topheader">
      <div className="pksm-search-box">
        {Icon.search}

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="pksm-header-right">
        <button className="pksm-bell">
          {Icon.bell}

          <span className="pksm-dot" />
        </button>

        <div className="pksm-user-chip">
          <div className="pksm-avatar">
            AA
          </div>

          <div className="pksm-who">
            <div className="pksm-name">
              Ahmed Al-Rashid
            </div>

            <div className="pksm-role">
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
   Page Header
========================================================= */

function PageHead({
  onAddClick,
  search,
  setSearch,
}) {
  return (
    <div className="pksm-page-head">
      <div>
        <h1>Parking Spaces</h1>

        <div className="pksm-sub">
          Manage parking spaces across
          your locations
        </div>
      </div>

      <div className="pksm-head-actions">
        <div className="pksm-search-box">
          {Icon.search}

          <input
            type="text"
            placeholder="Search spaces..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <button
          className="pksm-btn-add"
          onClick={onAddClick}
        >
          {Icon.plus}

          Add Space
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   Stats Row
========================================================= */

function StatsRow({ summary }) {
  const cards = [
    {
      icon: Icon.check,
      iconClass:
        "pksm-icon-green",
      value:
        summary?.available ?? 0,
      label: "Available",
    },

    {
      icon: Icon.x,
      iconClass:
        "pksm-icon-red",
      value:
        summary?.occupied ?? 0,
      label: "Occupied",
    },

    {
      icon: Icon.calendar,
      iconClass:
        "pksm-icon-blue",
      value:
        summary?.reserved ?? 0,
      label: "Reserved",
    },

    {
      icon: Icon.wrench,
      iconClass:
        "pksm-icon-yellow",
      value:
        summary?.maintenance ?? 0,
      label: "Maintenance",
    },
  ];

  return (
    <div className="pksm-stats-grid">
      {cards.map((card) => (
        <div
          className="pksm-stat-card"
          key={card.label}
        >
          <div
            className={`pksm-stat-icon ${card.iconClass}`}
          >
            {card.icon}
          </div>

          <div className="pksm-value">
            {card.value}
          </div>

          <div className="pksm-label">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   Select Field
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="pksm-filter">
      <label>{label}</label>

      <div className="pksm-select-wrap">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {Icon.chevronDown}
      </div>
    </div>
  );
}

/* =========================================================
   Filters
========================================================= */

function Filters({
  location,
  setLocation,
  status,
  setStatus,
  type,
  setType,
  locations,
}) {
  const locationOptions = [
    {
      value: "all",
      label: "All Locations",
    },

    ...locations.map(
      (locationItem) => ({
        value:
          locationItem.parkingId,
        label:
          locationItem.name,
      })
    ),
  ];

  const statusOptions = [
    {
      value: "all",
      label: "All Statuses",
    },

    {
      value: "Available",
      label: "Available",
    },

    {
      value: "Occupied",
      label: "Occupied",
    },

    {
      value: "Reserved",
      label: "Reserved",
    },

    {
      value: "Maintenance",
      label: "Maintenance",
    },
  ];

  const typeOptions = [
    {
      value: "all",
      label: "All Types",
    },

    {
      value: "Standard",
      label: "Standard",
    },

    {
      value: "Compact",
      label: "Compact",
    },

    {
      value: "Accessible",
      label: "Accessible",
    },

    {
      value: "EV Charging",
      label: "EV Charging",
    },
  ];

  return (
    <div className="pksm-filters">
      <SelectField
        label="Location"
        value={location}
        onChange={setLocation}
        options={locationOptions}
      />

      <SelectField
        label="Status"
        value={status}
        onChange={setStatus}
        options={statusOptions}
      />

      <SelectField
        label="Type"
        value={type}
        onChange={setType}
        options={typeOptions}
      />

      <div />
    </div>
  );
}

/* =========================================================
   Spaces Table
========================================================= */

function SpacesTable({
  spaces,
  onEdit,
  onDelete,
}) {
  return (
    <div className="pksm-table-card">
      <div className="pksm-table-scroll">
        <table className="pksm-table">
          <thead>
            <tr>
              <th>Space</th>
              <th>Location</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Price / hr</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {spaces.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  No parking spaces
                  found.
                </td>
              </tr>
            ) : (
              spaces.map((space) => {
                const status =
                  space.status ||
                  "";

                const statusClass =
                  STATUS_CLASS[
                    status
                  ] ||
                  String(status)
                    .toLowerCase();

                const statusLabel =
                  space.displayStatus ||
                  STATUS_LABEL[
                    status
                  ] ||
                  status;

                return (
                  <tr
                    key={
                      space.spaceId
                    }
                  >
                    {/* Space */}

                    <td className="pksm-space-id">
                      {space.spotNumber ||
                        "-"}
                    </td>

                    {/* Location */}

                    <td className="pksm-cell-main">
                      {space.parkingName ||
                        "-"}
                    </td>

                    {/* Floor */}

                    <td className="pksm-cell-main">
                      {space.level ||
                        "-"}
                    </td>

                    {/* Type */}

                    <td className="pksm-cell-main">
                      {space.displayType ||
                        space.spaceType ||
                        "-"}
                    </td>

                    {/* Price */}

                    <td className="pksm-price">
                      $
                      {Number(
                        space.baseHourlyRate ||
                          0
                      ).toFixed(2)}
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={`pksm-status-pill ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="pksm-actions-cell">
                        <button
                          className="pksm-action-btn edit"
                          onClick={() =>
                            onEdit(
                              space
                            )
                          }
                        >
                          {Icon.pencil}

                          Edit
                        </button>

                        <button
                          className="pksm-action-btn delete"
                          onClick={() =>
                            onDelete(
                              space
                            )
                          }
                        >
                          {Icon.trash}

                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   Edit Space Modal
========================================================= */

function EditSpaceModal({
  space,
  locations,
  onClose,
  onSave,
  loading,
}) {
  const [form, setForm] =
    useState(null);

  useEffect(() => {
    if (!space) {
      setForm(null);
      return;
    }

    setForm({
      parkingId:
        space.parkingId || "",

      spotNumber:
        space.spotNumber || "",

      level:
        space.level || "",

      spaceType:
        space.spaceType ||
        "Standard",

      baseHourlyRate:
        space.baseHourlyRate ??
        0,

      isActive:
        space.isActive !== false,
    });
  }, [space]);

  if (!space || !form) {
    return null;
  }

  const updateField = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "14px",
          padding: "24px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom:
              "22px",
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            Edit Parking Space
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background:
                "transparent",
              cursor: "pointer",
              width: "34px",
              height: "34px",
            }}
          >
            {Icon.close}
          </button>
        </div>

        {/* Location */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Location
        </label>

        <select
          value={
            form.parkingId
          }
          onChange={(e) =>
            updateField(
              "parkingId",
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "11px",
            marginBottom:
              "15px",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
          }}
        >
          <option value="">
            Select location
          </option>

          {locations.map(
            (location) => (
              <option
                key={
                  location.parkingId
                }
                value={
                  location.parkingId
                }
              >
                {location.name}
              </option>
            )
          )}
        </select>

        {/* Spot Number */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Spot Number
        </label>

        <input
          value={
            form.spotNumber
          }
          onChange={(e) =>
            updateField(
              "spotNumber",
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "11px",
            marginBottom:
              "15px",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
            boxSizing:
              "border-box",
          }}
        />

        {/* Level */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Floor / Level
        </label>

        <input
          value={
            form.level
          }
          onChange={(e) =>
            updateField(
              "level",
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "11px",
            marginBottom:
              "15px",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
            boxSizing:
              "border-box",
          }}
        />

        {/* Type */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Space Type
        </label>

        <select
          value={
            form.spaceType
          }
          onChange={(e) =>
            updateField(
              "spaceType",
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "11px",
            marginBottom:
              "15px",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
          }}
        >
          <option value="Standard">
            Standard
          </option>

          <option value="Compact">
            Compact
          </option>

          <option value="Accessible">
            Accessible
          </option>

          <option value="EV Charging">
            EV Charging
          </option>
        </select>

        {/* Price */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Base Hourly Rate
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={
            form.baseHourlyRate
          }
          onChange={(e) =>
            updateField(
              "baseHourlyRate",
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "11px",
            marginBottom:
              "15px",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
            boxSizing:
              "border-box",
          }}
        />

        {/* Active */}

        <label
          style={{
            display: "flex",
            gap: "8px",
            alignItems:
              "center",
            marginBottom:
              "20px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={
              form.isActive
            }
            onChange={(e) =>
              updateField(
                "isActive",
                e.target.checked
              )
            }
          />

          Active / Bookable
        </label>

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding:
                "10px 18px",
              borderRadius:
                "8px",
              border:
                "1px solid #ddd",
              background:
                "#fff",
              cursor:
                "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave(form)
            }
            disabled={loading}
            style={{
              padding:
                "10px 18px",
              borderRadius:
                "8px",
              border: "none",
              background:
                "#2d5be3",
              color: "#fff",
              cursor:
                "pointer",
            }}
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function SpaceManagement({
  onNavigate,
}) {
  /* =======================================================
     State
  ======================================================= */

  const [
    managementData,
    setManagementData,
  ] = useState({
    summary: {
      totalSpaces: 0,
      locations: 0,
      available: 0,
      occupied: 0,
      reserved: 0,
      maintenance: 0,
      occupancyPercentage: 0,
    },

    locations: [],

    items: [],

    page: 0,

    pageSize: 0,

    totalCount: 0,

    totalPages: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState("all");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("all");

  const [
    selectedType,
    setSelectedType,
  ] = useState("all");

  const [
    isAddOpen,
    setIsAddOpen,
  ] = useState(false);

  const [
    editingSpace,
    setEditingSpace,
  ] = useState(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  /* =======================================================
     Load Management Data
  ======================================================= */

  const loadManagement =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await parkingSpacesApi.getManagement();

        /*
          Expected:

          {
            isSuccess: true,
            message: "OK",
            data: {
              summary: {...},
              locations: [...],
              items: [...],
              page: 0,
              pageSize: 0,
              totalCount: 0,
              totalPages: 0
            }
          }
        */

        const data =
          response?.data ||
          response;

        setManagementData({
          summary:
            data?.summary || {
              totalSpaces: 0,
              locations: 0,
              available: 0,
              occupied: 0,
              reserved: 0,
              maintenance: 0,
              occupancyPercentage: 0,
            },

          locations:
            Array.isArray(
              data?.locations
            )
              ? data.locations
              : [],

          items:
            Array.isArray(
              data?.items
            )
              ? data.items
              : [],

          page:
            data?.page ?? 0,

          pageSize:
            data?.pageSize ?? 0,

          totalCount:
            data?.totalCount ?? 0,

          totalPages:
            data?.totalPages ?? 0,
        });
      } catch (err) {
        console.error(
          "Failed to load parking spaces:",
          err
        );

        if (
          err.name !==
          "AbortError"
        ) {
          setError(
            `Couldn't load parking spaces: ${err.message}`
          );
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadManagement();
  }, []);

  /* =======================================================
     Filter Spaces
  ======================================================= */

  const filteredSpaces =
    useMemo(() => {
      let result =
        managementData.items ||
        [];

      /* Search */

      const searchValue =
        search
          .trim()
          .toLowerCase();

      if (searchValue) {
        result =
          result.filter(
            (space) => {
              return (
                String(
                  space.spotNumber ||
                    ""
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  ) ||

                String(
                  space.parkingName ||
                    ""
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  ) ||

                String(
                  space.level ||
                    ""
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  ) ||

                String(
                  space.spaceType ||
                    ""
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )
              );
            }
          );
      }

      /* Location */

      if (
        selectedLocation !==
        "all"
      ) {
        result =
          result.filter(
            (space) =>
              space.parkingId ===
              selectedLocation
          );
      }

      /* Status */

      if (
        selectedStatus !==
        "all"
      ) {
        result =
          result.filter(
            (space) =>
              String(
                space.status
              ).toLowerCase() ===
              selectedStatus.toLowerCase()
          );
      }

      /* Type */

      if (
        selectedType !==
        "all"
      ) {
        result =
          result.filter(
            (space) =>
              String(
                space.spaceType
              ).toLowerCase() ===
              selectedType.toLowerCase()
          );
      }

      return result;
    }, [
      managementData.items,
      search,
      selectedLocation,
      selectedStatus,
      selectedType,
    ]);

  /* =======================================================
     Create Space
  ======================================================= */

  const handleCreate =
    async (form) => {
      try {
        setSaving(true);
        setError("");

        /*
          Normalize AddSpaceModal fields.

          We support common names so the
          existing modal has a better chance
          of working without modification.
        */

        const payload = {
          parkingId:
            form.parkingId ||
            form.locationId ||
            form.location,

          spotNumber:
            form.spotNumber ||
            form.space ||
            form.spaceNumber,

          level:
            form.level ||
            form.floor,

          spaceType:
            form.spaceType ||
            form.type ||
            "Standard",

          baseHourlyRate:
            Number(
              form.baseHourlyRate ??
                form.price ??
                form.hourlyRate ??
                0
            ),

          isActive:
            form.isActive !==
            undefined
              ? form.isActive
              : true,
        };

        console.log(
          "Creating parking space:",
          payload
        );

        await parkingSpacesApi.create(
          payload
        );

        setIsAddOpen(false);

        await loadManagement();
      } catch (err) {
        console.error(
          "Failed to create parking space:",
          err
        );

        setError(
          `Couldn't create parking space: ${err.message}`
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     Edit Space
  ======================================================= */

  const handleEdit =
    async (form) => {
      if (
        !editingSpace?.spaceId
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        const payload = {
          parkingId:
            form.parkingId,

          spotNumber:
            form.spotNumber,

          level:
            form.level,

          spaceType:
            form.spaceType,

          baseHourlyRate:
            Number(
              form.baseHourlyRate
            ),

          isActive:
            form.isActive,
        };

        console.log(
          "Updating parking space:",
          editingSpace.spaceId,
          payload
        );

        await parkingSpacesApi.update(
          editingSpace.spaceId,
          payload
        );

        setEditingSpace(null);

        await loadManagement();
      } catch (err) {
        console.error(
          "Failed to update parking space:",
          err
        );

        setError(
          `Couldn't update parking space: ${err.message}`
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     Delete Space
  ======================================================= */

  const handleDelete =
    async (space) => {
      if (
        !space?.spaceId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete space "${space.spotNumber}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await parkingSpacesApi.remove(
          space.spaceId
        );

        await loadManagement();
      } catch (err) {
        console.error(
          "Failed to delete parking space:",
          err
        );

        setError(
          `Couldn't delete parking space: ${err.message}`
        );
      }
    };

  /* =======================================================
     Loading
  ======================================================= */

  if (loading) {
    return (
      <div className="pksm">
        <div className="pksm-app">
          <Sidebar
            active="space-management"
            onNavigate={
              onNavigate
            }
            showFooter
          />

          <main>
            <TopHeader />

            <div className="pksm-main">
              <div className="pksm-page-head">
                <div>
                  <h1>
                    Parking Spaces
                  </h1>

                  <div className="pksm-sub">
                    Manage parking
                    spaces across
                    your locations
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding:
                    "50px",
                  textAlign:
                    "center",
                  fontSize:
                    "18px",
                }}
              >
                Loading parking
                spaces...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* =======================================================
     Main UI
  ======================================================= */

  return (
    <div className="pksm">
      <div className="pksm-app">
        <Sidebar
          active="space-management"
          onNavigate={
            onNavigate
          }
          showFooter
        />

        <main>
          <TopHeader />

          <div className="pksm-main">

            {/* =========================================
                Page Header
            ========================================= */}

            <PageHead
              onAddClick={() =>
                setIsAddOpen(true)
              }
              search={search}
              setSearch={setSearch}
            />

            {/* =========================================
                Error
            ========================================= */}

            {error && (
              <div
                style={{
                  marginBottom:
                    "20px",
                  padding:
                    "13px 16px",
                  borderRadius:
                    "8px",
                  background:
                    "#fff1f1",
                  color:
                    "#c62828",
                  border:
                    "1px solid #efb5b5",
                }}
              >
                {error}
              </div>
            )}

            {/* =========================================
                Summary
            ========================================= */}

            <StatsRow
              summary={
                managementData.summary
              }
            />

            {/* =========================================
                Extra Summary Info
            ========================================= */}

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom:
                  "20px",
                flexWrap:
                  "wrap",
              }}
            >
              <div
                style={{
                  fontSize:
                    "14px",
                  color:
                    "#666",
                }}
              >
                Total Spaces:
                <strong
                  style={{
                    marginLeft:
                      "5px",
                    color:
                      "#222",
                  }}
                >
                  {
                    managementData
                      .summary
                      .totalSpaces
                  }
                </strong>
              </div>

              <div
                style={{
                  fontSize:
                    "14px",
                  color:
                    "#666",
                }}
              >
                Locations:
                <strong
                  style={{
                    marginLeft:
                      "5px",
                    color:
                      "#222",
                  }}
                >
                  {
                    managementData
                      .summary
                      .locations
                  }
                </strong>
              </div>

              <div
                style={{
                  fontSize:
                    "14px",
                  color:
                    "#666",
                }}
              >
                Occupancy:
                <strong
                  style={{
                    marginLeft:
                      "5px",
                    color:
                      "#222",
                  }}
                >
                  {Number(
                    managementData
                      .summary
                      .occupancyPercentage ||
                      0
                  ).toFixed(0)}
                  %
                </strong>
              </div>
            </div>

            {/* =========================================
                Filters
            ========================================= */}

            <Filters
              location={
                selectedLocation
              }
              setLocation={
                setSelectedLocation
              }
              status={
                selectedStatus
              }
              setStatus={
                setSelectedStatus
              }
              type={
                selectedType
              }
              setType={
                setSelectedType
              }
              locations={
                managementData.locations
              }
            />

            {/* =========================================
                Table
            ========================================= */}

            <SpacesTable
              spaces={
                filteredSpaces
              }
              onEdit={
                setEditingSpace
              }
              onDelete={
                handleDelete
              }
            />

            {/* =========================================
                Result Count
            ========================================= */}

            <div
              style={{
                marginTop:
                  "15px",
                fontSize:
                  "13px",
                color:
                  "#777",
              }}
            >
              Showing{" "}
              {
                filteredSpaces.length
              }{" "}
              of{" "}
              {
                managementData
                  .totalCount
              }{" "}
              spaces
            </div>
          </div>
        </main>
      </div>

      {/* =============================================
          Existing Add Space Modal
      ============================================= */}

      <AddSpaceModal
        isOpen={
          isAddOpen
        }
        onClose={() =>
          setIsAddOpen(
            false
          )
        }
        onSubmit={
          handleCreate
        }
      />

      {/* =============================================
          Edit Space Modal
      ============================================= */}

      <EditSpaceModal
        space={
          editingSpace
        }
        locations={
          managementData.locations
        }
        onClose={() =>
          setEditingSpace(
            null
          )
        }
        onSave={
          handleEdit
        }
        loading={
          saving
        }
      />
    </div>
  );
}