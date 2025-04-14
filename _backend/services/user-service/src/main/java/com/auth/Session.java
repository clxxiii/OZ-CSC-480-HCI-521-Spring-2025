package com.auth;

import com.google.gson.Gson;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Date;

public class Session {

    public ObjectId SessionId;

    public String UserId;

    public int admin;

    public Date Expires;

    public Date LastActivity;


    public Session(ObjectId sessionId, String userId, int admin, Date expires, Date lastActivity) {
        SessionId = sessionId;
        UserId = userId;
        this.admin = admin;
        Expires = expires;
        LastActivity = lastActivity;
    }

    public Session(String userId, int admin, Date expires, Date lastActivity) {
        UserId = userId;
        this.admin = admin;
        Expires = expires;
        LastActivity = lastActivity;
    }

    public String toJson() {
        Document doc = Document.parse(new Gson().toJson(this));
        if (doc.containsKey("_id")) {
            doc.replace("_id", doc.getObjectId("_id").toString());
        }
        return doc.toJson();
    }

}
