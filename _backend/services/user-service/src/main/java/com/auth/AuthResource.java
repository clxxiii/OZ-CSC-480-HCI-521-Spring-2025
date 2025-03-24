package com.auth;


import com.accounts.Account;
import com.accounts.AccountService;
import com.google.api.client.auth.oauth2.TokenResponseException;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.ibm.websphere.security.jwt.InvalidConsumerException;
import com.ibm.websphere.security.jwt.InvalidTokenException;
import com.ibm.websphere.security.jwt.JwtConsumer;
import com.ibm.websphere.security.jwt.JwtToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;


import java.io.*;
import java.net.URI;
import java.util.*;


import static com.mongodb.client.model.Filters.eq;


@Path("/auth")
public class AuthResource {


    public static AccountService accountService = new AccountService();
    public static SessionService sessionService = new SessionService();
    public static String HOME_URL = "http://localhost:9080";


    @GET
    @Produces(MediaType.APPLICATION_FORM_URLENCODED)
    @Path("/login")
    public Response login() throws IOException {
        String CLIENT_ID = System.getenv("CLIENT_ID");
        String CLIENT_SECRET = System.getenv("CLIENT_SECRET");
        String REDIRECT_URI = System.getenv("REDIRECT_URI");
        Collection<String> scopes = new ArrayList<>(List.of("https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"));
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(new NetHttpTransport(),
                GsonFactory.getDefaultInstance(), CLIENT_ID, CLIENT_SECRET, scopes).setAccessType("offline")
                .setDataStoreFactory(new FileDataStoreFactory(new File("tokens")))
                .build();
        String authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(REDIRECT_URI).setScopes(scopes).build();
        return Response.status(Response.Status.FOUND).location(URI.create(authorizationUrl)).build();
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/callback")
    public Response exchangeCode(@QueryParam("code") String code) throws IOException {
        String clientId = System.getenv("CLIENT_ID");
        String clientSecret = System.getenv("CLIENT_SECRET");
        String redirectUri = System.getenv("REDIRECT_URI");
        HttpTransport httpTransport = new NetHttpTransport();
        GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                httpTransport,
                GsonFactory.getDefaultInstance(),
                clientId,
                clientSecret,
                code,
                redirectUri).execute();
        System.out.println(tokenResponse);
        // got token where should we store next?


        // get user info
        HttpRequestFactory requestFactory = httpTransport.createRequestFactory();
        HttpRequest request = requestFactory
                .buildGetRequest(new GenericUrl("https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token="
                        + tokenResponse.getAccessToken()));
        HttpResponse response = request.execute();
        GoogleIdToken.Payload payload = new Gson().fromJson(response.parseAsString(), GoogleIdToken.Payload.class);


        Gson gson = new Gson();
        String jsonObject = gson.toJson(payload);
        JsonObject convertedObject = new Gson().fromJson(jsonObject, JsonObject.class);


        Account account = new Account(payload.getEmail(), convertedObject.get("name").getAsString(), 0,
                tokenResponse.getAccessToken(), tokenResponse.getRefreshToken(),
                tokenResponse.getExpiresInSeconds(), Arrays.asList(tokenResponse.getScope().split(" ")),
                tokenResponse.getTokenType());


        return accountService.newUserWithCookie(account);
    }

    @GET
    @Path("/checkJWT/{jwt}")
    public Response checkJWT(@PathParam("jwt") String jwt, @QueryParam("redirectURL") String url) {
        ArrayList<String> groups;
        String userId;
        try {
            JwtConsumer consumer = JwtConsumer.create("defaultJwtConsumer");
            JwtToken jwtToken = consumer.createJwt(jwt);

            groups = (ArrayList<String>) jwtToken.getClaims().get("groups");

            userId = jwtToken.getClaims().getSubject();

        } catch (InvalidConsumerException e) {
            System.out.println(e);
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"JwtConsumer is incorrectly configured\" }")
                    .build();
        } catch (InvalidTokenException e) {
            System.out.println(e);
            return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Invalid JWT\" }")
                    .build();
        }

        int admin;
        if (groups.get(0) == null) {
            return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Invalid JWT\" }")
                    .build();
        } else if (groups.get(0).equals("admin")) {
            admin = 1;
        } else {
            admin = 0;
        }

        Date expires = new Date(System.currentTimeMillis() + 21 * 24 * 60 * 60 * 1000);

        Date lastActivity = new Date(System.currentTimeMillis());

        Session session = new Session(userId, admin, expires, lastActivity);

        session.SessionId = new ObjectId();

        String sessionId = sessionService.createSession(session);

        NewCookie cookie = new NewCookie.Builder("SessionId")
                .value(sessionId)
                .path("/")
                .maxAge(21 * 24 * 60 * 60)
                .secure(true)
                .sameSite(NewCookie.SameSite.LAX)
                .httpOnly(true)
                .build();

        return Response.status(Response.Status.FOUND)
                .cookie(cookie)
                .location(URI.create(url))
                .build();

    }

    @GET
    @Path("/jwt")
    public Response getJWT(@CookieParam("SessionId") String sessionId) {
        if (sessionId == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Session expired. Please log in again.\" }")
                    .build();
        }

        Session session = sessionService.getSession(sessionId);
        if (session == null || session.Expires.before(new Date())) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Session expired. Please log in again.\" }")
                    .build();
        }

        //sliding expiration
        session.LastActivity = new Date(System.currentTimeMillis());
        session.Expires = new Date(session.LastActivity.getTime() + 21 * 24 * 60 * 60 * 1000);

        Boolean success = sessionService.updateSession(sessionId, session);

        if (success) {
            String jwt = JwtService.buildJwt(session.UserId).toString();

            NewCookie jwtCookie = new NewCookie.Builder("JWT")
                    .value(jwt)
                    .path("/")
                    .maxAge(300)
                    .secure(true)
                    .sameSite(NewCookie.SameSite.LAX)
                    .httpOnly(true)
                    .build();

            return Response.ok().cookie(jwtCookie).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    public String RefreshAccessToken(String refreshToken) throws IOException {
        String clientId = System.getenv("CLIENT_ID");
        String clientSecret = System.getenv("CLIENT_SECRET");
        String tokenUrl = System.getenv("REDIRECT_URI");
        GoogleTokenResponse tokenResponse = null;
        try {
            tokenResponse = new GoogleRefreshTokenRequest(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance(),
                    refreshToken,
                    clientId,
                    clientSecret).execute();
            return tokenResponse.toString();
        } catch (TokenResponseException e) {
            System.out.println("Refresh token error!");
        }
        return null;
    }
}
