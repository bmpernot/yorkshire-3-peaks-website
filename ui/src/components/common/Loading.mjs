"use client";

import "../../styles/loading.css";

function Loading({ message, pulsing }) {
  return (
    <>
      <div className={`ball-holder margin-bottom${pulsing ? " pulsing" : ""}`}>
        <div className="ball ball-first" />
        <div className="ball ball-second" />
        <div className="ball ball-third" />
      </div>
      {message ? (
        <p className="text--centre margin-top" style={{ paddingBottom: "63vh" }}>
          {message}
        </p>
      ) : null}
    </>
  );
}

export default Loading;
