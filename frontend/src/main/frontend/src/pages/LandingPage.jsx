import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import QuoteCard from "../components/QuoteCard";
import QuoteUploadModal from "../components/QuoteUploadModal";
import LoginBox from "../components/Login";
import { fetchTopBookmarkedQuotes } from "../lib/api";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [quoteText, setQuoteText] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [quotes, setQuotes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        console.log("Fetching top bookmarked quotes..."); 
        const data = await fetchTopBookmarkedQuotes();
        console.log("Fetched Quotes:", data);
        if (!data || data.length === 0) {
          setError("No quotes yet! Try adding your own");
        } else {
          setQuotes(data);
        }
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError("Failed to load quotes");
      } finally {
        setLoading(false);
      }
    };
    loadQuotes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSavedQuotesRedirect = () => {
    navigate("/saved-quotes");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUploadQuote = () => {
    if (isLoggedIn) {
      setShowModal(true); 
    } else {
      navigate("/login"); 
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9081/users/auth/login";
  };

  const handleGuestLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleSubmitQuote = (quoteText) => {
    alert(`Quote Submitted: ${quoteText}`);
    setShowModal(false); 
  };

  const filteredQuotes = quotes.filter((quote) => {
    return (
      (quote.author && quote.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quote.quote && quote.quote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quote.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  return (
    <div className="container vh-100 d-flex flex-column position-relative">
      {showLogin && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}>
          <div className="bg-white p-4 rounded shadow-lg">
            <LoginBox handleGoogleLogin={handleGoogleLogin} handleGuestLogin={handleGuestLogin} handleCloseLogin={handleCloseLogin} />
          </div>
        </div>
      )}
      
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "33vh" }}>
        <h1 className="mb-3">Quote Web App</h1>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter keyword, author, or tag..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter your own quote and press enter"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleUploadQuote(); 
            }
          }}
        />

        <button className="btn btn-primary mt-3" onClick={handleSavedQuotesRedirect}>
          View Saved Quotes
        </button>
      </div>

      <QuoteUploadModal
        isVisible={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuote}
        quoteText={quoteText}
        setQuoteText={setQuoteText}
      />

      <div className="flex-grow-1 d-flex justify-content-center">
        <div className="row w-100">
          {loading ? (
            <p className="text-center w-100">Loading quotes...</p>
          ) : error ? (
            <p className="text-center w-100">{error}</p>
          ) : filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote) => (
              <QuoteCard key={quote._id} quote={quote} />
            ))
          ) : (
            <p className="text-center w-100">No quotes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
