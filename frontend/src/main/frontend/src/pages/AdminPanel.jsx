import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchReportedQuotes } from "../lib/api";
import SidebarAdmin from "../components/SidebarAdmin";
import QuoteCardAdmin from "../components/QuoteCardAdmin";



const AdminPanel = () => {
  const [rawReports, setRawReports] = useState([]);
  const [loading, setLoading] = useState(true); 

  //states for sorting

  //controls whether we are showing the sidebar filtered list
  const [showFiltered, setShowFiltered] = useState(false);

  //capture list of filtered reports from the sidebar
  const [filteredQuotes, setFilteredQuotes] = useState([]);

  //keeping track of selected tags
  const [_, setSelectedTags] = useState([]);

  // fetching all reported quotes once on mount
  useEffect(() => {
    fetchReportedQuotes()
      .then((reports) => setRawReports(reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mergedReports = useMemo(() => {
    const map = new Map();

    rawReports
      .filter((r) => r.quote)
      .forEach((r) => {
        const id = r.quote._id;
        const splitReasons = r.context_types
          .flatMap((ct) => ct.split(","))
          .map((reason) => reason.trim());

        if (!map.has(id)) {
          map.set(id, {
            quote: r.quote,
            reportCount: r.reporter_ids.length,
            reportReasons: splitReasons,
          });
        } else {
          const existing = map.get(id);
          existing.reportCount += r.reporter_ids.length;
          existing.reportReasons = Array.from(
            new Set([...existing.reportReasons, ...splitReasons])
          );
        }
      });

    return Array.from(map.values());
  }, [rawReports]);

  // memoized handler for sidebar filters
  const handleFilterChange = useCallback(
      (selectedReportFrequency, selectedReportCreated, tags) => {
        setShowFiltered(true);

        let out = [...mergedReports];

        // filter by tag
        if (tags.length) {
          out = out.filter((r) =>
              tags.some((tag) => r.reportReasons.includes(tag))
          );
        }

      // sort by frequency
      if (selectedReportFrequency === "Most Reported") {
        out.sort((a, b) => b.reportCount - a.reportCount);
      } else if (selectedReportFrequency === "Least Reported") {
        out.sort((a, b) => a.reportCount - b.reportCount);
      }

      // sort by created date
      if (selectedReportCreated === "Recent Reports") {
        out.sort((a, b) => new Date(b.quote.date) - new Date(a.quote.date));
      } else if (selectedReportCreated === "Oldest Reports") {
        out.sort((a, b) => new Date(a.quote.date) - new Date(b.quote.date));
      }

      setFilteredQuotes(out);
    },
    [mergedReports]
  );

  // memoized handler for tag selection
  const handleTagSelect = useCallback((tags) => {
    setSelectedTags(tags);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <SidebarAdmin
          onFilterChange={handleFilterChange}
          onTagSelect={handleTagSelect}
        />

        <div style={{ flex: 1 }}>
          {loading ? ( 
            <p>Loading...</p>
          ) : (
            (showFiltered ? filteredQuotes : mergedReports).length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  rowGap: "20px", 
                }}
              >
                {(showFiltered ? filteredQuotes : mergedReports).map(
                  ({ quote, reportCount, reportReasons }) => (
                    <QuoteCardAdmin
                      key={quote._id}
                      quote={quote}
                      reportCount={reportCount}
                      reportReasons={reportReasons}
                    />
                  )
                )}
              </div>
            ) : (
              <p>No reports found based on the selected filters.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

