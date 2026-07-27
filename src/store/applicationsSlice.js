import { createSlice } from "@reduxjs/toolkit";

// keys for localStorage
// (same keys as before, just moved here from the old context file)
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

// after how many days we show the "follow up" reminder
export const FOLLOW_UP_DAYS = 7;

// calculates no of days since given date
export function daysSince(isoTimestamp) {
  if (!isoTimestamp) return Infinity; // no date means treat as very old

  var diffMs = Date.now() - new Date(isoTimestamp).getTime();
  var diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.floor(diffDays);
}

export function needsFollowUp(app) {
  // only applied/interview apps need a follow up, offer/rejected are done deal
  if (app.status != "applied" && app.status != "interview") {
    return false;
  }
  // console.log("checking followup for", app.company, daysSince(app.lastUpdated))
  return daysSince(app.lastUpdated) >= FOLLOW_UP_DAYS;
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
      pinned: false,
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
      pinned: false,
      history: [
        {
          date: new Date(Date.now() - 12 * 86400000).toISOString(),
          note: "Application submitted via referral.",
        },
      ],
    },
  ];
}

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    items: loadInitial(),
  },
  reducers: {
    // prepare function banata hai id/history wagera, reducer sirf list me daalta hai
    addApplication: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(entry) {
        const now = new Date().toISOString();
        return {
          payload: {
            ...entry,
            id: crypto.randomUUID(),
            pinned: false,
            lastUpdated: now,
            history: [{ date: now, note: "Application created." }],
          },
        };
      },
    },

    // updates an application, and if status changed also adds a note in history
    // so we dont have to do that manually everywhere else
    updateApplication(state, action) {
      const { id, updates } = action.payload;
      const app = state.items.find((a) => a.id === id);
      if (!app) return;

      const now = new Date().toISOString();
      const stageChanged = updates.status && updates.status !== app.status;

      if (stageChanged) {
        const stageLabel = STAGES.find((s) => s.id === updates.status)?.label;
        app.history = [
          ...(app.history || []),
          { date: now, note: `Stage moved to ${stageLabel}.` },
        ];
      }

      Object.assign(app, updates, { lastUpdated: now });
    },

    // adds a manual note (like "recruiter called") without touching anything else
    addNote(state, action) {
      const { id, note } = action.payload;
      const trimmed = note.trim();
      if (!trimmed) {
        return; // don't save empty notes
      }

      const app = state.items.find((a) => a.id === id);
      if (!app) {
        return;
      }

      const now = new Date().toISOString();
      app.lastUpdated = now;
      app.history = [...(app.history || []), { date: now, note: trimmed }];
    },

    deleteApplication(state, action) {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },

    // pin/star feature - jo company sabse important hai usko column ke
    // upar dikhane ke liye. bas true/false flip kar rahe hai
    togglePin(state, action) {
      const app = state.items.find((a) => a.id === action.payload);
      if (app) {
        app.pinned = !app.pinned;
      }
    },
  },
});

export const {
  addApplication,
  updateApplication,
  addNote,
  deleteApplication,
  togglePin,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
