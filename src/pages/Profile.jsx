import React, { useState } from "react";
import { useProfile, getInitials } from "../context/ProfileContext.jsx";
import { useApplications } from "../context/ApplicationContext.jsx";

export default function Profile() {
  const { profile, updateProfile } = useProfile();
  const { applications } = useApplications();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const offerCount = applications.filter((a) => a.status === "offer").length;
  const goal = Number(form.goalOffers) || 0;

  // progress bar %, capping at 100 so bar doesnt overflow past the goal
  var progressPct = 0;
  if (goal > 0) {
    progressPct = Math.round((offerCount / goal) * 100);
    if (progressPct > 100) progressPct = 100;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false); // user ne kuch badla, "Saved" tick hata do
  }

  function handleSubmit(e) {
    e.preventDefault();

    updateProfile({
      name: form.name.trim(),

      targetRole: form.targetRole.trim(),
      goalOffers: Math.max(1, Number(form.goalOffers) || 1),
    });
    setSaved(true);
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Your profile</span>
        <h1 className="page-title">Profile & goals</h1>
        <p className="page-sub">
          Set who you are and what you're chasing — Trackwell uses this to
          personalize your progress on the Stats page.
        </p>
      </div>

      <div className="profile-layout mb-3">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Raja Sharma"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <div className="hint">
              Shown as your avatar's initials in the navbar.
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="targetRole">Target role</label>
            <input
              id="targetRole"
              type="text"
              placeholder="e.g. Frontend Developer"
              value={form.targetRole}
              onChange={(e) => handleChange("targetRole", e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="goalOffers">Offer goal</label>
            <input
              id="goalOffers"
              type="number"
              min="1"
              value={form.goalOffers}
              onChange={(e) => handleChange("goalOffers", e.target.value)}
            />
            <div className="hint">
              How many offers are you aiming for this search?
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
            {saved && (
              <span className="hint" style={{ alignSelf: "center" }}>
                Saved ✓
              </span>
            )}
          </div>
        </form>

        <div className="form-card profile-summary">
          <div className="profile-avatar-lg">
            {form.name && form.name.trim() ? (
              getInitials(form.name)
            ) : (
              <i className="ri-user-3-fill" aria-hidden="true" />
            )}
          </div>
          <h3 style={{ marginTop: 14 }}>{form.name || "Your name here"}</h3>
          <p className="hint" style={{ marginBottom: 18 }}>
            {form.targetRole || "Set a target role"}
          </p>

          <div className="progress-label">
            <span>Offers so far</span>
            <span>
              {offerCount} / {goal || "—"}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="hint" style={{ marginTop: 10 }}>
            {offerCount >= goal && goal > 0
              ? "Goal reached! 🎉"
              : `${Math.max(goal - offerCount, 0)} more offer${goal - offerCount === 1 ? "" : "s"} to go.`}
          </p>
        </div>
      </div>
    </>
  );
}
