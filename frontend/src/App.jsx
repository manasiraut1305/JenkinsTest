import "./App.css";
import "./Main.css";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminAnnualReport from "./Admin/AdminAnnualReport";
import AdminImage from "./Admin/AdminImage";

function App() {
  return (
    <Routes>

      {/* Login Page (NO sidebar) */}
      <Route path="/" element={<AdminLogin />} />

      {/* Admin Layout Routes */}
      <Route
        path="/admin/*"
        element={
          <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="image" element={<AdminImage />} />
                <Route path="annualReport" element={<AdminAnnualReport />} />
              </Routes>
            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default App;
