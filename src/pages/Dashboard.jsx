import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useApplications,
  STAGES,
  needsFollowUp,
} from "../context/ApplicationContext.jsx";
import StageRail from "../components/StageRail.jsx";

// converts "2025-01-05" type string  "Jan 5"
function formatDate(dateStr) {
  if (!dateStr) {
    return "—";
  }
  const d = new Date(dateStr + "T00:00:00");

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const ALL_STAGE_IDS = STAGES.map((s) => s.id);

// wraps text in quotes for csv, and escapes existing quotes

// (found this rule online, csv breaks if you dont do this for commas/newlines)
function csvCell(value) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

function exportApplicationsToCSV(applications) {
  const headers = [    "Company",
    "Role",
    "Status",
    "Date Applied",
    "Job Link",
    "Notes",
  ];

  const rows = [];
  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];
    const stageLabel = STAGES.find((s) => s.id === app.status)?.label || app.status;
    rows.push([app.company, app.role, stageLabel, app.appliedDate, app.link, app.notes]);
  }

  const allRows = [headers, ...rows];
  const csvContent = allRows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  // console.log("csv content ready:", csvContent);

  // adding BOM at start so excel shows special characters properly
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const { applications } = useApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStages, setActiveStages] = useState(ALL_STAGE_IDS);

  const total = applications.length;

  // counting how many applications are in each category
  let activeCount = 0;
  let offerCount = 0;
  let rejectedCount = 0;
  for (let i = 0; i < applications.length; i++) {
    const status = applications[i].status;
    if (status === "applied" || status === "interview") activeCount++;
    if (status === "offer") offerCount++;
    if (status === "rejected") rejectedCount++;
  }

  const followUpCount = applications.filter(needsFollowUp).length;

  function toggleStage(stageId) {
    // console.log("toggling stage filter:", stageId);
    setActiveStages((prev) => {
      if (prev.includes(stageId)) {
        return prev.filter((s) => s !== stageId);
      } else {
        return [...prev, stageId];
      }
    });
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
          Every application in one place — added once, tracked till the offer
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
            <button
              type="button"
              className="btn btn-ghost export-btn"
              onClick={() => exportApplicationsToCSV(filteredApplications)}
              title="Download the currently filtered applications as a CSV file"
            >
              ⬇ Export CSV
            </button>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="board-empty" style={{ marginBottom: 40 }}>
              No applications match your search or filters.
            </div>
          ) : (
            <div className="board">
              {STAGES.filter((s) => activeStages.includes(s.id)).map(
                (stage) => {
                  const items = filteredApplications.filter(
                    (a) => a.status === stage.id,
                  );
                  return (
                    <div className="board-col" key={stage.id}>
                      <div className="board-col-head">
                        <div className="board-col-title">
                          <span
                            className="dot"
                            style={{ background: stage.color }}
                          />
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
                              className={
                                "app-card" + (flagged ? " needs-followup" : "")
                              }
                            >
                              <div className="app-card-top">
                                <div>
                                  <div className="app-card-role">
                                    {app.role}
                                  </div>
                                  <div className="app-card-company">
                                    {app.company}
                                  </div>
                                </div>
                                {flagged && (
                                  <span
                                    className="followup-badge"
                                    title="No update in 7+ days"
                                  >
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
                },
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
