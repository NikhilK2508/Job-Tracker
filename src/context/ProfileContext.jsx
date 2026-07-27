import React, { createContext, useContext, useEffect, useState } from "react";

const PROFILE_KEY = "trackwell_profile_v1";
const LEGACY_PROFILE_KEY = "pathway_profile_v1";

const DEFAULT_PROFILE = {
  name: "",
  targetRole: "",
  goalOffers: 1,
};

function loadInitialProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY) || localStorage.getItem(LEGACY_PROFILE_KEY);
    if (raw) {
      // spread default profile first so agar koi field missing hai to bhi crash na ho
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error("Failed to read saved profile:", err);
  }
  return DEFAULT_PROFILE;
}

// converts "Aarav Sharma" -> "AS" for the little avatar circle in navbar
// agar naam set nahi kiya to bas "?" dikha do
export function getInitials(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) {
    return "?";
  }

  const parts = trimmed.split(/\s+/);
  let result = "";
  for (let i = 0; i < parts.length && i < 2; i++) {
    result += parts[i][0].toUpperCase();
  }
  return result;
}

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadInitialProfile);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to persist profile:", err);
    }


    // console.log("profile saved", profile);

  }, [profile]);

  function updateProfile(updates) {
    // console.log("updating profile with", updates)
    setProfile((prev) => ({ ...prev, ...updates }));
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
    
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside a ProfileProvider");
  }
  return ctx;
}
