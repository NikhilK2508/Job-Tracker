import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApplications, STAGES } from "../context/ApplicationContext.jsx";

const EMPTY_FORM = {
  company: "",
  role: "",
  link: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  status: "applied",
  notes: "",
};

// checks the form, returns object with error msgs (empty obj = no errors)
function validate(form) {
  let errors = {};

  if (form.company.trim() == "") {
    errors.company = "Company name is required.";
  }
  if (form.role.trim() == "") {
    errors.role = "Role title is required.";
  }
  if (!form.appliedDate) {
    errors.appliedDate = "Pick the date you applied.";
  }
  // link is optional, only validate if user actually typed something
  if (form.link.trim() != "" && !/^https?:\/\/.+/i.test(form.link.trim())) {
    errors.link = "Link should start with http:// or https://";
  }

  return errors;
}

export default function AddApplication() {
  const { addApplication } = useApplications();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    // console.log("errors are", validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return; // ruk jao, aage mat badho
    }

    const id = addApplication({
      ...form,
      
      company: form.company.trim(),
      role: form.role.trim(),
      link: form.link.trim(),
    });

    navigate(`/edit/${id}`);
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">New entry</span>
        <h1 className="page-title">Add an application</h1>
        <p className="page-sub">
          Log it the moment you hit submit — future you will thank you
          when a recruiter calls back three weeks later.
        </p>
      </div>

      <form className="form-card mb-2" onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field-group">
            
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              placeholder="e.g. Nimbus Systems"
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
              placeholder="e.g. Frontend Engineer"
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
              placeholder="https://..."
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
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            placeholder="referred by a friend, round 2 was dsa + hr round pending"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
          <div className="hint">
            Recruiter names, round formats, salary talk — whatever future
            you will want to remember.
          </div>
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">
            Save application
          </button>
          <Link to="/" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
