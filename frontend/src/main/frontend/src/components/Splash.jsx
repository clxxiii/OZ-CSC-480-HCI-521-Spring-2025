import React, { useState } from "react"; //import useState to manage component state
import { useNavigate } from "react-router-dom"; //import useNavigate to navigate between pages
import searchSvg from "../assets/search.svg"
import quote from "./QuoteCard"

export default function Splash() {

  const [searchQuery, setSearchQuery] = useState(""); //store the user's search input
  const navigate = useNavigate(); //initialize navigation function for page redirection

  const handleSearchRedirect = () => {
    //redirect to the search page with the query as a URL parameter
    navigate("/search?q=" + searchQuery);
  };

  const handleSearchChange = (e) => {
    //update the searchQuery state whenever the user types in the input field
    setSearchQuery(e.target.value);
  };

  const splashStyle = {
    //styling for the main splash section
    display: "flex",
    padding: "80px 120px",
    justifyContent: "center",
    alignItems: "center",
    gap: "60px",
    alignSelf: "stretch",
    background: "linear-gradient( #D6F0C2,#FDF7CD)"
  }

  const splashContainerStyle = {
    //styling for the inner content container
    display: "flex",
    padding: "24px 0px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    flex: "1 0 0",
  }

  const tags = {
    display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FDF4",
        border: "2px solid #14AE5C",
        color: "black",
        borderRadius: "999px",
        padding: "6px 14px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Arial, sans-serif",
  }

  const splashH1Style = {
    //styling for the main heading
    color: "#1E1E1E",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "48px",
    fontStyle: "normal",
    fontWeight: "800",
    lineHeight: "48px",
  }
  
  const splashH2Style = {
    //styling for the subheading
    color: "rgba(30, 30, 30, 0.45)",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "24px",
  }

  return (
      <div style={splashStyle}>
        <div style={splashContainerStyle}>

          <h1 style={splashH1Style}>Find, Share & Save Quotes <span style={{color: "#146C43"}}>Effortlessly</span></h1>
        <h2 style={splashH2Style}>Find insightful quotes from various authors and themes. Copy and paste with just one click</h2>
            <div>
                <input
                    type="text"
                    className="form-control"
                    style={{
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontWeight: "400",
                        lineHeight: "20px",
                        width: "708px",
                        padding: "12px 20px 12px 40px",

                    }}
                    placeholder="Search quotes, authors, or themes..."
                    onChange={handleSearchChange} //update the searchQuery state when input changes
                />
                <form>
                    <input type="text" name="search" placeholder="Search.."/>
                </form>
            </div>


            <button className="btn btn-dark" style={{width: "240px", padding: "12px", backgroundColor:"#146C43"}} onClick={handleSearchRedirect}>
          Search
        </button>

          <p style={{fontSize: "20px" ,color:"rgba(0, 0, 0, 1)"}}>Explore the following popular tags to get started:</p>
          {/* Tags */}
          <div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {/*{quote.tags?.map((tag, index) => (*/}
                <div
                    // key={index}
                   style={tags}
                >
                  #Inspiration
                    {/*#{tag}*/}
                </div>
                <div style={tags}>#Love</div>
            {/*))}*/}
          </div>
          </div>
        </div>
      </div>
  )
}
