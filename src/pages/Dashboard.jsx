import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useApplications,
  STAGES,
  needsFollowUp,
} from "../context/ApplicationContext.jsx";
import StageRail from "../components/StageRail.jsx";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const ALL_STAGE_IDS = STAGES.map((s) => s.id);

export default function Dashboard() {
  const { applications } = useApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStages, setActiveStages] = useState(ALL_STAGE_IDS);

  const total = applications.length;
  const activeCount = applications.filter(
    (a) => a.status === "applied" || a.status === "interview"
  ).length;
  const offerCount = applications.filter((a) => a.status === "offer").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;
  const followUpCount = applications.filter(needsFollowUp).length;

  function toggleStage(stageId) {
    setActiveStages((prev) =>
      prev.includes(stageId)
        ? prev.filter((s) => s !== stageId)
        : [...prev, stageId]
    );
  }

  const filteredApplications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesSearch =
        !term ||
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term);
      const matchesStage = activeStages.includes(app.status);
      return matchesSearch && matchesStage;
    });
  }, [applications, searchTerm, activeStages]);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Job search / control room</span>
        <h1 className="page-title">Your pipeline</h1>
        <p className="page-sub">
          Every application, in one board. Drag nothing, forget nothing —
          add a role once and track it from first click to offer letter.
        </p>
      </div>

      <div className="stat-strip">
        <div className="stat-card">
          <div className="stat-num">{total}</div>
          <div className="stat-label">Total applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{activeCount}</div>
          <div className="stat-label">In progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--stage-offer)" }}>
            {offerCount}
          </div>
          <div className="stat-label">Offers</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--stage-rejected)" }}>
            {rejectedCount}
          </div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--stage-interview)" }}>
            {followUpCount}
          </div>
          <div className="stat-label">Needs follow-up</div>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Add the first role you applied to and it'll show up here.</p>
          <div style={{ marginTop: 18 }}>
            <Link to="/add" className="btn btn-primary">
              + Add application
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search applications"
            />
            <div className="status-picker">
              {STAGES.map((stage) => {
                const isActive = activeStages.includes(stage.id);
                return (
                  <button
                    type="button"
                    key={stage.id}
                    className={"status-chip" + (isActive ? " selected" : "")}
                    style={{ "--chip-color": stage.color }}
                    onClick={() => toggleStage(stage.id)}
                    aria-pressed={isActive}
                  >
                    <span className="dot" style={{ background: stage.color }} />
                    {stage.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="board-empty" style={{ marginBottom: 40 }}>
              No applications match your search or filters.
            </div>
          ) : (
            <div className="board">
              {STAGES.filter((s) => activeStages.includes(s.id)).map((stage) => {
                const items = filteredApplications.filter(
                  (a) => a.status === stage.id
                );
                return (
                  <div className="board-col" key={stage.id}>
                    <div className="board-col-head">
                      <div className="board-col-title">
                        <span className="dot" style={{ background: stage.color }} />
                        {stage.label}
                      </div>
                      <span className="count-pill">{items.length}</span>
                    </div>

                    {items.length === 0 ? (
                      <div className="board-empty">Nothing here</div>
                    ) : (
                      items.map((app) => {
                        const flagged = needsFollowUp(app);
                        return (
                          <Link
                            to={`/edit/${app.id}`}
                            key={app.id}
                            className={"app-card" + (flagged ? " needs-followup" : "")}
                          >
                            <div className="app-card-top">
                              <div>
                                <div className="app-card-role">{app.role}</div>
                                <div className="app-card-company">{app.company}</div>
                              </div>
                              {flagged && (
                                <span className="followup-badge" title="No update in 7+ days">
                                  ⏰
                                </span>
                              )}
                            </div>
                            <div className="app-card-date">
                              Applied {formatDate(app.appliedDate)}
                            </div>
                            <StageRail status={app.status} />
                          </Link>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
