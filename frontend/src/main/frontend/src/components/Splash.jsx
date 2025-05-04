import { useState } from "react"; //import useState to manage component state
import { useNavigate } from "react-router-dom"; //import useNavigate to navigate between pages
import searchSvg from "../assets/search.svg";
import Tag from "./Tag";
import { Funnel } from 'react-bootstrap-icons';
import FilteredSearch from '../components/FilteredSearch';

export default function Splash() {
  const [searchQuery, setSearchQuery] = useState(""); //store the user's search input
  const navigate = useNavigate(); //initialize navigation function for page redirection
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    filterUsed: false,
    filterBookmarked: false,
    filterUploaded: false,
    include: "",
    exclude: "",
  });


  const handleSearchRedirect = async () => {
    try {
      const query = searchQuery.trim() || "*";
  
      console.log("Filters passed to SearchPage:", selectedFilters); // Debugging filters before navigation
  
      navigate("/search?q=" + query, {
        state: {
          filterUsed: selectedFilters.filterUsed,
          filterBookmarked: selectedFilters.filterBookmarked,
          filterUploaded: selectedFilters.filterUploaded,
          include: selectedFilters.include,
          exclude: selectedFilters.exclude 
        }
      });
    } catch (error) {
      console.error("Error during search:", error);
    }
  };
  

  const handleFilteredSearch = (filterOptions) => {
    console.log("Filter options applied:", filterOptions);
    
    setSelectedFilters({
      filterUsed: filterOptions.includeUsed,
      filterBookmarked: filterOptions.includeBookmarked,
      filterUploaded: filterOptions.includeUploaded,
      include: filterOptions.includeTerm, 
      exclude: filterOptions.excludeTerm 
    });
  
    setIsFilterModalVisible(false);
  };
  
  
  const handleSearchChange = (e) => {
    //update the searchQuery state whenever the user types in the input field
    setSearchQuery(e.target.value);
  };

  const splashStyle = {
    //styling for the main splash section
    display: "flex",
    padding: "24px 0px",
    justifyContent: "center",
    alignItems: "center",
    gap: "60px",
    alignSelf: "stretch",
    borderRadius: "22px",
    background: "linear-gradient( rgba(214, 240, 194, 1), rgba(253, 247, 205, 1))",
  }

  const splashContainerStyle = {
    //styling for the inner content container
    display: "flex",
    padding: "24px 0px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flex: "1 0 0",
  }

  const splashH1Style = {
    //styling for the main heading
    color: "#1E1E1E",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "40px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "48px",
  }

  const splashH2Style = {
    //styling for the subheading
    color: "rgba(30, 30, 30, 0.45)",
    textAlign: "center",
    fontFamily: "Inter",
    maxWidth: "600px",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "normal",
  }

  const splashH3Style = {
    color: "#000",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "300",
    lineHeight: "22px", /* 110% */
  }


  const searchText = {
    color: "#FFF",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "24px", /* 120% */
  }

  const searchButton = {
    display: "flex",
    width: "240px",
    padding: "12px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    background: "#146C43"
  }

  return (
    <div style={splashStyle}>
      <div style={splashContainerStyle}>

        <h1 style={splashH1Style}>Find, Share & Save Quotes <span style={{ color: "#146C43" }}>Effortlessly</span></h1>
        <h2 style={splashH2Style}>Find insightful quotes from various authors and themes. Copy and paste with just one click</h2>
        <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "600px", position: "relative" }}>
          <img src={searchSvg} style={{ position: "absolute", left: "10px", height: "24px" }} alt="Search" />
          <input
            type="text"
            className="form-control"
            style={{
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "20px",
              padding: "12px 40px 12px 40px", // Extra padding on both sides
              width: "100%", // Ensure the input takes full width
            }}
            placeholder="Search quotes, authors, or themes..."
            onChange={handleSearchChange}
          />
          <Funnel
            size={24}
            style={{
              cursor: "pointer",
              color: "#146C43",
              position: "absolute",
              right: "10px",
            }}
            onClick={() => setIsFilterModalVisible(true)}
          />
        </div>

        <FilteredSearch
          isVisible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onFiltersApplied={(filters) => handleFilteredSearch(filters)}
        />

        <button className="btn" style={searchButton} onClick={handleSearchRedirect}>
          <span style={searchText}>Search</span>
        </button>

        <h3 style={splashH3Style}>Explore the following popular tags to get started:</h3>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Inspiration", "Love"].map((tag, i) => <Tag text={tag} key={i} />)}
        </div>

      </div>
    </div>
  )
}
