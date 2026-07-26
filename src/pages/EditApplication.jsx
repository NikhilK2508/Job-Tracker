import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useApplications,
  STAGES,
  daysSince,
  needsFollowUp,
} from "../context/ApplicationContext.jsx";

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
  const { getApplication, updateApplication, deleteApplication } = useApplications();
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
    if (Object.keys(validationErrors).length > 0) return;

    updateApplication(id, {
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      link: form.link.trim(),
    });
    navigate("/");
  }

  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    deleteApplication(id);
    navigate("/");
  }

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
          Last updated {daysSince(existing.lastUpdated) === 0
            ? "today"
            : `${daysSince(existing.lastUpdated)} day${daysSince(existing.lastUpdated) === 1 ? "" : "s"} ago`}
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
    </>
  );
}
