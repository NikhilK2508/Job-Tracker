import React from "react";
import { Link } from "react-router-dom";

// simple 404 page, shows up for any route that doesn't match
export default function NotFound() {
  return (
    <div className="empty-state">
      <h3>Page not found</h3>
      <p>That route doesn't exist in Trackwell.</p>
      <div style={{ marginTop: 18 }}>
        <Link to="/" className="btn btn-primary">
          Back to board
        </Link>
      </div>
    </div>
  );
}
