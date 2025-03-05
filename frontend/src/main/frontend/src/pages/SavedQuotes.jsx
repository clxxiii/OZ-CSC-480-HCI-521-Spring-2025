import React, { useState, useEffect } from "react"; 
import QuoteCard from "../components/QuoteCard"; 
import Input from "../components/Input"; 
import { fetchMe, fetchTopBookmarkedQuotes, fetchUserQuotes } from "../lib/api"; 

const SavedQuotes = ({ userQuotes, bookmarkedQuotes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState([...userQuotes, ...bookmarkedQuotes]); //combine user and bookmarked quotes into a single list
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchMe();
        const userIdString = user._id.$oid || user._id; 
        setUserId(userIdString); 
        const userQuotes = await fetchUserQuotes(userIdString); 
        const topBookmarkedQuotes = await fetchTopBookmarkedQuotes();
        setQuotes([...userQuotes, ...topBookmarkedQuotes]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!userId) {
      fetchData();
    }
  }, [userId]);

  const handleSearch = (event) => {
    //update search term when user types in the input field
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleBookmarkToggle = (updatedQuote, isBookmarked) => {
    setQuotes((prevQuotes) => {
      if (isBookmarked) {
        return [...prevQuotes, updatedQuote];
      } else {
        return prevQuotes.filter((quote) => quote._id !== updatedQuote._id);
      }
    });
  };

  const filteredQuotes = quotes.filter(({ author, quote, tags, uploadedBy }) => {
    //filter quotes based on search term matching author, text, or tags
    return (
      uploadedBy === userId &&
      (author.toLowerCase().includes(searchTerm) ||
        quote.toLowerCase().includes(searchTerm) ||
        tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder="Search by tag, author, or keyword..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />
      <div className="row w-100">
        {filteredQuotes.length > 0 ? (
          //display filtered quotes if available, otherwise show a 'No quotes found' message
          filteredQuotes.map((quote) => (
            <QuoteCard key={quote._id} quote={quote} onBookmarkToggle={handleBookmarkToggle} />
          ))
        ) : (
          <p className="text-center w-100">No quotes found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedQuotes; //export the component for use in other parts of the app
