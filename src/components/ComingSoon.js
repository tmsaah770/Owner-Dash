
import Sidebar from "./Sidebar";

/**
 * Generic placeholder used for every nav item that doesn't have a
 * full page yet (Space Management, Availability, Reservations, Pricing,
 * Revenue & Reports, Notifications, Settings). Keeps the same Sidebar
 * so navigation always feels consistent, and gives you a ready spot to
 * build the real page later — just swap this out for a dedicated
 * component the same way Dashboard.jsx / ParkingLocations.jsx are built.
 */
export default function ComingSoon({ route, title, onNavigate }) {
  return (
    <div className="pk-coming">
      <div className="pk-coming-app">
        <Sidebar active={route} onNavigate={onNavigate} showFooter />
        <main className="pk-coming-main">
          <div className="pk-coming-card">
            <h1>{title}</h1>
            <p>This page isn't built yet — drop your {title} component here.</p>
          </div>
        </main>
      </div>
    </div>
  );
}