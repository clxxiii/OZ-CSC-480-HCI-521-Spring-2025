import { useState, useEffect, useContext } from "react";
import QuoteCard from "../components/QuoteCard";
import Input from "../components/Input";
import { fetchQuoteById, fetchUserQuotes } from "../lib/api";
import { UserContext } from "../lib/Contexts";

const SavedQuotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedQuotes, setUploadedQuotes] = useState([]);
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState([]);
  const [viewUploaded, setViewUploaded] = useState(false); // false = bookmarked, true = uploaded
  const [user] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const userQuotes = await fetchUserQuotes(user._id.$oid);
        const bookmarked = await Promise.all(
          user.BookmarkedQuotes.map((id) => fetchQuoteById(id))
        );

        setUploadedQuotes(userQuotes);
        setBookmarkedQuotes(bookmarked);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleBookmarkToggle = (updatedQuote, isBookmarked) => {
    if (isBookmarked) {
      setBookmarkedQuotes((prev) => [...prev, updatedQuote]);
    } else {
      setBookmarkedQuotes((prev) =>
        prev.filter((q) => q._id !== updatedQuote._id)
      );
    }
  };

  const activeQuotes = viewUploaded ? uploadedQuotes : bookmarkedQuotes;

  const filteredQuotes = activeQuotes.filter(
    ({ author, quote, tags }) =>
      author.toLowerCase().includes(searchTerm) ||
      quote.toLowerCase().includes(searchTerm) ||
      tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder="Search by tag, author, or keyword..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      {/* Toggle Switch */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
        <span className={viewUploaded ? "text-muted" : "fw-bold"}>Bookmarked</span>
        <div
          onClick={() => setViewUploaded(!viewUploaded)}
          style={{
            width: "50px",
            height: "26px",
            borderRadius: "13px",
            backgroundColor: viewUploaded ? "#5AD478" : "#ccc",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              backgroundColor: "white",
              borderRadius: "50%",
              position: "absolute",
              top: "2px",
              left: viewUploaded ? "26px" : "2px",
              transition: "left 0.3s",
            }}
          />
        </div>
        <span className={viewUploaded ? "fw-bold" : "text-muted"}>Uploaded</span>
      </div>

      <div className="row w-100 gap-4">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote._id}
              quote={quote}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))
        ) : (
          <p className="text-center w-100">No quotes found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedQuotes;
