import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">P</span>
          Pathway
        </NavLink>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Board
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Stats
          </NavLink>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <NavLink to="/add" className="nav-link nav-cta">
            + Add application
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
