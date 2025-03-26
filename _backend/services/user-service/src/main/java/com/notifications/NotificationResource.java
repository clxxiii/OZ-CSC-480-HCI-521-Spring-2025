package com.notifications;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonWriter;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.ExampleObject;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.FindIterable;

import java.io.StringReader;
import java.io.StringWriter;

@Path("/notifications")
public class NotificationResource {
    
    private static MongoClient mongoClient;
    private static MongoDatabase database;
    private static MongoCollection<Document> notificationsCollection;
    
    static {
        mongoClient = MongoClients.create(System.getenv("CONNECTION_STRING"));
        database = mongoClient.getDatabase("Accounts");
        notificationsCollection = database.getCollection("Notifications");
    }

    @GET
    @Path("/user/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Successfully found and returned user's notifications"),
            @APIResponse(responseCode = "400", description = "Given ID is not a valid ObjectId"),
            @APIResponse(responseCode = "409", description = "Exception occurred during operation")
    })
    @Operation(summary = "Get all notifications for a specific user", 
              description = "Returns JSON of all notifications where the user is the recipient, enter ID of user recieving notifications")
    public Response getNotificationsForUser(@PathParam("userId") String userId) {
        try {
            if(!isValidObjectId(userId)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Given ID is not a valid ObjectId")
                        .build();
            }
            ObjectId objectId = new ObjectId(userId);
            String jsonNotifications = getNotificationsByUser(objectId);
            return Response.ok(jsonNotifications).build();
        } catch (Exception e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Exception Occurred: " + e)
                    .build();
        }
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "201", description = "Notification successfully created"),
            @APIResponse(responseCode = "400", description = "Invalid input data"),
            @APIResponse(responseCode = "409", description = "Exception occurred during operation")
    })
    @Operation(summary = "Create a new notification")
    @RequestBody(
    content = @Content(
        mediaType = MediaType.APPLICATION_JSON,
        schema = @Schema(type = SchemaType.OBJECT),
        examples = {
            @ExampleObject(
                name = "notification Example", 
                summary = "example notification data",
                value = "{\n" +
                        "  \"from\": \"example_from_id\",\n" +
                        "  \"to\": \"example_to_id\",\n" +
                        "  \"type\": \"example_type\",\n" +
                        "  \"quote_id\": \"example_quote_id\"\n" +
                        "}"
            )
        }
    ),
    required = true,
    description = "notification data required: from(id), to(id), type(string), and quote_id(id)"
)
    public Response createNotification(String jsonInput) {
        try {
            JsonObject inputJson = Json.createReader(new StringReader(jsonInput)).readObject();
            
            if (!inputJson.containsKey("from") || !inputJson.containsKey("to") || 
                !inputJson.containsKey("type") || !inputJson.containsKey("quote_id")) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Missing required fields: from, to, type, or quote_id")
                        .build();
            }
            
            String fromId = inputJson.getString("from");
            String toId = inputJson.getString("to");
            String quoteId = inputJson.getString("quote_id");
            
            if (!isValidObjectId(fromId) || !isValidObjectId(toId) || !isValidObjectId(quoteId)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Invalid ObjectId format in from, to, or quote_id")
                        .build();
            }
            
            Document notificationDoc = new Document()
                    .append("from", new ObjectId(fromId))
                    .append("to", new ObjectId(toId))
                    .append("type", inputJson.getString("type"))
                    .append("quote_id", new ObjectId(quoteId))
                    .append("Created_at", System.currentTimeMillis()); 
            
            notificationsCollection.insertOne(notificationDoc);
            
            JsonObject response = Json.createObjectBuilder()
                    .add("success", true)
                    .add("message", "Notification created successfully")
                    .add("notification_id", notificationDoc.getObjectId("_id").toString())
                    .build();
            
            return Response.status(Response.Status.CREATED)
                    .entity(response.toString())
                    .build();
            
        } catch (Exception e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Exception occurred: " + e.getMessage())
                    .build();
        }
    }           

    @DELETE
    @Path("/delete/{notificationId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Notification successfully deleted"),
            @APIResponse(responseCode = "400", description = "Given ID is not a valid ObjectId"),
            @APIResponse(responseCode = "404", description = "Notification not found"),
            @APIResponse(responseCode = "409", description = "Exception occurred")
    })
    @Operation(summary = "Delete a notification by ID", 
              description = "Deletes a notification with the specified ID")
    public Response deleteNotification(@PathParam("notificationId") String notificationId) {
        try {
            if (!isValidObjectId(notificationId)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Given ID is not a valid ObjectId")
                        .build();
            }
            
            ObjectId objectId = new ObjectId(notificationId);
            Document filter = new Document("_id", objectId);
            long deletedCount = notificationsCollection.deleteOne(filter).getDeletedCount();
            
            if (deletedCount == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Notification not found")
                        .build();
            }
            
            JsonObject response = Json.createObjectBuilder()
                    .add("success", true)
                    .add("message", "Notification deleted successfully")
                    .build();
                    
            return Response.ok(response.toString()).build();
            
        } catch (Exception e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Exception occurred: " + e.getMessage())
                    .build();
        }
    }
    
    private boolean isValidObjectId(String id) {
        try {
            new ObjectId(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String getNotificationsByUser(ObjectId userId) {
        Document query = new Document("to", userId);
        FindIterable<Document> notifications = notificationsCollection.find(query);
        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document doc : notifications) {
            if (doc.containsKey("_id")) {
                doc.put("_id", doc.getObjectId("_id").toString());
            }
            if (doc.containsKey("from")) {
                doc.put("from", doc.getObjectId("from").toString());
            }
            if (doc.containsKey("to")) {
                doc.put("to", doc.getObjectId("to").toString());
            }
            if (doc.containsKey("quote_id")) {
                doc.put("quote_id", doc.getObjectId("quote_id").toString());
            }
            JsonObject jsonObject = Json.createReader(new java.io.StringReader(doc.toJson())).readObject();
            jsonArrayBuilder.add(jsonObject);
        }
        StringWriter stringWriter = new StringWriter();
        try (JsonWriter jsonWriter = Json.createWriter(stringWriter)) {
            jsonWriter.writeArray(jsonArrayBuilder.build());
        }
        return stringWriter.toString();
    }

}
