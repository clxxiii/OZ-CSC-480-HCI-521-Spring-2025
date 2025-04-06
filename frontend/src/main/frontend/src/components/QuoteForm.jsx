import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateQuote, deleteQuote } from "../lib/api";

const QuoteForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quote } = location.state || {};

    const [updateId, setUpdateId] = useState("");
    const [updateText, setUpdateText] = useState("");
    const [updateAuthor, setUpdateAuthor] = useState("");
    const [tags, setTags] = useState([]);
    const [customTag, setCustomTag] = useState("");
    const suggestedTags = ["Love", "Willpower", "Life", "Success"];
    const [updateIsPrivate, setUpdateIsPrivate] = useState(quote?.private ?? false);

    useEffect(() => {
        if (quote) {
            setUpdateId(quote._id);
            setUpdateText(quote.quote || "No Quote!");
            setUpdateAuthor(quote.author || "Unknown");
            setTags(quote.tags || []);
            setUpdateIsPrivate(quote.private);
        }
    }, [quote]);

    const toggleTag = (tag) => {
        setTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
        );
    };

    const addCustomTag = () => {
        if (customTag.trim() && !tags.includes(customTag)) {
            setTags([...tags, customTag.trim()]);
        }
        setCustomTag("");
    };

    const handleUpdateQuote = async (e) => {
        e.preventDefault();
        if (!updateId.trim()) return;

        const payload = {
            _id: updateId.trim(),
            author: updateAuthor || "Unknown",
            text: updateText || "No Quote!",
            tags,
            private: updateIsPrivate,
        };

        try {
            await updateQuote(payload);
            localStorage.setItem("alertMessage", "Quote updated successfully!");
            localStorage.setItem("alertType", "success");
            navigate("/");
        } catch (error) {
            console.error("Error updating quote:", error);
            localStorage.setItem("alertMessage", "Error updating quote.");
            localStorage.setItem("alertType", "danger");
        }
    };

    const handleDeleteQuote = async () => {
        if (!updateId.trim()) return;

        try {
            await deleteQuote(updateId);
            localStorage.setItem("alertMessage", "Quote deleted successfully!");
            localStorage.setItem("alertType", "success");
            navigate("/");
        } catch (error) {
            console.error("Error deleting quote:", error);
            localStorage.setItem("alertMessage", "Error deleting quote.");
            localStorage.setItem("alertType", "danger");
        }
    };

    return (
        <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: "#F8FDF1", borderRadius: "10px" }}>
                    {/* Header */}
                    <div
                        className="modal-header"
                        style={{
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            position: "relative",
                            textAlign: "center",
                            backgroundColor: "#F8FDF1",
                        }}
                    >
                        <h5 className="modal-title">Edit Quote</h5>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "10px",
                                backgroundColor: "#fff",
                                border: "1px solid rgba(180, 35, 24, 1)",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                color: "rgba(180, 35, 24, 1)",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* Quote */}
                        <div className="mb-3">
                            <label className="form-label" style={{ textAlign: "left" }}>Quote</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={updateText}
                                onChange={(e) => setUpdateText(e.target.value)}
                                placeholder="Enter your quote here"
                            />
                        </div>

                        {/* Author and Tags */}
                        <div className="d-flex mb-3" style={{ gap: "2rem" }}>
                            {/* Author */}
                            <div style={{ flex: 1 }}>
                                <label className="form-label" style={{ textAlign: "left" }}>Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={updateAuthor}
                                    onChange={(e) => setUpdateAuthor(e.target.value)}
                                    placeholder="Unknown"
                                />
                            </div>

                            {/* Tags */}
                            <div style={{ flex: 2 }}>
                                <label className="form-label" style={{ textAlign: "left" }}>Tags</label>
                                <div className="d-flex flex-wrap align-items-center" style={{ gap: "8px" }}>
                                    {!customTag ? (
                                        <button
                                            onClick={() => setCustomTag(" ")}
                                            className="border border-success rounded-pill px-3 py-1 text-success bg-white"
                                            style={{ fontSize: "14px" }}
                                        >
                                            + Add a new tag
                                        </button>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customTag}
                                            autoFocus
                                            onChange={(e) => setCustomTag(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") addCustomTag();
                                                else if (e.key === "Escape") setCustomTag("");
                                            }}
                                            onBlur={() => setCustomTag("")}
                                            placeholder="Enter tag"
                                            style={{
                                                maxWidth: "200px",
                                                borderRadius: "20px",
                                                padding: "6px 15px",
                                                fontSize: "14px",
                                            }}
                                        />
                                    )}
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="border bg-success text-white rounded-pill px-3 py-1 d-flex align-items-center"
                                            style={{ fontSize: "14px", cursor: "pointer", gap: "5px" }}
                                            onClick={() => toggleTag(tag)}
                                        >
                      #{tag} ✕
                    </span>
                                    ))}
                                    {suggestedTags.filter((tag) => !tags.includes(tag)).map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className="border rounded-pill px-3 py-1 border-success text-success bg-white d-flex align-items-center"
                                            style={{ fontSize: "14px", borderWidth: "1.5px", gap: "5px" }}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="mb-3">
                            <label className="form-label" style={{textAlign: "left", display: "block"}}>Visibility</label>
                            <div
                                className="d-flex align-items-center"
                                style={{
                                    border: "1px solid #000",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    display: "inline-flex",
                                    width: "fit-content",
                                    fontSize: "14px",
                                }}
                            >
                                <button
                                    type="button"
                                    className={`btn ${!updateIsPrivate ? "bg-success text-white" : "bg-white text-dark"}`}
                                    style={{
                                        border: "none",
                                        borderRadius: "0",
                                        padding: "7px 10px",
                                        flex: 1,
                                        fontWeight: !updateIsPrivate ? "bold" : "normal",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                    }}
                                    onClick={() => setUpdateIsPrivate(false)}
                                >
                                    {!updateIsPrivate && (
                                        <span
                                            style={{
                                                marginRight: "5px",
                                                fontSize: "10px",
                                            }}
                                        >
                    ✔
                </span>
                                    )}
                                    Public
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${updateIsPrivate ? "bg-success text-white" : "bg-white text-dark"}`}

                                    style={{
                                        border: "none",
                                        borderRadius: "0",
                                        padding: "7px 10px",
                                        // flex: 1,
                                        fontWeight: updateIsPrivate ? "bold" : "normal",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",

                                        flexGrow: 1,
                                    }}
                                    onClick={() => setUpdateIsPrivate(true)}
                                >
                                    {updateIsPrivate && (
                                    <span
                                        style={{
                                            marginRight: "5px",
                                            fontSize: "10px",
                                        }}
                                    >
                    ✔
                </span>
                                )}
                                    Private
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger me-2" onClick={handleDeleteQuote}>
                            Delete Quote
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleUpdateQuote} style={{ backgroundColor: "#146C43", borderColor: "#146C43" }}>
                            Save Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteForm;
