import React, { useState, useEffect } from 'react';

export default function QuoteForm(){

    const [quote, setQuote ] = useState();
    const [author, setAuthor ] = useState();

    // Quote Submiter Handler:
    const handleSubmission = (event) => {
        event.preventDefault();
        console.log("Quote: \"", quote, "\" - ", author); // For debugging and making sure I'm doing this right. 
    }

    return (
        <div>
            <h1> Quote Submission Form
                <form id="QuoteForm" onSubmit={handleSubmission}>
                    <h3>
                        <input
                            style={{marginTop:10}} 
                            id='Quote' 
                            type='text' 
                            placeholder='Quote?'
                            onChange={ (event) => setQuote(event.target.value)}
                        />            
                    </h3>
                    <h3>
                        <input 
                            style={{maringTop:10}} 
                            id="Author" 
                            type='text' 
                            placeholder="Author?"
                            onChange={ (event) => setAuthor(event.target.value)}
                        />          
                    </h3>
                    <h3>
                        <button 
                            type='submit'
                            style={{marginTop:10, background:'blue', color:'white'}}
                        >
                        Submit
                        </button>
                    </h3>
                </form>
            </h1>
        </div>
    );
}