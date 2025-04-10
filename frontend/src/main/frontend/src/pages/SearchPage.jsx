import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard';
import { filteredSearch } from '../lib/api';
import FilteredSearch from '../components/FilteredSearch';
import { Funnel } from 'react-bootstrap-icons';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || "*";
    const include = location.state?.include || "";

    (async () => {
      try {
        const results = await filteredSearch(query === "*" ? "" : query, {
          filterUsed: false,
          filterBookmarked: false,
          filterUploaded: false,
          include: query === "*" ? "" : include,
          exclude: "",
        });
        setSearchResults(results);
        setError(null);
      } catch (err) {
        setSearchResults([]);
        setError("No quotes matched your search.");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, location.state]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Search Results</h1>
        <Funnel
          size={24}
          style={{ cursor: 'pointer', color: '#146C43' }}
          onClick={() => setIsFilterModalVisible(true)}
        />
      </div>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && searchResults.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {searchResults.map((quote) => (
            <div className="col" key={quote.id}>
              <QuoteCard quote={quote} />
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No quotes matched your search.</p>
      )}
      <FilteredSearch
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onSearch={(results) => {
          setSearchResults(results);
          setError(null);
        }}
      />
    </div>
  );
};

export default SearchPage;