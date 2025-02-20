const QUOTE_SERVICE_URL = import.meta.env.VITE_QUOTE_SERVICE_URL || "http://localhost:9082";
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:9081";

export const createQuote = async ({ text, author, tags }) => {
  try {
    const quoteData = {
      text,
      author: author || "Unknown",
      date: new Date().toISOString().split("T")[0], 
      tags: tags || []
    };

    const response = await fetch(`${QUOTE_SERVICE_URL}/quotes/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteData),
    });

    if (!response.ok) throw new Error("Failed to create quote");
    return await response.json();
  } catch (error) {
    console.error("Error creating quote:", error);
  }
};


export const deleteQuote = async (quoteId) => {
  try {
    const response = await fetch(`${QUOTE_SERVICE_URL}/quotes/delete/${quoteId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete quote");
    return await response.json();
  } catch (error) {
    console.error("Error deleting quote:", error);
  }
};

export const reportQuote = async (reportData) => {
  try {
    const response = await fetch(`${QUOTE_SERVICE_URL}/quotes/report/id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteID: reportData.quoteID }),dy
    });
    if (!response.ok) throw new Error("Failed to report quote");
    return await response.json();
  } catch (error) {
    console.error("Error reporting quote:", error);
  }
};

export const searchQuotes = async (query, isQuoteID = false) => {
  try {
    const endpoint = isQuoteID
      ? `${QUOTE_SERVICE_URL}/quotes/search/id/${query}` 
      : `${QUOTE_SERVICE_URL}/quotes/search/query/${query}`; //Search by text

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to search quotes");
    return await response.json();
  } catch (error) {
    console.error("Error searching quotes:", error);
  }
};

export const updateQuote = async (quoteData) => {
  try {
    const response = await fetch(`${QUOTE_SERVICE_URL}/quotes/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteData),
    });
    if (!response.ok) throw new Error("Failed to update quote");
    return await response.json();
  } catch (error) {
    console.error("Error updating quote:", error);
  }
};

export const fetchTopBookmarkedQuotes = async () => {
  try {
    const response = await fetch(`${QUOTE_SERVICE_URL}/quotes/search/topBookmarked`);
    
    if (!response.ok) throw new Error("Failed to fetch top bookmarked quotes");

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return []; 
    }

    return data;
  } catch (error) {
    console.error("Error fetching top bookmarked quotes:", error);
    return []; //return an empty array in case of an error
  }
};

//user profile (From User Service)
export const fetchUserProfile = async (userId) => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

export const fetchTopSharedQuotes = async () => {
  try {
    const response = await fetch(`${QUOTE_SERVICE_URL}/quotes/search/topShared`);
    if (!response.ok) throw new Error("Failed to fetch top shared quotes");

    const data = await response.json();
    return data.length ? data : []; // empty array if no data
  } catch (error) {
    console.error("Error fetching top shared quotes:", error);
    return [];
  }
};
