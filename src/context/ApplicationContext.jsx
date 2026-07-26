import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "pathway_applications_v1";

// Central config for the hiring pipeline. Every stage-colored UI element
// (board columns, chips, stage rail, stats bars) reads from this single
// source of truth, so adding/renaming a stage only requires editing here.
export const STAGES = [
  { id: "applied", label: "Applied", color: "var(--stage-applied)" },
  { id: "interview", label: "Interview", color: "var(--stage-interview)" },
  { id: "offer", label: "Offer", color: "var(--stage-offer)" },
  { id: "rejected", label: "Rejected", color: "var(--stage-rejected)" },
];

const ApplicationContext = createContext(null);

// If an active application (applied/interview) hasn't been touched in this
// many days, we flag it as needing a follow-up nudge.
export const FOLLOW_UP_DAYS = 7;

export function daysSince(isoTimestamp) {
  if (!isoTimestamp) return Infinity;
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  return Math.floor(diffMs / 86400000);
}

export function needsFollowUp(app) {
  if (app.status !== "applied" && app.status !== "interview") return false;
  return daysSince(app.lastUpdated) >= FOLLOW_UP_DAYS;
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read saved applications:", err);
  }
  // seed data so the board isn't empty on first run
  return [
    {
      id: crypto.randomUUID(),
      company: "Nimbus Systems",
      role: "Frontend Engineer",
      link: "",
      appliedDate: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
      status: "interview",
      notes: "Recruiter screen went well, technical round scheduled.",
      lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      company: "Kestrel Labs",
      role: "React Developer",
      link: "",
      appliedDate: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
      status: "applied",
      notes: "Applied via referral.",
      // deliberately stale so the follow-up reminder has something to show
      lastUpdated: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
  ];
}

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (err) {
      console.error("Failed to persist applications:", err);
    }
  }, [applications]);

  function addApplication(entry) {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
    };
    setApplications((prev) => [newEntry, ...prev]);
    return newEntry.id;
  }

  function updateApplication(id, updates) {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, ...updates, lastUpdated: new Date().toISOString() }
          : app
      )
    );
  }

  function deleteApplication(id) {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }

  function getApplication(id) {
    return applications.find((app) => app.id === id);
  }

  const value = {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplication,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) {
    throw new Error("useApplications must be used inside an ApplicationProvider");
  }
  return ctx;
}
