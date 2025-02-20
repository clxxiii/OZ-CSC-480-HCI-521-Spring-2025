package com.accounts;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObjectBuilder;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.jwt.Claim;

import java.security.Principal;

@Path("/accounts")
public class AccountsResource {

    public static AccountService accountService = new AccountService();


    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(String json) {
        return accountService.newUser(json);
    }

    @GET
    @Path("/search/{id}")
    public Response search(@PathParam("id") String id) {
        return accountService.retrieveUser(id, true);
    }

    @DELETE
    @Path("/delete/{id}")
    public Response delete(@PathParam("id") String id) {
        return accountService.deleteUser(id);
    }

    @PUT
    @Path("/update/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") String id, String accountJson) {
        return accountService.updateUser(accountJson, id);
    }

    @GET
    @Path("/admin")
    @Produces(MediaType.TEXT_PLAIN)
    @RolesAllowed("admin")
    public Response adminOnly() {
        return Response.ok("Access granted to admin").build();
    }

    @GET
    @Path("/whoami")
    @Produces(MediaType.APPLICATION_JSON)
    public Response whoAmI(@Context SecurityContext securityContext) {
        JsonObjectBuilder json = Json.createObjectBuilder();
        Principal user = securityContext.getUserPrincipal();

        if (user != null) {
            json.add("user", user.getName());
            json.add("isAdmin", securityContext.isUserInRole("admin"));
            json.add("isUser", securityContext.isUserInRole("user"));
            json.add("roles", Json.createArrayBuilder()
                    .add(securityContext.isUserInRole("admin") ? "admin" : "")
                    .add(securityContext.isUserInRole("user") ? "user" : ""));
        } else {
            json.add("error", "Not authenticated");
        }

        return Response.ok(json.build()).build();
    }

    @GET
    @Path("/debug")
    @Produces(MediaType.APPLICATION_JSON)
    public Response debugJwt(@Context SecurityContext securityContext) {
        Principal user = securityContext.getUserPrincipal();
        JsonObjectBuilder json = Json.createObjectBuilder();

        if (user != null) {
            json.add("user", user.getName());
            json.add("rolesDetected", securityContext.isUserInRole("admin") ? "admin" : "none");
            json.add("test", securityContext.getUserPrincipal().toString());
            json.add("email", securityContext.getUserPrincipal().getName());
        } else {
            json.add("error", "JWT not recognized");
        }

        return Response.ok(json.build()).build();
    }


}
