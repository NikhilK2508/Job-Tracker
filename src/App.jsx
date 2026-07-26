import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddApplication from "./pages/AddApplication.jsx";
import EditApplication from "./pages/EditApplication.jsx";
import Stats from "./pages/Stats.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddApplication />} />
          <Route path="/edit/:id" element={<EditApplication />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
