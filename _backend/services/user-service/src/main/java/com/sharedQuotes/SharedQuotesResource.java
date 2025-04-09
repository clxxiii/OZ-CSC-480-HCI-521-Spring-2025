package com.sharedQuotes;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.accounts.Account;
import com.accounts.AccountService;
import com.accounts.QuoteClient;

import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/sharedQuotes")
public class SharedQuotesResource {
    
    @Inject
    @RestClient
    private QuoteClient quoteClient;

    public static AccountService accountService = new AccountService();

    @POST
    @Path("/share/{userId}/{quoteId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Quote successfully shared"),
            @APIResponse(responseCode = "400", description = "Invalid request"),
            @APIResponse(responseCode = "401", description = "Unauthorized"),
            @APIResponse(responseCode = "500", description = "Internal server error"),
    })
    @Operation(summary = "Share a quote with a user", description = "This endpoint allows a user to share quotes.")
    public Response shareQuote(
    @PathParam("quoteId") String quoteId,
    @PathParam("userId") String userId,
    @Context HttpHeaders headers) {

        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new Document("error", "Missing or invalid Authorization header").toJson())
                    .build();
        }

        String jwtString = authHeader.replaceFirst("(?i)^Bearer\\s+", "");
    
      Response searchUserTo = accountService.retrieveUser(userId, false);
      if(searchUserTo.getStatus()!=Response.Status.OK.getStatusCode()){
        return Response.status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "No user found with that id").toJson())
                    .build();
      }
      String userToString = searchUserTo.readEntity(String.class);
      Document docTo = Document.parse(userToString);
      docTo.remove("expires_at");

            Document docFrom = accountService.retrieveUserFromJWT(jwtString);
            docFrom.remove("expires_at");
            Account accFrom = accountService.document_to_account(docFrom);
            String fromId = accountService.getAccountIdByEmail(accFrom.Email);
            Account accTo = accountService.document_to_account(docTo);
    
            Response quoteSearchRes = quoteClient.idSearch(quoteId);
            if(quoteSearchRes.getStatus()==Response.Status.OK.getStatusCode()){
            String quoteSearchString = quoteSearchRes.readEntity(String.class);
            Document quoteSearchDoc = Document.parse(quoteSearchString);
            Boolean priv = quoteSearchDoc.getBoolean("private");
            if(priv){
                if(!quoteSearchDoc.getObjectId("creator").toString().equals(fromId)){
                    return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new Document("error", "You can't share this it's private").toJson())
                    .build();
                }
            }
            SharedQuote shared = new SharedQuote();
            shared.setTo(userId);
            shared.setFrom(fromId);
            shared.setQuoteId(quoteId);
            accTo.SharedQuotes.add(shared);
            accFrom.SharedQuotes.add(shared);
            String toJson = accTo.toJson();
            String fromJson = accFrom.toJson();
            Response updateTo = accountService.updateUser(toJson, userId);
            Response updateFrom = accountService.updateUser(fromJson, fromId);
            if(updateTo.getStatus()!=Response.Status.OK.getStatusCode()){
                return updateTo;
            }   
            if(updateFrom.getStatus()!=Response.Status.OK.getStatusCode()){
                return updateFrom;
            }   
            return Response.ok().entity(shared).build();
            }
            else{
                return Response.status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "No quote found with that id").toJson())
                    .build();
            }
         
    }
}
