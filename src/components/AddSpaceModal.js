import { useState } from "react";


const Icon = {
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};

const LOCATIONS = ["CityPark Central", "Marina Bay Lot", "Westfield Mall Deck", "North Deck Garage"];
const TYPES = ["Standard", "Compact", "Accessible", "EV Charging"];

/**
 * "Add Parking Space" modal.
 * Controlled from the parent via `isOpen` — render
 * <AddSpaceModal isOpen={...} onClose={...} onSubmit={...} /> and it
 * manages its own form state internally, resetting after a successful submit.
 */
export default function AddSpaceModal({ isOpen, onClose, onSubmit }) {
  const emptyForm = {
    location: LOCATIONS[0],
    spaceNumber: "",
    floor: "",
    type: TYPES[0],
    pricePerHour: "",
  };
  const [form, setForm] = useState(emptyForm);

  if (!isOpen) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
    setForm(emptyForm);
  };

  return (
    <div className="pkas-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="pkas-modal" role="dialog" aria-modal="true" aria-labelledby="pkas-title">
        <div className="pkas-head">
          <div>
            <h2 id="pkas-title">Add Parking Space</h2>
            <p>New space</p>
          </div>
          <button className="pkas-close" onClick={onClose} aria-label="Close">
            {Icon.close}
          </button>
        </div>

        <div className="pkas-divider" />

        <form className="pkas-form" onSubmit={handleSubmit}>
          <div className="pkas-field">
            <label htmlFor="pkas-location">Location</label>
            <div className="pkas-select-wrap">
              <select id="pkas-location" value={form.location} onChange={update("location")}>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {Icon.chevronDown}
            </div>
          </div>

          <div className="pkas-row">
            <div className="pkas-field">
              <label htmlFor="pkas-number">Space Number</label>
              <input
                id="pkas-number"
                type="text"
                placeholder="A-01"
                value={form.spaceNumber}
                onChange={update("spaceNumber")}
              />
            </div>
            <div className="pkas-field">
              <label htmlFor="pkas-floor">Floor / Level</label>
              <input
                id="pkas-floor"
                type="text"
                placeholder="G"
                value={form.floor}
                onChange={update("floor")}
              />
            </div>
          </div>

          <div className="pkas-row">
            <div className="pkas-field">
              <label htmlFor="pkas-type">Type</label>
              <div className="pkas-select-wrap">
                <select id="pkas-type" value={form.type} onChange={update("type")}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {Icon.chevronDown}
              </div>
            </div>
            <div className="pkas-field">
              <label htmlFor="pkas-price">Price / Hour ($)</label>
              <input
                id="pkas-price"
                type="number"
                step="0.01"
                placeholder="4.50"
                value={form.pricePerHour}
                onChange={update("pricePerHour")}
              />
            </div>
          </div>

          <div className="pkas-actions">
            <button type="submit" className="pkas-btn-primary">Add Space</button>
            <button type="button" className="pkas-btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}