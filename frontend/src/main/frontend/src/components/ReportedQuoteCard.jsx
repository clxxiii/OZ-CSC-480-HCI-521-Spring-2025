import React from "react";

const ReportedQuoteCard = ({ 
    quote, 
    author, 
    tags, 
    reportCount, 
    reportReasons, 
    onIgnore, 
    onDelete }) => {
    return (
        <div style={{ 
            backgroundColor: "#F8FFF5", 
            padding: "20px", 
            borderRadius: "16px", 
            width: "600px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            fontFamily: "Arial, sans-serif" ,
            textAlign:"left"
            }}
            >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "10px"
            }}
            >
                {tags.map((tag) => (
                    <span key={tag} style={{
                        border: "2px solid #26A65B",
                        borderRadius: "20px",
                        padding: "5px 15px",
                        color: "#26A65B",
                        fontWeight: "bold"
                    }}>
                        #{tag}
                    </span>
                ))}
            </div>

            {/* quote */}
            <p style={{
                fontSize: "20px",
                fontWeight: "500",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                marginBottom: "15px",
            }}>
                “{quote}”
            </p>

            {/* author */}
            <p style={{
                fontSize: "18px",
                marginBottom: "15px"
            }}>- {author}</p>

            {/* How many reported */}
            <p style={{
                color: "#A93D2D",
                fontWeight: "bold"
            }}>Reported: {reportCount}</p>

            {/* reasons */}
            <div style={{ marginTop: "10px" }}>
                <p style={{ fontWeight: "bold" , marginBottom: "8px"
                }}>Reported Reason(s)</p>
                <div style={{ 
                    backgroundColor: "white", 
                    border: "1px solid #ccc", 
                    borderRadius: "8px", 
                    padding: "10px" 
                    }}
                    >
                    {reportReasons.map((reason, index) => (
                        <div key={index}>{reason}</div>
                    ))}
                </div>
            </div>

            {/* buttons */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "20px",
                flexShrink: 0,
                }}
                >

                <button onClick={onIgnore} style={{ 
                    backgroundColor: "#D9D9D9", 
                    border: "none", 
                    borderRadius: "12px", 
                    padding: "10px 20px", 
                    fontWeight: "bold" 
                    }}>Ignore</button>

                <button
                    onClick={onDelete} style={{
                        backgroundColor: "#A93D2D",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        padding: "10px 20px",
                        fontWeight: "bold"
                }}>Delete</button>
            </div>
        </div>
    );
};

export default ReportedQuoteCard;