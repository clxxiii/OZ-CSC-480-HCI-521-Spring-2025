package com.accounts;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.Invocation;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.client.MongoCollection;

import org.bson.Document;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.bind.*;
import com.accounts.AccountsResource;


import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Path("/bookmarks")
public class BookmarkResource {
      
    @Inject
    @RestClient
    private QuoteClient quoteClient;

   
    public static AccountService accountService = new AccountService();

    @POST
    @Path("/{userId}/{quoteId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Quote successfully bookmarked"),
            @APIResponse(responseCode = "400", description = "Invalid request"),
            @APIResponse(responseCode = "500", description = "Internal server error"),
    })
    @Operation(summary = "Bookmark a quote for a user", description = "This endpoint allows a user to bookmark a quote.")
    public Response bookmarkQuote(@PathParam("userId") String userId, @PathParam("quoteId") String quoteId) {
        Response res = accountService.retrieveUser(userId, false);
        String json = null;
         if (res.getStatus() == Response.Status.OK.getStatusCode()){
            String accString = res.readEntity(String.class);
            Document doc = Document.parse(accString);
            Account acc = accountService.document_to_account(doc);
            List<String> personalTags = new ArrayList<>();
            acc.FavoriteQuote.put(quoteId, personalTags);
            json = acc.toJson();
            Response quoteSearchRes = quoteClient.idSearch(quoteId);
            String quoteSearchString = quoteSearchRes.readEntity(String.class);
            Document quoteSearchDoc = Document.parse(quoteSearchString);
            int currentBookmarks = quoteSearchDoc.getInteger("bookmarks", 0);
            quoteSearchDoc.put("bookmarks", currentBookmarks + 1);
            Response quoteUpdateRes = quoteClient.updateQuote(quoteSearchDoc.toJson());
            if(quoteUpdateRes.getStatus()!=Response.Status.OK.getStatusCode()){
            return Response
            .status(Response.Status.BAD_GATEWAY)
            .entity("Failed to update quote")
            .build();
            }
           

         }
         return accountService.updateUser(json, userId);
    }


    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Quotes successfully retrieved"),
            @APIResponse(responseCode = "400", description = "Invalid request"),
            @APIResponse(responseCode = "500", description = "Internal server error"),
    })
    @Operation(summary = "Grab bookmarked quotes for a user", description = "This endpoint allows a user to get all bookmarks for a user")
    public Response getBookmarks(@PathParam("userId") String userId) {
        Response res = accountService.retrieveUser(userId, false);
        String json = null;
         if (res.getStatus() == Response.Status.OK.getStatusCode()){
            String accString = res.readEntity(String.class);
            Document doc = Document.parse(accString);
            Account acc = accountService.document_to_account(doc);
            List<JsonObject> jsonList = new ArrayList<>();
            for(String objectId: acc.FavoriteQuote.keySet()){
            Response quoteSearchRes = quoteClient.idSearch(objectId);
            JsonObject quoteSearchJson = quoteSearchRes.readEntity(JsonObject.class);
            
            jsonList.add(quoteSearchJson);
            }
            return Response
            .ok(jsonList).build();
     }
     return Response
     .status(Response.Status.BAD_REQUEST)
     .entity("Failed to update quote")
     .build();
    }

    @DELETE
    @Path("/delete/{userId}/{quoteId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Bookmark successfully deleted"),
            @APIResponse(responseCode = "400", description = "Invalid request"),
            @APIResponse(responseCode = "500", description = "Internal server error"),
    })
    @Operation(summary = "Delete a bookmark a for a user", description = "This endpoint allows a user to delete a bookmark")
    public Response deleteBookmark(@PathParam("userId") String userId, @PathParam("quoteId") String quoteId) {
        Response res = accountService.retrieveUser(userId, false);
        String json = null;
         if (res.getStatus() == Response.Status.OK.getStatusCode()){
            String accString = res.readEntity(String.class);
            Document doc = Document.parse(accString);
            Account acc = accountService.document_to_account(doc);
            acc.FavoriteQuote.remove(quoteId);
            json = acc.toJson();
            Response quoteSearchRes = quoteClient.idSearch(quoteId);
            String quoteSearchString = quoteSearchRes.readEntity(String.class);
            Document quoteSearchDoc = Document.parse(quoteSearchString);
            int currentBookmarks = quoteSearchDoc.getInteger("bookmarks", 0);
            quoteSearchDoc.put("bookmarks", currentBookmarks - 1);
            Response quoteUpdateRes = quoteClient.updateQuote(quoteSearchDoc.toJson());
            if(quoteUpdateRes.getStatus()!=Response.Status.OK.getStatusCode()){
            return Response
            .status(Response.Status.BAD_GATEWAY)
            .entity("Failed to delete bookmark")
            .build();
            }
           

         }
         return accountService.updateUser(json, userId);
    }

    @POST
    @Path("/tag/{userId}/{quoteId}/{bookmarkTag}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Bookmark tag added"),
            @APIResponse(responseCode = "400", description = "Invalid request"),
            @APIResponse(responseCode = "500", description = "Internal server error"),
    })
    @Operation(summary = "Allow users to add a custom tag to a bookmarked quote", description = "This endpoint allows to add a custom tag to a boomarked tag.")
    public Response addBookmarkTag(@PathParam("userId") String userId, @PathParam("quoteId") String quoteId,@PathParam("bookmarkTag") String bookmarkTag) {
        Response res = accountService.retrieveUser(userId, false);
        String json = null;
         if (res.getStatus() == Response.Status.OK.getStatusCode()){
            String accString = res.readEntity(String.class);
            Document doc = Document.parse(accString);
            Account acc = accountService.document_to_account(doc);
            acc.FavoriteQuote.get(quoteId).add(bookmarkTag);
            json = acc.toJson();
         }
         return accountService.updateUser(json, userId);
    }

    @DELETE
    @Path("/tag/{userId}/{quoteId}/{tagIndex}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Bookmark tag deleted"),
            @APIResponse(responseCode = "400", description = "Invalid request"),
            @APIResponse(responseCode = "500", description = "Internal server error"),
    })
    @Operation(summary = "Allow users to delete a custom tag of a bookmarked quote", description = "This endpoint allows delete their custom tag from a quote.")
    public Response deleteBookmarkTag(@PathParam("userId") String userId, @PathParam("quoteId") String quoteId,@PathParam("tagIndex") int tagIndex) {
        Response res = accountService.retrieveUser(userId, false);
        String json = null;
         if (res.getStatus() == Response.Status.OK.getStatusCode()){
            String accString = res.readEntity(String.class);
            Document doc = Document.parse(accString);
            Account acc = accountService.document_to_account(doc);
            acc.FavoriteQuote.get(quoteId).remove(tagIndex);
            json = acc.toJson();
         }
         return accountService.updateUser(json, userId);
    }

}
