package com.auth;
import com.google.api.client.auth.oauth2.RefreshTokenRequest;
import com.google.api.client.auth.oauth2.TokenResponseException;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.validation.Payload;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.*;
import java.net.URI;
import java.net.URL;
import java.util.*;

@Path("/")
public class AuthResource{
    private static Dotenv dotenv = Dotenv.configure()
                .directory("/Users/sakshyam/IdeaProjects/OZ-CSC-480-HCI-521-Spring-2025/_backend/services/user-service/src/main/liberty/config")
                .filename(".env").load();


        @GET
        @Produces(MediaType.APPLICATION_FORM_URLENCODED)
        @Path("/login")
        public Response login() throws IOException {
            String CLIENT_ID = dotenv.get("CLIENT_ID");
            String CLIENT_SECRET = dotenv.get("CLIENT_SECRET");
            String REDIRECT_URI = dotenv.get("REDIRECT_URI");
            Collection<String> scopes = new ArrayList<>(List.of("https://www.googleapis.com/auth/userinfo.email"));
            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance(), CLIENT_ID, CLIENT_SECRET, scopes).setAccessType("offline")
                    .setDataStoreFactory(new FileDataStoreFactory(new File("tokens")))
                    .build();
            String authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(REDIRECT_URI).setScopes(scopes).build();
            return Response.status(Response.Status.FOUND).location(URI.create(authorizationUrl)).build();
        }

        @GET
        @Produces(MediaType.APPLICATION_JSON)
        @Path("/callback")
        public Response exchangeCode(@QueryParam("code") String code) throws IOException {
            String clientId = dotenv.get("CLIENT_ID");
            String clientSecret = dotenv.get("CLIENT_SECRET");
            String redirectUri = dotenv.get("REDIRECT_URI");
            HttpTransport httpTransport = new NetHttpTransport();
            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                    httpTransport,
                    GsonFactory.getDefaultInstance(),
                    clientId,
                    clientSecret,
                    code,
                    redirectUri
            ).execute();
            System.out.println(tokenResponse);
            //got token where should we store next?


            //get user info
            HttpRequestFactory requestFactory = httpTransport.createRequestFactory();
            HttpRequest request = requestFactory.buildGetRequest(new GenericUrl("https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=" + tokenResponse.getAccessToken()));
            HttpResponse response = request.execute();
            GoogleIdToken.Payload payload = new Gson().fromJson(response.parseAsString(), GoogleIdToken.Payload.class);
            return Response.ok().entity(payload).build();
        }


        public String RefreshAccessToken(String refreshToken) throws IOException {
            String clientId = dotenv.get("CLIENT_ID");
            String clientSecret = dotenv.get("CLIENT_SECRET");
            String tokenUrl = dotenv.get("REDIRECT_URI");
            GoogleTokenResponse tokenResponse = null;
            try {
                tokenResponse = new GoogleRefreshTokenRequest(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance(),
                        refreshToken,
                        clientId,
                        clientSecret
                ).execute();
                return tokenResponse.toString();
            }catch (TokenResponseException e){
                System.out.println("Refresh token error!");
            }
            return null;
        }
}
