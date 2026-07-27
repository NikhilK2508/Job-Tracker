import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useProfile, getInitials } from "../context/ProfileContext.jsx";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const hasName = Boolean(profile.name && profile.name.trim());

  // jab bhi route/page change ho, mobile menu ko band kar do
  // warna link click karne ke baad bhi menu khula reh jata hai peeche
  useEffect(() => {
    setMenuOpen(false);
    // console.log("route changed to", location.pathname);
  }, [location.pathname]);

  function handleMenuToggle() {
    setMenuOpen((prev) => !prev);
    // console.log('menu toggled, prev was', menuOpen)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">T</span>
          Trackwell
        </NavLink>

        <button
          type="button"
          className={"hamburger" + (menuOpen ? " open" : "")}
          onClick={handleMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>

        <nav className={"nav-links" + (menuOpen ? " open" : "")}>
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
          <NavLink to="/add" className="nav-link nav-cta">
            + Add application
          </NavLink>

         
          <div className="mobile-utility-row">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => {
                toggleTheme();
                // menu khula reh jata tha theme change karne ke baad, isliye
                // yaha bhi manually band kar rahe (same jaisa route change pe hota hai)
                setMenuOpen(false);
              }}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              
              <i
                className={theme === "dark" ? "ri-sun-line" : "ri-moon-line"}
                aria-hidden="true"
              />
              <span className="utility-label">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>

            <NavLink
              to="/profile"
              className={({ isActive }) => "profile-link" + (isActive ? " active" : "")}
              title={profile.name || "Set up your profile"}
            >
              <span className="profile-avatar">
                {hasName ? (
                  getInitials(profile.name)
                ) : (
                  <i className="ri-user-3-fill" aria-hidden="true" />
                )}
              </span>
              <span className="utility-label">Profile</span>
            </NavLink>
          </div>
        </nav>

        {menuOpen && (
          <div
            className="nav-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}
