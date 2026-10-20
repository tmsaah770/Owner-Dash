import { useState } from "react";


const Icon = {
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

/**
 * Edit Hourly/Daily/Weekly rates for a single space type.
 * `spaceType` (e.g. "Standard") + `rates` ({hourly, daily, weekly}) come from the parent;
 * onSave(newRates) is called with the edited numbers.
 *
 * IMPORTANT: render this with a `key` that changes whenever a different space type
 * is being edited (e.g. key={spaceType}) — that makes React remount the component
 * fresh so the form always initializes from the current `rates` prop, with no
 * effect/flash needed.
 */
export default function EditPricingModal({ isOpen, spaceType, rates, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    hourly: rates ? String(rates.hourly) : "",
    daily: rates ? String(rates.daily) : "",
    weekly: rates ? String(rates.weekly) : "",
  }));

  if (!isOpen) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave &&
      onSave({
        hourly: parseFloat(form.hourly) || 0,
        daily: parseFloat(form.daily) || 0,
        weekly: parseFloat(form.weekly) || 0,
      });
  };

  return (
    <div className="pkep-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="pkep-modal" role="dialog" aria-modal="true" aria-labelledby="pkep-title">
        <div className="pkep-head">
          <div>
            <h2 id="pkep-title">Edit {spaceType} Rates</h2>
            <p>Update hourly, daily, and weekly pricing.</p>
          </div>
          <button className="pkep-close" onClick={onClose} aria-label="Close">
            {Icon.close}
          </button>
        </div>

        <form className="pkep-form" onSubmit={handleSubmit}>
          <div className="pkep-field">
            <label htmlFor="pkep-hourly">Hourly ($)</label>
            <div className="pkep-field-inputwrap">
              <span>$</span>
              <input id="pkep-hourly" type="number" step="0.01" value={form.hourly} onChange={update("hourly")} />
            </div>
          </div>
          <div className="pkep-field">
            <label htmlFor="pkep-daily">Daily ($)</label>
            <div className="pkep-field-inputwrap">
              <span>$</span>
              <input id="pkep-daily" type="number" step="0.01" value={form.daily} onChange={update("daily")} />
            </div>
          </div>
          <div className="pkep-field">
            <label htmlFor="pkep-weekly">Weekly ($)</label>
            <div className="pkep-field-inputwrap">
              <span>$</span>
              <input id="pkep-weekly" type="number" step="0.01" value={form.weekly} onChange={update("weekly")} />
            </div>
          </div>

          <div className="pkep-actions">
            <button type="submit" className="pkep-btn-primary">Save Changes</button>
            <button type="button" className="pkep-btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}