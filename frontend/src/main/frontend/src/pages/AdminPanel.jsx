import React, { useEffect, useState } from "react";
import { fetchReportedQuotes } from "../lib/api";
import QuoteCardAdmin from "../components/QuoteCardAdmin";
import { useMemo } from "react";

export default function AdminPanel() {
  const [rawReports, setRawReports] = useState([]);

  useEffect(() => {
    fetchReportedQuotes()
      .then((reports) => setRawReports(reports))
      .catch((err) => console.error(err));
  }, []);

  const mergedReports = useMemo(() => {
    const filtered = rawReports.filter((r) => r.quote);

    const map = new Map();

    filtered.forEach((r) => {
      const id = r.quote._id;
      if (!map.has(id)) {
        map.set(id, {
          quote:        r.quote,
          reportCount:  r.reporter_ids.length,
          reportReasons: [...r.context_types],
        });
      } else {
        const existing = map.get(id);
        existing.reportCount += r.reporter_ids.length;
        existing.reportReasons = Array.from(
          new Set([...existing.reportReasons, ...r.context_types])
        );
      }
    });

    return Array.from(map.values());
  }, [rawReports]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {mergedReports.map(({ quote, reportCount, reportReasons }) => (
          <QuoteCardAdmin
            key={quote._id}
            quote={quote}
            reportCount={reportCount}
            reportReasons={reportReasons}
          />
        ))}
      </div>
    </div>
  );
}

