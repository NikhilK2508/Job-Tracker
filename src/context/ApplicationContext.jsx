import React, { createContext, useContext, useEffect, useState } from "react";

// keys for localStorage
// (had a different name before, keeping old one too just in case old data is still there)
const STORAGE_KEY = "trackwell_applications_v1";
const LEGACY_STORAGE_KEY = "pathway_applications_v1"; // old name of the app was "Pathway"

// all the stages/status an application can be in
// if you want to add a new stage (like "Withdrawn") just add an object here
export const STAGES = [
  { id: "applied", label: "Applied", color: "var(--stage-applied)" },
  { id: "interview", label: "Interview", color: "var(--stage-interview)" },
  { id: "offer", label: "Offer", color: "var(--stage-offer)" },
  { id: "rejected", label: "Rejected", color: "var(--stage-rejected)" },
];

const ApplicationContext = createContext(null);

// after how many days we show the "follow up" reminder
export const FOLLOW_UP_DAYS = 7;

// calculates no. of days passed since given date
export function daysSince(isoTimestamp) {
  // agar time hi nahi diya to Infinity return kar do (matlab bohot purana)
  if (!isoTimestamp) {
    return Infinity;
  }

  let diffMs = Date.now() - new Date(isoTimestamp).getTime();
  let diffDays = diffMs / 86400000; // 1000*60*60*24 ms in a day

  return Math.floor(diffDays);
}

export function needsFollowUp(app) {
  // only applied/interview apps need a follow up, offer/rejected are done deal
  if (app.status !== "applied" && app.status !== "interview") {
    return false;
  }

  if (daysSince(app.lastUpdated) >= FOLLOW_UP_DAYS) {
    return true;
  }
  return false;
}

// loads whatever was saved before, else gives some dummy/sample data
function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // check old key too (migration from old app name)
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      return JSON.parse(legacyRaw);
    }
  } catch (err) {
    // agar json.parse fail ho gaya to bas error print kardo, crash nahi karana
    console.error("Failed to read saved applications:", err);
  }

  // console.log("no saved data found, using default sample data");

  // dummy data so that board doesn't look empty when app opens first time
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
      history: [
        {
          date: new Date(Date.now() - 6 * 86400000).toISOString(),
          note: "Application submitted.",
        },
        {
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          note: "Moved to Interview — recruiter screen went well.",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      company: "Kestrel Labs",
      role: "React Developer",
      link: "",
      appliedDate: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
      status: "applied",
      notes: "Applied via referral.",
      // isko purposely purana rakha hai taki follow up wala badge dikhe
      lastUpdated: new Date(Date.now() - 9 * 86400000).toISOString(),
      history: [
        {
          date: new Date(Date.now() - 12 * 86400000).toISOString(),
          note: "Application submitted via referral.",
        },
      ],
    },
  ];
}

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(loadInitial);

  // har baar jab applications change ho, localStorage me save kardo
  useEffect(() => {
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (err) {
      console.error("Failed to persist applications:", err);
    }
  }, [applications]);

  function addApplication(entry) {
    const now = new Date().toISOString();
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      lastUpdated: now,
      history: [{ date: now, note: "Application created." }],
    };

    // console.log("adding new application ->", newEntry);

    setApplications((prev) => {
      const updatedList = [newEntry, ...prev];
      return updatedList;
    });

    return newEntry.id;
  }

  // updates an application. also if status changed, adds a note in history
  // automatically so we dont have to write that everywhere manually
  function updateApplication(id, updates) {
    const now = new Date().toISOString();

    setApplications((prev) => {
      // map through every application and only change the one matching id
      const newApplications = prev.map((app) => {
        if (app.id !== id) {
          return app;
        }

        const existingHistory = app.history || [];
        let stageChanged = false;
        if (updates.status && updates.status !== app.status) {
          stageChanged = true;
        }

        let history = existingHistory;
        if (stageChanged) {
          const stageLabel = STAGES.find((s) => s.id === updates.status)?.label;
          history = [...existingHistory, { date: now, note: `Stage moved to ${stageLabel}.` }];
        }

        return { ...app, ...updates, lastUpdated: now, history: history };
      });

      return newApplications;
    });
  }

  // adds a manual note (like "recruiter called") without touching anything else
  function addNote(id, note) {
    const trimmed = note.trim();
    if (!trimmed) {
      return; // don't save empty notes
    }

    const now = new Date().toISOString();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            lastUpdated: now,
            history: [...(app.history || []), { date: now, note: trimmed }],
          };
        } else {
          return app;
        }
      })
    );
  }

  function deleteApplication(id) {
    // console.log("deleting application id:", id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }

  function getApplication(id) {
    for (let i = 0; i < applications.length; i++) {
      if (applications[i].id === id) {
        return applications[i];
      }
    }
    return undefined;
  }

  const value = {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    addNote,
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
