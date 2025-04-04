import React from "react";

const ToggleButton = ({ showUsed, setShowUsed }) => (
  <div className="btn-group btn-group-toggle" style={{ borderRadius: "50px", overflow: "hidden", border: "1px solid #28a745" }}>
    {["Unused", "Used"].map((label, index) => (
      <button
        key={label}
        className={`btn btn-sm ${showUsed === !!index ? "btn-success text-white" : "btn-outline-success"}`}
        style={{ flex: 1 }}
        onClick={() => setShowUsed(!!index)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default ToggleButton;
