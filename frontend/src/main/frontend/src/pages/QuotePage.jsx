import React, { useEffect, useState } from 'react';

// to get the quote_id from the URL
import { useParams } from 'react-router-dom'; 

const QuotePage = () => {
    // Get the quote ID from URL
  const { quote_id } = useParams(); 
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // Fetch the quote by quote_id from your backend
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quotes/${quote_id}`); 
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error('Error fetching the quote:', error);
      }
    };

    fetchQuote();
  }, [quote_id]);

  if (!quote) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{quote.text}</h1>
      <p>- {quote.author}</p>
      <div>
        {quote.tags && quote.tags.map((tag) => (
          <span key={tag} style={{ margin: '5px', padding: '5px', backgroundColor: '#e0f7fa' }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuotePage;
