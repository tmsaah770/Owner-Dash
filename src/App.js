import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import Dashboard from "./components/Dashboard";
import ParkingLocations from "./components/Parkinglocations";
import SpaceManagement from "./components/Spacemanagement";
import Availability from "./components/Availability";
import Reservations from "./components/Reservations";
import Pricing from "./components/Pricing";
import RevenueReports from "./components/Revenuereports";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import ComingSoon from "./components/ComingSoon";
import dashboardApi from "./api/Dashboardapi";

import { NAV_ITEMS } from "./components/Sidebar";

import "./App.css";


/* ==========================================
   APP ROUTES
   ========================================== */

function AppRoutes() {
  const navigate = useNavigate();

  // Navigation function used by all pages and Sidebar
  const handleNavigate = (route) => {
    navigate(`/${route}`);
  };

  return (
    <Routes>

      {/* =====================================
          DEFAULT ROUTE
          ===================================== */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />


      {/* =====================================
          AUTHENTICATION
          ===================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<SignUp />}
      />


      {/* =====================================
          DASHBOARD
          ===================================== */}

      <Route
        path="/dashboard"
        element={
          <Dashboard
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          PARKING LOCATIONS
          ===================================== */}

      <Route
        path="/locations"
        element={
          <ParkingLocations
            onNavigate={handleNavigate}
          />
        }
      />

      {/* Old route - keep it working */}
      <Route
        path="/parking"
        element={
          <ParkingLocations
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          SPACE MANAGEMENT
          ===================================== */}

      <Route
        path="/space-management"
        element={
          <SpaceManagement
            onNavigate={handleNavigate}
          />
        }
      />

      {/* Old capitalized route - keep it working */}
      <Route
        path="/SpaceManagement"
        element={
          <SpaceManagement
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          AVAILABILITY
          ===================================== */}

      <Route
        path="/availability"
        element={
          <Availability
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          RESERVATIONS
          ===================================== */}

      <Route
        path="/reservations"
        element={
          <Reservations
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          PRICING
          ===================================== */}

      <Route
        path="/pricing"
        element={
          <Pricing
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          REVENUE REPORTS
          ===================================== */}

      <Route
        path="/revenue-reports"
        element={
          <RevenueReports
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          NOTIFICATIONS
          ===================================== */}

      <Route
        path="/notifications"
        element={
          <Notifications
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          SETTINGS
          ===================================== */}

      <Route
        path="/settings"
        element={
          <Settings
            onNavigate={handleNavigate}
          />
        }
      />


      {/* =====================================
          ANY OTHER SIDEBAR PAGE
          ===================================== */}

      <Route
        path="*"
        element={
          <ComingSoonPage
            onNavigate={handleNavigate}
          />
        }
      />

    </Routes>
  );
}


/* ==========================================
   COMING SOON PAGE
   ========================================== */

function ComingSoonPage({ onNavigate }) {

  const location = useLocation();

  // Example:
  // /some-page
  // becomes:
  // some-page

  const route = location.pathname.replace(/^\/+/, "");

  const navItem = NAV_ITEMS.find(
    (item) => item.route === route
  );

  return (
    <ComingSoon
      route={route}
      title={navItem ? navItem.label : "Page"}
      onNavigate={onNavigate}
    />
  );
}


/* ==========================================
   MAIN APP
   ========================================== */

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;