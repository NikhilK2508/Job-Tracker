import React from "react";
import { STAGES } from "../context/ApplicationContext.jsx";

// order in which an application normally moves forward
// rejected is not really a "4th step", it just means it stopped wherever it was
const FUNNEL_ORDER = ["applied", "interview", "offer"];

export default function StageRail({ status }) {
  const isRejected = status === "rejected";

  // if rejected we still show the bar as fully filled till offer step,
  // looks weird otherwise since rejected isnt really "after" offer
  var currentIndex = isRejected ? FUNNEL_ORDER.length - 1 : FUNNEL_ORDER.indexOf(status);

  return (
    <div className="stage-rail" aria-label={`Pipeline progress: ${status}`}>
      {FUNNEL_ORDER.map((stageId, i) => {
        const filled = i <= currentIndex;

        let color;
        if (isRejected) {
          color = "var(--stage-rejected)";
        } else {
          color = STAGES.find((s) => s.id === stageId)?.color;
        }


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
