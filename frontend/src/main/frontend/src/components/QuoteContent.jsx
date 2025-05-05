import React from "react";

const QuoteContent = ({ quote, onAuthorClick }) => {
  const quoteTextStyle = {
    color: "#1E1E1E",
    fontFamily: "Inter",
    textAlign: "left",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "normal",
    marginTop: "10px",
  };

  const authorTextStyle = {
    color: "#5A5A5A",
    fontWeight: "bold",
    marginTop: "10px",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      <span style={quoteTextStyle}>{'"' + truncateText(quote.quote, 90) + '"'}</span>
      <span style={authorTextStyle} onClick={(e) => {
        e.stopPropagation();
        onAuthorClick();
      }}>
        — {quote.author}
      </span>
    </div>
  );
};

export default QuoteContent;
