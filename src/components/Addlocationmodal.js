import { useState } from "react";


/**
 * "Add Parking Location" modal.
 * Controlled from the parent via `open` — render <AddLocationModal open={...} onClose={...} onSubmit={...} />
 * and it handles its own form state internally.
 */
export default function AddLocationModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    cityState: "",
    pricePerHour: "",
    totalSpaces: "",
    levels: "",
    notes: "",
  });

  if (!isOpen) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
    setForm({
      name: "",
      address: "",
      cityState: "",
      pricePerHour: "",
      totalSpaces: "",
      levels: "",
      notes: "",
    });
  };

  return (
    <div className="pkm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="pkm-modal" role="dialog" aria-modal="true" aria-labelledby="pkm-title">
        <div className="pkm-head">
          <div>
            <h2 id="pkm-title">Add Parking Location</h2>
            <p>New location will be visible to customers immediately after activation.</p>
          </div>
          <button className="pkm-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="pkm-form" onSubmit={handleSubmit}>
          <div className="pkm-field">
            <label htmlFor="pkm-name">Location Name</label>
            <input
              id="pkm-name"
              type="text"
              placeholder="e.g. Harbor View Garage"
              value={form.name}
              onChange={update("name")}
            />
          </div>

          <div className="pkm-field">
            <label htmlFor="pkm-address">Street Address</label>
            <input
              id="pkm-address"
              type="text"
              placeholder="e.g. 123 Main St"
              value={form.address}
              onChange={update("address")}
            />
          </div>

          <div className="pkm-row">
            <div className="pkm-field">
              <label htmlFor="pkm-city">City, State</label>
              <input
                id="pkm-city"
                type="text"
                placeholder="e.g. New York, NY"
                value={form.cityState}
                onChange={update("cityState")}
              />
            </div>
            <div className="pkm-field">
              <label htmlFor="pkm-price">Price per Hour ($)</label>
              <input
                id="pkm-price"
                type="number"
                step="0.01"
                placeholder="4.50"
                value={form.pricePerHour}
                onChange={update("pricePerHour")}
              />
            </div>
          </div>

          <div className="pkm-row">
            <div className="pkm-field">
              <label htmlFor="pkm-total">Total Spaces</label>
              <input
                id="pkm-total"
                type="number"
                placeholder="50"
                value={form.totalSpaces}
                onChange={update("totalSpaces")}
              />
            </div>
            <div className="pkm-field">
              <label htmlFor="pkm-levels">Levels / Floors</label>
              <input
                id="pkm-levels"
                type="number"
                placeholder="3"
                value={form.levels}
                onChange={update("levels")}
              />
            </div>
          </div>

          <div className="pkm-field">
            <label htmlFor="pkm-notes">Notes (optional)</label>
            <input
              id="pkm-notes"
              type="text"
              placeholder="Any additional details..."
              value={form.notes}
              onChange={update("notes")}
            />
          </div>

          <div className="pkm-actions">
            <button type="submit" className="pkm-btn-primary">Add Location</button>
            <button type="button" className="pkm-btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}