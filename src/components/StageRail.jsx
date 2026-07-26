import React from "react";
import { STAGES } from "../context/ApplicationContext.jsx";

// Rejected is a branch, not a step further than Offer — so we still show
// progress up to wherever the application was in the funnel before it ended.
const FUNNEL_ORDER = ["applied", "interview", "offer"];

export default function StageRail({ status }) {
  const isRejected = status === "rejected";
  const currentIndex = isRejected
    ? FUNNEL_ORDER.length - 1
    : FUNNEL_ORDER.indexOf(status);

  return (
    <div className="stage-rail" aria-label={`Pipeline progress: ${status}`}>
      {FUNNEL_ORDER.map((stageId, i) => {
        const filled = i <= currentIndex;
        const color = isRejected
          ? "var(--stage-rejected)"
          : STAGES.find((s) => s.id === stageId)?.color;
        return (
          <div
            key={stageId}
            className={"stage-rail-seg" + (filled ? " filled" : "")}
            style={filled ? { "--seg-color": color } : undefined}
          />
        );
      })}
    </div>
  );
}
