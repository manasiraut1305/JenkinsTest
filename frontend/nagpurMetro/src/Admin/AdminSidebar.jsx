import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdArticle,
  MdEmojiEvents,
  MdPeople,
  MdTableChart,
} from "react-icons/md";
import "./AdminSidebar.css";
import { FaBars } from "react-icons/fa";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/image", label: "Image" },
    { to: "/admin/annualReport", label: "Annual Report" },
  ];

  return (
    <aside
      className={`sidebar ${collapsed ? "is-collapsed" : ""}`}
      aria-label="Admin sidebar"
    >
      <div className="sidebar__header">
       
       <button
        className="sidebar__toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-pressed={collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className="menu-icon">
          <FaBars size={25} />
        </div>
      </button>

        {/* <div className="sidebar__brand">
          <span className="sidebar__brand-text">Metro Admin</span>
        </div> */}

        <div className="sidebar__brand">
          <img
            src="/src/assets/nagpur-metro-logo.png"
            alt="Metro Admin"
            className="sidebar__brand-logo"
          />
        </div>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list" role="list">
          {/* <li className="sidebar__section">Main</li> */}
          <li className="sidebar__divider" role="separator" />

          {items.map((item) => (
            <li key={item.to} className="sidebar__item">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "is-active" : ""}`
                }
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
