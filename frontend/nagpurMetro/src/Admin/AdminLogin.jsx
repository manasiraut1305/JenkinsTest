import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import { loginUser } from "../Api/Login";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        username,
        password,
      });

      if (response?.statusCode === 200) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(response?.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #FFD8A8, #FFE5B4)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px 40px 20px",
          borderRadius: "15px",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <img
          src="/src/assets/nagpur-metro-logo.png"
          alt="Nagpur Metro"
          style={{ width: "30%", paddingBottom: 20 }}
        />

        <h2 style={{ marginBottom: "25px", color: "#FF7F50" }}>
          Admin Login
        </h2>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "15px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* ✅ Username */}
          <div className="mb-4 text-start">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* ✅ Password */}
          <div className="mb-3 text-start" style={{ position: "relative" }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* ✅ Toggle Icon FIX */}
            <i
              className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
              aria-label="toggle password"
              role="button"
              style={{
                position: "absolute",
                right: "15px",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#aaa",
              }}
              onClick={togglePassword}
            ></i>
          </div>

          <div className="d-grid">
            <MDBBtn
              style={{ backgroundColor: "#FF8C00", borderColor: "#FF8C00" }}
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </MDBBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
