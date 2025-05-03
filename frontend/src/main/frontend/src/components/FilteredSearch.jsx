import React, { useState } from "react";
import ToggleButton from "../buttons/ToggleButton";
import { filteredSearch } from "../lib/api";

const FilteredSearch = ({ isVisible, onClose, onSearch, onFiltersApplied }) => {
  const [filters, setFilters] = useState({
    includeTerm: "",
    excludeTerm: "",
    includeUploaded: true,
    includeBookmarked: true,
    includeUsed: false,
  });

  if (!isVisible) return null;
  const handleApply = async () => {
    try {
      if (onFiltersApplied) {
        onFiltersApplied(filters);
        return;
      }

      console.log("Filters before API request:", filters);  // Debug filter values
      const query = filters.includeTerm.trim() || "*"; // Use actual search term
      const results = await filteredSearch(query, {
        filterUsed: filters.includeUsed,
        filterBookmarked: filters.includeBookmarked,
        filterUploaded: filters.includeUploaded,
        include: filters.includeTerm,
        exclude: filters.excludeTerm,
      });

      console.log("FilteredSearch sending results:", results);


      if (onSearch) {
        onSearch(results);
      } else {
        console.error("onSearch is not defined or not a function");
      }
    } catch (error) {
      console.error("Error during filtered search:", error);
    }
    onClose();
  };



  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
        <div className="modal-content" style={{ background: "#F8FDF1", borderRadius: "15px", padding: "20px" }}>
          <div className="modal-header">
            <h5 className="modal-title" style={{ textAlign: "left" }}>Filter Search</h5>
            <button className="btn-close" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
          </div>
          <div className="modal-body">
            {["Include", "Exclude"].map((label, i) => (
              <div key={label} className="mb-3">
                <label className="form-label" style={{ textAlign: "left", display: "block" }}>{label}:</label>
                <input
                  type="text"
                  className="form-control"
                  value={filters[i === 0 ? "includeTerm" : "excludeTerm"]}
                  onChange={(e) => updateFilter(i === 0 ? "includeTerm" : "excludeTerm", e.target.value)}
                  placeholder={`Enter terms to ${label.toLowerCase()}`}
                  style={{ borderRadius: "8px" }}
                />
              </div>
            ))}
            {["Uploaded", "Bookmarked", "Used"].map((label) => (
              <div key={label} className="mb-3 d-flex align-items-center justify-content-between">
                <label className="form-label" style={{ textAlign: "left", marginBottom: "0" }}>Include my {label.toLowerCase()} quotes in search?</label>
                <ToggleButton
                  isActive={filters[`include${label}`]}
                  onToggle={(value) => updateFilter(`include${label}`, value)}
                  labels={["Yes", "No"]}
                  small
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-success w-100" onClick={handleApply} style={{ borderRadius: "8px", background: "#146C43", borderColor: "#146C43" }}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilteredSearch;
