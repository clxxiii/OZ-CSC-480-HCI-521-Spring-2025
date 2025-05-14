import { useState, useEffect } from "react";
import QuoteCard from "../components/QuoteCard";
import QuoteViewModal from "./QuoteViewModal";
import { fetchUserProfile } from "../lib/api";

const QuoteList = ({ topQuotes, loading, error, setShowLogin }) => {
  const [viewedQuote, setViewedQuote] = useState(null);
  const [viewedAuthorInfo, setViewedAuthorInfo] = useState(null);
  const [visibleQuotes, setVisibleQuotes] = useState(5);

  const closeView = () => {
    setViewedQuote(null);
    setViewedAuthorInfo(null);
  };

  const viewQuote = async (quote) => {
    setViewedQuote(quote);
    const creatorId = quote.creator?.$oid || quote.creator;
    if (creatorId) {
      try {
        const profile = await fetchUserProfile(creatorId);
        console.log("Fetched author profile:", profile); 
        setViewedAuthorInfo(profile);
      } catch {
        setViewedAuthorInfo(null);
      }
    } else {
      setViewedAuthorInfo(null);
    }
  };

  const handleViewMore = () => {
    setVisibleQuotes(topQuotes.length);
  };

  return (
    <>
      {viewedQuote && (
        <QuoteViewModal
          quote={viewedQuote}
          close={closeView}
          setShowLogin={setShowLogin}
          authorInfo={viewedAuthorInfo}
        />
      )}
      <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "24px", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <h1>Top Quotes</h1>
          {topQuotes.length > visibleQuotes && (
            <button className="rounded-button-style" onClick={handleViewMore}>
              View More
            </button>
          )}
        </div>
        <div className="d-flex w-100" style={{ gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          {loading ? (
            <p className="text-center w-100">Loading quotes...</p>
          ) : error ? (
            <p className="text-center w-100">{error}</p>
          ) : topQuotes.length > 0 ? (
            topQuotes.slice(0, visibleQuotes).map((quote) => (
              <QuoteCard
                key={quote._id}
                quote={quote}
                showViewModal={viewQuote}
                authorInfo={viewedAuthorInfo}
              />
            ))
          ) : (
            <p className="text-center w-100">No quotes found...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteList;
