package com.quotes;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;

@Path("/search")
public class QuoteSearchResource {

    @Inject
    MongoUtil mongo;

    @GET
    @Path("/id/{quoteID}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response stringSearch(@PathParam("quoteID") String quoteID) {
        try {
            ObjectId objectId = new ObjectId(quoteID);
            String jsonQuote = mongo.getQuote(objectId);

            if(jsonQuote != null) {
                return Response.ok(jsonQuote).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("Returned Json was null. Check quote ID is correct").build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Error: Invalid ObjectID format").build();
        }
    }

    @GET
    @Path("/query/{query}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response advancedSearch(@PathParam("query") String query) {
        try{
            String result = mongo.searchQuote(query);
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.CONFLICT).entity("Exception Occured: "+e+" you have an obligation to annoy engine team").build();
        }
    }

    @GET
    @Path("/topBookmarked")
    public Response getTopBookmarks() {
        try{
            String result = mongo.getTopBookmarked();
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.CONFLICT).entity("Exception Occurred: "+e+": pester engine team").build();
        }
    }

    @GET
    @Path("/topShared")
    public Response getSharedBookmarked() {
        try{
            String result = mongo.getTopShared();
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.CONFLICT).entity("Exception Occurred: "+e+": pester engine team").build();
        }
    }
}
