import React from "react";
import { Link } from "react-router-dom";
import { useApplications, STAGES, needsFollowUp } from "../context/ApplicationContext.jsx";

export default function Stats() {
  const { applications } = useApplications();
  const total = applications.length;

  const counts = STAGES.map((stage) => ({
    ...stage,
    count: applications.filter((a) => a.status === stage.id).length,
  }));

  // for scaling bar widths, min 1 so we dont divide by 0 when list is empty
  var maxCount = 1;
  for (const c of counts) {
    if (c.count > maxCount) maxCount = c.count;
  }

  const applied = applications.length;
  const reachedInterview = applications.filter((a) =>
    ["interview", "offer", "rejected"].includes(a.status)
  ).length;
  const reachedOffer = applications.filter((a) => a.status === "offer").length;

  let interviewRate = 0;
  let offerRate = 0;
  if (applied > 0) {
    interviewRate = Math.round((reachedInterview / applied) * 100);
    offerRate = Math.round((reachedOffer / applied) * 100);
  }

  const followUpCount = applications.filter(needsFollowUp).length;
  // console.log("stats ->", { applied, reachedInterview, reachedOffer, interviewRate, offerRate });

  if (total === 0) {
    return (
      <div className="empty-state">
        <h3>No data yet</h3>
        <p>Add a few applications and your stats will show up here.</p>
        <div style={{ marginTop: 18 }}>

          <Link to="/add" className="btn btn-primary">
            + Add application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Numbers</span>
        
        <h1 className="page-title">How the search is going</h1>
        <p className="page-sub">
          The honest version of your job search, no vibes — just what
          actually happened to every application you sent.
        </p>
      </div>

      <div className="funnel">
        <div className="funnel-step">
          <div className="stat-num">{applied}</div>
          <div className="stat-label">Applied</div>
        </div>
        <div className="funnel-step">
          <div className="stat-num" style={{ color: "var(--stage-interview)" }}>
            {reachedInterview}
          </div>
          <div className="stat-label">Reached interview ({interviewRate}%)</div>
        </div>
        <div className="funnel-step">
          <div className="stat-num" style={{ color: "var(--stage-offer)" }}>
            {reachedOffer}
          </div>
          <div className="stat-label">Reached offer ({offerRate}%)</div>
        </div>
        <div className="funnel-step">
          <div className="stat-num" style={{ color: "var(--stage-rejected)" }}>
            {counts.find((c) => c.id === "rejected")?.count || 0}
          </div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="funnel-step">
          <div className="stat-num" style={{ color: "var(--stage-interview)" }}>
            {followUpCount}
          </div>
          <div className="stat-label">Need follow-up</div>
        </div>
      </div>

      <div className="form-card mb-2" style={{ maxWidth: "100%" }}>
        <h3 style={{ marginBottom: 22, fontSize: 16 }}>Breakdown by stage</h3>
        <div className="bar-chart">
          {counts.map((stage) => {
            // width % for the bar based on which stage has the highest count
            const widthPct = (stage.count / maxCount) * 100;
            return (
              <div className="bar-row" key={stage.id}>
                <div className="bar-label">{stage.label}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${widthPct}%`,
                      background: stage.color,
                    }}
                  />
                </div>
                <div className="bar-value">{stage.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
