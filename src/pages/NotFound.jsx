import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state">
      <h3>Page not found</h3>
      <p>That route doesn't exist in Pathway.</p>
      <div style={{ marginTop: 18 }}>
        <Link to="/" className="btn btn-primary">
          Back to board
        </Link>
      </div>
    </div>
  );
}
