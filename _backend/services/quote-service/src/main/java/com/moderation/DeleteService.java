package com.moderation;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class DeleteService {

    public static MongoClient client;
    public static MongoDatabase moderationDB;
    public static MongoCollection<Document> deletedCollection;

    public DeleteService() {
        client = MongoClients.create(System.getenv("CONNECTION_STRING"));
        moderationDB = client.getDatabase("Moderation");
        deletedCollection = moderationDB.getCollection("Deleted");
    }

    public String createDeletedQuote(Document document) {
        deletedCollection.insertOne(document);
        return document.toJson();
    }

}
