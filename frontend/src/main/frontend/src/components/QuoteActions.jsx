import React, { useState } from "react";
import { BookmarkFill, Bookmark, Share, Flag, Clipboard } from "react-bootstrap-icons";
import { bookmarkQuote, deleteBookmark } from "../lib/api";

const QuoteActions = ({ quote, onBookmarkToggle, setAlert, setShowLogin }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(quote.bookmarks || 0);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();

    if (!setAlert) {
      setAlert({ type: "danger", message: "You must be signed in to bookmark" });
      setShowLogin(true);
      return;
    }

    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    setBookmarkCount((prevCount) =>
      newBookmarkState ? prevCount + 1 : prevCount - 1
    );

    try {
      let updatedQuote;
      if (newBookmarkState) {
        updatedQuote = await bookmarkQuote(quote._id);
      } else {
        await deleteBookmark(quote._id);
      }
      if (typeof onBookmarkToggle === "function") {
        onBookmarkToggle(updatedQuote || quote, newBookmarkState);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const otherUser = prompt("Enter the email to share this quote with:");
    if (otherUser) {
      alert(`Quote shared with ${otherUser}!`);
    }
  };

  const handleFlagClick = (e) => {
    e.stopPropagation();
    alert("Quote has been reported. Our team will review it shortly.");
  };

  const handleCopyClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(quote.quote).then(() => {
      setAlert({ type: "success", message: "Quote copied to clipboard!" });
    }).catch((error) => {
      console.error("Error copying quote:", error);
      setAlert({ type: "danger", message: "Failed to copy quote." });
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        display: "flex",
        gap: "12px",
      }}
    >
      <button
        onClick={handleBookmarkClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: isBookmarked ? "green" : "inherit",
        }}
      >
        {isBookmarked ? <BookmarkFill size={22} /> : <Bookmark size={22} />}
        <span
          style={{ fontSize: "14px", fontWeight: "500", color: "#5A5A5A" }}
        >
          {bookmarkCount}
        </span>
      </button>

      <button
        onClick={handleShareClick}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <Share size={22} />
      </button>

      <button
        onClick={handleFlagClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8B0000",
        }}
      >
        <Flag size={22} />
      </button>

      <button
        onClick={handleCopyClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#146C43",
        }}
        title="Copy Quote"
      >
        <Clipboard size={22} />
      </button>
    </div>
  );
};

export default QuoteActions;
