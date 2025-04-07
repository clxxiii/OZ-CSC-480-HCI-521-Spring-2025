package com.auth;

import com.accounts.AccountService;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.github.cdimascio.dotenv.Dotenv;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class SessionServiceTest {

    static SessionService sessionService;
    static Session session;
    static ObjectId _id = new ObjectId();

    // Setup Method
    @BeforeAll
    public static void setUp() {
//        Dotenv dotenv = Dotenv.configure()
//                .load();

//        String connectionString = "mongodb://user:password@quotes-database:27017";

//        MongoClient client = MongoClients.create(dotenv.get("CONNECTION_STRING"));

        String connectionString = System.getenv("CONNECTION_URI");

        MongoClient client = MongoClients.create(connectionString);

        sessionService = new SessionService(client, "Test", "Sessions");

    }

    @BeforeEach
    public void mockSessionObject() {
        String userid = "123456789";
        int admin = 1;
        Date expires = new Date(System.currentTimeMillis() + 21 * 24 * 60 * 60 * 1000);
        Date lastActivity = new Date();

        session = new Session(_id, userid, admin, expires, lastActivity);
    }

    // create session
    // session is null: return null
    // session created sucessfully: return SessionId
    @Test
    @Order(1)
    void createSessionTC1() {
        String sessionId = sessionService.createSession(session);
        assertEquals(session.SessionId.toString(), sessionId);
    }

    @Test
    @Order(2)
    void createSessionTC2() {
        Session nullSession = new Session(null , 0, null, null);
        String sessionId = sessionService.createSession(nullSession);
        assertNull(sessionId);
    }

    @Test
    @Order(3)
    void createSessionTC3() {
        Session nullSession = new Session(null, session.admin, session.Expires, session.LastActivity);
        String sessionId = sessionService.createSession(nullSession);
        assertNull(sessionId);
    }

    // update session
    // session successfully updated: return true
    // session not updated: return false
    @Test
    @Order(4)
    void updateSessionTC1() {
        Session updatedSession = new Session(session.UserId, 0, session.Expires, session.LastActivity);
        Boolean updated = sessionService.updateSession(session.SessionId.toString(), updatedSession);
        assertTrue(updated);
    }

    @Test
    @Order(5)
    void updateSessionTC2() {
        Session updatedSession = new Session(session.UserId, 1, session.Expires, session.LastActivity);
        Boolean updated = sessionService.updateSession(null, updatedSession);
        assertFalse(updated);
    }

    @Test
    @Order(6)
    void updateSessionTC3() {
        Session updatedSession = new Session(session.UserId, 1, session.Expires, session.LastActivity);
        Boolean updated = sessionService.updateSession("1426513", updatedSession);
        assertFalse(updated);
    }

    @Test
    @Order(7)
    void updateSessionTC4() {
        Boolean updated = sessionService.updateSession(session.SessionId.toString(), null);
        assertFalse(updated);
    }

    @Test
    @Order(8)
    void updateSessionTC5() {
        Session updatedSession = new Session(null, 0, null, null);
        Boolean updated = sessionService.updateSession(session.SessionId.toString(), updatedSession);
        assertTrue(updated);
    }

    @Test
    @Order(9)
    void updateSessionTC6() {
        Session updatedSession = new Session(session.UserId, 1, session.Expires, session.LastActivity);
        Boolean updated = sessionService.updateSession(session.SessionId.toString(), updatedSession);
        assertTrue(updated);
    }

    // retrieve session
    // return the session as a Session Object (success)
    // return null
    @Test
    @Order(10)
    void getSessionTC1() {
        Session sess = sessionService.getSession(session.SessionId.toString());
        assertEquals(session.SessionId.toString(), sess.SessionId.toString());
        assertEquals(session.UserId, sess.UserId);
        assertEquals(session.admin, sess.admin);
    }

    @Test
    @Order(11)
    void getSessionTC2() {
        Session sess = sessionService.getSession("4526347214");
        assertNull(sess);
    }

    @Test
    @Order(12)
    void getSessionTC3() {
        Session sess = sessionService.getSession(null);
        assertNull(sess);
    }

    @Test@Order(13)
    void getSessionTC4() {
        Session sess = sessionService.getSession("abhghtkhdbkidbdjfbkhkknd");
        assertNull(sess);
    }

    @Test
    @Order(14)
    void getSessionTC5() {
        Session sess = sessionService.getSession("aaaaaaaaaaaaaaaaaaaaaaaa");
        assertNull(sess);
    }

    // delete session
    // session successfully deleted: return true
    // session not deleted: return false
    @Test
    @Order(15)
    void deleteSessionTC1() {
        boolean success = sessionService.deleteSession(null);
        assertFalse(success);
    }

    @Test
    @Order(16)
    void deleteSessionTC2() {
        boolean success = sessionService.deleteSession("abhghtkhdbkidbdjfbkhkknd");
        assertFalse(success);
    }

    @Test
    @Order(17)
    void deleteSessionTC3() {
        boolean success = sessionService.deleteSession("aaaaaaaaaaaaaaaaaaaaaaaa");
        assertFalse(success);
    }

    @Test
    @Order(18)
    void deleteSessionTC4() {
        boolean success = sessionService.deleteSession("78652759252");
        assertFalse(success);
    }

    @AfterAll
    static void deleteSessionTC5() {
        boolean success = sessionService.deleteSession(session.SessionId.toString());
        assertTrue(success);
    }

    // Session object to document
    @Test
    @Order(19)
    void sessionToDocumentTC1() {
        Document doc = sessionService.sessionToDocument(session);
        assertEquals(session.UserId, doc.getString("UserId"));
        assertEquals(session.admin, doc.getInteger("admin"));
        assertEquals(session.Expires, doc.getDate("Expires"));
        assertEquals(session.LastActivity, doc.getDate("LastActivity"));
    }

    // Document to Session Object
    @Test
    @Order(20)
    void documentToSessionTC1() {
        Session sess = sessionService.documentToSession(sessionService.sessionToDocument(session));
        assertEquals(session.UserId, sess.UserId);
    }

}