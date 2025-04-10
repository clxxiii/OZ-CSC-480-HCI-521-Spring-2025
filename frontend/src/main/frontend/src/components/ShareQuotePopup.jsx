import React, { useEffect, useRef, useState } from "react";

const ShareQuotePopup = ({ quote, onClose, onSend }) => {
    const [input, setInput] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const popupRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Live search users
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (input.trim() === "") {
                setFilteredUsers([]);
                setIsTyping(false);
                return;
            }

            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(input)}`);
                const data = await res.json();
                setFilteredUsers(data);
                setIsTyping(true);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        }, 300); // debounce

        return () => clearTimeout(delayDebounce);
    }, [input]);

    const toggleUser = (user) => {
        setSelectedUsers((prev) =>
            prev.some((u) => u.email === user.email)
                ? prev.filter((u) => u.email !== user.email)
                : [...prev, user]
        );
    };

    const handleSend = () => {
        selectedUsers.forEach((user) => onSend(user));
        onClose();
    };

    const copyLink = () => {
        const link = `${window.location.origin}/quote/${quote._id}`;
        navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
    };

    return (
        <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "12px",
                width: "280px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "#fff9d1",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: "8px 8px 0 0",
                    marginBottom: "10px",
                }}
            >
                Share this quote
            </div>

            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Search who to share with..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                    }}
                />
            </div>

            {/* Typing mode */}
            {isTyping ? (
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "8px" }}>
                    {filteredUsers.map((user) => (
                        <li
                            key={user.email}
                            onClick={() => toggleUser(user)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "6px",
                                borderRadius: "6px",
                                background: selectedUsers.some(u => u.email === user.email)
                                    ? "#e0f7fa"
                                    : "#fff",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee"
                            }}
                        >
                            <div
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: "#eee",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    marginRight: "10px",
                                }}
                            >
                                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: "bold" }}>{user.name}</div>
                                <div style={{ fontSize: "12px", color: "#888" }}>{user.title || user.email}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <hr />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            marginTop: "8px",
                            gap: "6px",
                            fontWeight: "bold",
                            color: "#007bff"
                        }}
                        onClick={copyLink}
                    >
                        <span style={{ background: "#e3fce1", borderRadius: "50%", padding: "4px" }}>
                            🔗
                        </span>
                        Copy Link
                    </div>
                </>
            )}

            {selectedUsers.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                    {selectedUsers.map(user => (
                        <div
                            key={user.email}
                            style={{
                                background: "#d0f0ff",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                            }}
                        >
                            {user.name}
                            <span
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                                onClick={() => toggleUser(user)}
                            >
                    ×
                </span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ShareQuotePopup;
