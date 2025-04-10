package com.sharedQuotes;

import org.bson.codecs.pojo.annotations.BsonProperty;




public class SharedQuote {

    @BsonProperty("to")
    private String to;
    @BsonProperty("from")
    private String from;
    @BsonProperty("quoteId")
    private String quoteId;

    public SharedQuote(){
        
    }

    public String getTo(){
    return to;
    }

    public String getFrom(){
    return from;
    }
    
    public String getQuoteId(){
    return quoteId;
    }

    public void setTo(String to){
    this.to = to;
    }

    public void setFrom(String from){
    this.from = from;
    }

    public void setQuoteId(String quoteId){
    this.quoteId = quoteId;
    }

}
