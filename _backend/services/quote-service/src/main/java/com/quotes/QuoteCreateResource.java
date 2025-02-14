package com.quotes;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;

import java.io.IOException;

@Path("/create")
public class QuoteCreateResource {

    @Inject
    MongoUtil mongo;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createQuote(String rawJson) {
        try{
            //map json to Java Object
            ObjectMapper objectMapper = new ObjectMapper();
            QuoteObject quote = objectMapper.readValue(rawJson, QuoteObject.class);

            ObjectId newQuoteId = mongo.createQuote(quote); //add to mongo database

            if(newQuoteId != null) {
                return Response.ok(newQuoteId.toHexString()).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST).entity("Something went wrong. Returned QuoteID null. Check json is formatted Correctly").build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).entity("Exception occured: "+e).build();
        }
    }
}
