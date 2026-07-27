import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useApplications,
  STAGES,
  daysSince,
  needsFollowUp,
} from "../context/ApplicationContext.jsx";

// same validation function as AddApplication.jsx
// (should probably move this to a shared file someday but this works for now)
function validate(form) {
  const errors = {};
  if (!form.company.trim()) errors.company = "Company name is required.";
  if (!form.role.trim()) errors.role = "Role title is required.";
  if (!form.appliedDate) errors.appliedDate = "Pick the date you applied.";
  if (form.link.trim() && !/^https?:\/\/.+/i.test(form.link.trim())) {
    errors.link = "Link should start with http:// or https://";
  }
  return errors;
}

export default function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApplication, updateApplication, deleteApplication, addNote } = useApplications();
  const existing = getApplication(id);

  const [form, setForm] = useState(
    existing || {
      company: "",
      role: "",
      link: "",
      appliedDate: "",
      status: "applied",
      notes: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  // agar id galat hai ya application delete ho chuki hai to yaha rok do
  if (!existing) {
    return (
      <div className="empty-state">
        <h3>Application not found</h3>
        <p>It may have already been deleted.</p>
        <div style={{ marginTop: 18 }}>
          <Link to="/" className="btn btn-primary">
            Back to board
          </Link>
        </div>
      </div>
    );
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate({ ...form }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ company: true, role: true, appliedDate: true, link: true });
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    updateApplication(id, {
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      link: form.link.trim(),
    });
    navigate("/");
  }

  // delete button needs to be clicked twice - first click just asks
  // for confirmation, second click actually deletes
  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }

    deleteApplication(id);
    navigate("/");
  }

  function handleAddNote(e) {
    e.preventDefault();
    if (!noteDraft.trim()) {
      return;
    }
    addNote(id, noteDraft);
    setNoteDraft("");
  }

  function formatTimelineDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const daysAgo = daysSince(existing.lastUpdated);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Editing</span>

        <h1 className="page-title">
          {existing.role} · {existing.company}
        </h1>
        <p className="page-sub">
          Update the status as things move, or fix a typo from the day you
          rushed the application in.
        </p>
        <p className="hint" style={{ marginTop: 10 }}>

          Last updated {daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}

          {needsFollowUp(existing) && (
            <span style={{ color: "var(--stage-interview)", marginLeft: 8 }}>
              ⏰ Consider following up
            </span>
          )}
        </p>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              onBlur={() => handleBlur("company")}
              className={touched.company && errors.company ? "invalid" : ""}
            />
            {touched.company && errors.company && (
              <div className="error-text">{errors.company}</div>
            )}
          </div>

          <div className="field-group">

            <label htmlFor="role">Role title</label>
            <input
              id="role"
              type="text"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              onBlur={() => handleBlur("role")}
              className={touched.role && errors.role ? "invalid" : ""}
            />
            {touched.role && errors.role && (
              <div className="error-text">{errors.role}</div>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="appliedDate">Date applied</label>

            <input
              id="appliedDate"
              type="date"
              value={form.appliedDate}
              onChange={(e) => handleChange("appliedDate", e.target.value)}
              onBlur={() => handleBlur("appliedDate")}
              className={touched.appliedDate && errors.appliedDate ? "invalid" : ""}
            />
            {touched.appliedDate && errors.appliedDate && (
              <div className="error-text">{errors.appliedDate}</div>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="link">Job post link (optional)</label>

            <input
              id="link"
              type="url"
              value={form.link}
              onChange={(e) => handleChange("link", e.target.value)}
              onBlur={() => handleBlur("link")}
              className={touched.link && errors.link ? "invalid" : ""}
            />
            {touched.link && errors.link && (
              <div className="error-text">{errors.link}</div>
            )}
          </div>
        </div>

        <div className="field-group">
          <label>Current status</label>

          <div className="status-picker">
            {STAGES.map((stage) => (
              <button
                type="button"
                key={stage.id}
                className={
                  "status-chip" + (form.status === stage.id ? " selected" : "")
                }
                style={{ "--chip-color": stage.color }}
                onClick={() => handleChange("status", stage.id)}
              >
                <span className="dot" style={{ background: stage.color }} />
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="notes">Notes</label>

          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
          <Link to="/" className="btn btn-ghost">
            Back to board
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            style={{ marginLeft: "auto" }}
          >
            {confirmingDelete ? "Click again to confirm delete" : "Delete"}
          </button>
        </div>
      </form>

      <div className="form-card timeline-card">
        <h3 className="timeline-title">Activity timeline</h3>
        <p className="hint" style={{ marginBottom: 16 }}>
          Every stage change is logged automatically. Add your own note for
          things like a recruiter call or a follow-up email you sent.
        </p>

        <form className="note-form" onSubmit={handleAddNote}>
          <input
            type="text"
            placeholder="e.g. Sent a follow-up email to the recruiter"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            aria-label="Add a timeline note"
          />
          <button type="submit" className="btn btn-primary">
            Add note
          </button>
        </form>

        {(!existing.history || existing.history.length === 0) ? (
          <p className="hint">No activity logged yet.</p>
        ) : (
          <ul className="timeline-list">
            
            {[...existing.history].reverse().map((entry, i) => (
              <li className="timeline-item" key={i}>
                <span className="timeline-dot" />
                <div>
                  <div className="timeline-note">{entry.note}</div>
                  <div className="timeline-date">{formatTimelineDate(entry.date)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
