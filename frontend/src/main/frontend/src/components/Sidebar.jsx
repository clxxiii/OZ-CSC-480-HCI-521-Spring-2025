import React, { useState, useEffect, useCallback } from "react";

const Sidebar = ({ userQuotes, bookmarkedQuotes, onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filter, setFilter] = useState("public");
  const [sortBy, setSortBy] = useState("dateUsedRecent");

  const allQuotes = [...bookmarkedQuotes, ...userQuotes];
  const uniqueTags = Array.from(new Set(allQuotes.flatMap((quote) => quote.tags)));

  const updateFilteredQuotes = useCallback(() => {
    let filteredQuotes = allQuotes;

    if (filter === "public") filteredQuotes = filteredQuotes.filter((q) => !q.private);
    if (filter === "private") filteredQuotes = filteredQuotes.filter((q) => q.private);
    if (filter === "uploaded") filteredQuotes = filteredQuotes.filter((q) => userQuotes.includes(q));
    if (filter === "bookmarked") filteredQuotes = filteredQuotes.filter((q) => bookmarkedQuotes.includes(q));

    if (selectedTags.length > 0) {
      filteredQuotes = filteredQuotes.filter((q) => selectedTags.every((tag) => q.tags.includes(tag)));
    }

    const sortOptions = {
      dateUsedRecent: (a, b) => new Date(b.usedDate || 0) - new Date(a.usedDate || 0),
      dateUsedOldest: (a, b) => new Date(a.usedDate || 0) - new Date(b.usedDate || 0),
      dateCreatedRecent: (a, b) => new Date(b.date) - new Date(a.date),
      dateCreatedOldest: (a, b) => new Date(a.date) - new Date(b.date),
    };

    filteredQuotes.sort(sortOptions[sortBy]);

    onFilterChange(filteredQuotes);
  }, [filter, selectedTags, sortBy, allQuotes, bookmarkedQuotes, userQuotes, onFilterChange]);

  useEffect(() => {
    if (allQuotes.length > 0) {
      updateFilteredQuotes();
    }
  }, [updateFilteredQuotes, allQuotes.length]); 

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div
      className="sidebar border-end p-4 shadow-sm"
      style={{
        maxWidth: "250px",
        position: "fixed",
        left: "0",
        height: "90vh",
        backgroundColor: "#FFFBEA",
      }}
    >
      <h3 className="h5 fw-bold mb-4">Filters</h3>
      {["public", "private", "uploaded", "bookmarked"].map((type) => (
        <button
          key={type}
          className={`btn w-100 text-start ${filter === type ? "fw-bold" : ""}`}
          style={{ background: "none", border: "none", padding: "10px 0" }}
          onClick={() => setFilter(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)} Quotes
        </button>
      ))}

      <div className="mb-4">
        <h4 className="h6 fw-bold mb-3">Most Used Tags</h4>
        <ul className="list-unstyled d-flex flex-wrap gap-2">
          {uniqueTags.map((tag) => (
            <li key={tag}>
              <button
                className={`btn btn-sm ${
                  selectedTags.includes(tag) ? "btn-success text-white" : "btn-outline-success"
                }`}
                onClick={() => toggleTag(tag)}
                style={{
                  borderRadius: "50px",
                  padding: "5px 15px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="h6 fw-bold mb-3">Sort by</h4>
        {["dateUsedRecent", "dateUsedOldest", "dateCreatedRecent", "dateCreatedOldest"].map((option) => (
          <label key={option} className="d-block">
            <input
              type="radio"
              name="sortBy"
              value={option}
              checked={sortBy === option}
              onChange={() => setSortBy(option)}
              className="form-check-input me-2"
            />
            {option.replace(/([A-Z])/g, " $1").replace("date", "Date").trim()}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
