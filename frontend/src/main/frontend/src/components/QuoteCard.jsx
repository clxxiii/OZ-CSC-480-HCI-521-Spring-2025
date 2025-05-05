import { useState, useEffect, useContext } from "react";
import { UserContext } from "../lib/Contexts";
import AlertMessage from "./AlertMessage";
import LoginOverlay from "./LoginOverlay";
import QuoteTags from "./QuoteTags";
import QuoteContent from "./QuoteContent";
import QuoteActions from "../buttons/QuoteActions";
import QuoteUseButton from "../buttons/QuoteUseButton";
import { fetchUserProfile } from "../lib/api";

const QuoteCard = ({ quote, onBookmarkToggle, showViewModal, onQuoteUsed }) => {
  const [user] = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [usedDate, setUsedDate] = useState(null);
  const [showAuthorPopup, setShowAuthorPopup] = useState(false);
  const [authorInfo, setAuthorInfo] = useState(null);

  useEffect(() => {
    const usedQuotes = JSON.parse(localStorage.getItem("usedQuotes")) || [];
    const usedQuote = usedQuotes.find((q) => q.id === quote._id);
    setUsedDate(usedQuote?.usedDate || null);
  
    const creatorId = quote.creator?.$oid || quote.creator;
    if (creatorId) {
      fetchUserProfile(creatorId)
        .then((profile) => {
          if (profile) {
            setAuthorInfo(profile);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch author info:", err);
        });
    }
  }, [quote]);
  

  const handleAuthorClick = () => {
    setShowAuthorPopup(true);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      style={{
        background: "#D6F0C2",
        borderRadius: "23px",
        border: "1px solid rgba(0, 0, 0, 0.10)",
        padding: "20px",
        width: "100%",
        maxWidth: "378px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        position: "relative",
        minHeight: "240px",
        cursor: "default",
      }}
    >
      <div onClick={() => showViewModal(quote)} style={{ flexGrow: 1 }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <QuoteTags tags={(quote.tags || []).slice(0, 3)} />
          {quote.tags && quote.tags.length > 3 && (
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#5A5A5A" }}>
              +{quote.tags.length - 3}
            </span>
          )}
        </div>

        <QuoteContent quote={quote} onAuthorClick={handleAuthorClick} />
      </div>

      {showLogin && <LoginOverlay setShowLogin={setShowLogin} />}

      <QuoteActions
        quote={quote}
        onBookmarkToggle={onBookmarkToggle}
        setShowLogin={setShowLogin}
        user={user}
      />

      {usedDate && (
        <div style={{ fontSize: "14px", fontStyle: "italic", color: "#5A5A5A" }}>
          Used on: {new Date(usedDate).toLocaleDateString()}
        </div>
      )}

      {user && <QuoteUseButton quote={quote} setShowLogin={setShowLogin} onQuoteUsed={onQuoteUsed} />}

      {showAuthorPopup && (
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      position: "absolute",
      inset: "0",
      backgroundColor: "#FFF9D6",
      borderRadius: "23px",
      padding: "30px 20px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <h3 style={{ fontWeight: "bold", margin: "0" }}>
      {authorInfo?.Username || quote.author}
    </h3>

    <p style={{ marginTop: "5px", color: "#5A5A5A", fontWeight: "600" }}>
  {authorInfo?.Profession?.trim() || "Not Set"}
</p>

<p style={{ fontStyle: "italic", color: "#5A5A5A", fontSize: "15px", marginTop: "16px", maxWidth: "90%" }}>
  “{authorInfo?.PersonalQuote?.trim() || "No personal quote provided."}”
</p>


    <div style={{ marginTop: "20px" }}>
      <button onClick={() => setShowAuthorPopup(false)} style={{ padding: "6px 14px", borderRadius: "6px" }}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default QuoteCard;
