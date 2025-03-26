package com.auth;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class SessionService {

    public static MongoClient client;
    public static MongoDatabase sessionsDB;
    public static MongoCollection<Document> sessionsCollection;

    public SessionService() {
        String connectionString = System.getenv("CONNECTION_STRING");

        client = MongoClients.create(connectionString);
        sessionsDB = client.getDatabase("Accounts");
        sessionsCollection = sessionsDB.getCollection("Sessions");
    }

    public String createSession(Session session) {
        Document sessionDoc = new Document()
                .append("_id", session.SessionId)
                .append("UserId", session.UserId)
                .append("admin", session.admin)
                .append("Expires", session.Expires)
                .append("LastActivity", session.LastActivity);

        if (sessionDoc == null || sessionDoc.getString("UserId") == null) {
            return null;
        }

        // Remove this when deployed!!!!
        sessionsCollection.deleteOne(new Document("UserId", session.UserId));

        sessionsCollection.insertOne(sessionDoc);

        return session.SessionId.toString();
    }

    public Boolean updateSession(String sessionId, Session session) {
        ObjectId objectId;

        try {
            objectId = new ObjectId(sessionId);
        } catch (Exception e) {
            return false;
        }

        Document sessionDoc = sessionToDocument(session);

        UpdateResult updateResult = sessionsCollection.updateOne(
                eq("_id", objectId),
                new Document("$set", sessionDoc)
        );

        return updateResult.getModifiedCount() == 1;
    }

    public Session getSession(String sessionId) {
        try {
            ObjectId sessionObjectId = new ObjectId(sessionId);
            Document sessionDoc = sessionsCollection.find(eq("_id", sessionObjectId)).first();

            if (sessionDoc == null) {
                return null;
            }

            return documentToSession(sessionDoc);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    public Session documentToSession(Document doc) {
        ObjectId sessionId = doc.getObjectId("_id");
        String userId = doc.getString("UserId");
        int admin = doc.getInteger("admin");
        Date expires = doc.getDate("Expires");
        Date lastActivity = doc.getDate("LastActivity");

        return new Session(sessionId, userId, admin, expires, lastActivity);
    }

    public Document sessionToDocument(Session session) {
        Document document = new Document("UserId", session.UserId)
                .append("admin", session.admin)
                .append("Expires", session.Expires)
                .append("LastActivity", session.LastActivity);

        return document;
    }

}
