import React, { useState, useEffect, useCallback } from "react";
import { BorderBottom, TextLeft, LayoutSidebar } from "react-bootstrap-icons";

const Sidebar = ({ userQuotes, bookmarkedQuotes, onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filter, setFilter] = useState("public");
  const [sortBy, setSortBy] = useState("dateUsedRecent");
  const [isOpen, setIsOpen] = useState(true);

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
      className={`d-flex flex-column border-end pt-2 pb-2 shadow-sm ${isOpen ? "flex-shrink-0" : ""}`}
      style={{
        width: isOpen ? "400px" : "0",
        backgroundColor: "#FDF7CD", 
        overflow: "hidden",
        transition: "width 0.3s ease",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      {/* Collapse Button */}
      <div className="d-flex justify-content-end">
        <button className="btn w-20" onClick={() => setIsOpen(!isOpen)}>
          <LayoutSidebar size={22}></LayoutSidebar>
        </button>
      </div>
      {isOpen && (
        <>
          {/* Uploaded Quotes with Sub-Filters */}
          <h3 className="h5 fw-bold ps-2 text-start" style={{ borderBottom: "1px solid black", width: "200px" }}>
            Uploaded Quotes
          </h3>
          {["public", "private"].map((type) => (
            <button
              key={type}
              className={`btn w-100 text-start ${filter === type ? "fw-bold" : ""}`}
              style={{ background: "none", border: "none", padding: "10px 15px" }}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Quotes {filter === type ? " ✔" : ""}
            </button>
          ))}

          <h3 className="h5 fw-bold ps-2 text-start" style={{ borderBottom: "1px solid black", width: "200px" }}>
            Bookmarked Quotes
          </h3>
          <button
            className={`btn w-100 text-start ${filter === "bookmarked" ? "fw-bold" : ""}`}
            style={{ background: "none", border: "none", padding: "10px 15px" }}
            onClick={() => setFilter("bookmarked")}
          >
            Bookmarked Quotes {filter === "bookmarked" ? " ✔" : ""}
          </button>

          <div className="mb-4 pt-2">
            <h4 className="h5 fw-bold mb-3 text-start ps-2" style={{ borderBottom: "1px solid black", width: "200px" }}>
              Most Used Tags
            </h4>
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

          {/* Sort By */}
          <div>
            <h4 className="h5 fw-bold mb-3 text-start ps-2" style={{ borderBottom: "1px solid black", width: "200px" }}>
              Sort by
            </h4>
            <h6 className="fw-bold mb-3 text-start ps-3">Date Used:</h6>
            {["dateUsedRecent", "dateUsedOldest"].map((option) => (
              <label key={option} className="d-block text-start ps-4">
                <input
                  className="visually-hidden-radio form-check-input me-2"
                  type="radio"
                  name="sortBy"
                  value={option}
                  checked={sortBy === option}
                  onChange={() => setSortBy(option)}
                />
                {option.replace(/([A-Z])/g, " $1").replace("date", "Date").trim()} {sortBy === option ? " ✔" : ""}
              </label>
            ))}
            <h6 className="fw-bold mb-3 text-start ps-3">Date Created:</h6>
            {["dateCreatedRecent", "dateCreatedOldest"].map((option) => (
              <label key={option} className="d-block text-start ps-4">
                <input
                  className="visually-hidden-radio form-check-input me-2"
                  type="radio"
                  name="sortBy"
                  value={option}
                  checked={sortBy === option}
                  onChange={() => setSortBy(option)}
                />
                {option.replace(/([A-Z])/g, " $1").replace("date", "Date").trim()} {sortBy === option ? "✔" : ""}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
