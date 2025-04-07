package com.usedQuotes;

import com.auth.Session;
import com.auth.SessionService;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.ws.rs.core.Response;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UsedQuoteServiceTest {

    static UsedQuoteService usedQuoteService;
    static UsedQuote quote;
    static ObjectId _id = new ObjectId();
    static Date used = new Date();

    @BeforeAll
    public static void setUp() {
//        Dotenv dotenv = Dotenv.configure()
//                .load();

//        String connectionString = "mongodb://user:password@quotes-database:27017";

//        usedQuoteService = new UsedQuoteService(dotenv.get("CONNECTION_STRING"), "Test", "UsedQuotes");

        String connectionString = System.getenv("CONNECTION_URI");

        usedQuoteService = new UsedQuoteService(connectionString, "Test", "UsedQuotes");
    }

    @BeforeEach
    public void mockUsedQuote() {
        int count = 6;
        quote = new UsedQuote(count, used);
        quote.setId(_id);
    }

    // create Used Quote
    // created successfully: return usedQuoteId
    // error creating: return null
    @Test
    @Order(1)
    void newUsedQuoteTC1() {
        ObjectId id = usedQuoteService.newUsedQuote(quote);
        assertEquals(_id, id);
    }

    @Test
    @Order(2)
    void newUsedQuoteTC2() {
        ObjectId id = usedQuoteService.newUsedQuote(null);
        assertNull(id);
    }

    // retrieve a Used Quote
    // successfully retrieved: return UsedQuote Document
    // not retrieved: return null
    @Test
    @Order(3)
    void retrieveUsedQuoteTC1() {
        Document doc = usedQuoteService.retrieveUsedQuote(_id.toString());
        assertEquals(quote.getUsed(), doc.getDate("used"));
        assertEquals(quote.getCount(), doc.getInteger("count"));
    }

    @Test
    @Order(4)
    void retrieveUsedQuoteTC2() {
        Document doc = usedQuoteService.retrieveUsedQuote("2547234");
        assertNull(doc);
    }

    @Test
    @Order(5)
    void retrieveUsedQuoteTC3() {
        Document doc = usedQuoteService.retrieveUsedQuote("aaaaaaaaaaaaaaaaaaaaaaaa");
        assertNull(doc);
    }

    @Test
    @Order(6)
    void retrieveUsedQuoteTC4() {
        Document doc = usedQuoteService.retrieveUsedQuote(null);
        assertNull(doc);
    }

    // update used quote
    // successfully updated used quote: return code 200 with updated used quote json
    // invalid objectId: code 404
    // invalid json: code 400
    // used quote not found: code 404
    @Test
    @Order(7)
    void updateUsedQuoteTC1() {
        quote.setCount(8);
        try(Response response = usedQuoteService.updateUsedQuote(quote.toJson(), _id.toString())) {
            assertEquals(200, response.getStatus());
            Document d = Document.parse(response.getEntity().toString());
            assertEquals(quote.getCount(), d.getInteger("count"));
        }
    }

    @Test
    @Order(8)
    void updateUsedQuoteTC2() {
        quote.setUsed(new Date());
        try(Response response = usedQuoteService.updateUsedQuote(quote.toJson(), _id.toString())) {
            assertEquals(200, response.getStatus());
            Document d = Document.parse(response.getEntity().toString());
            assertEquals(quote.getUsed().toString(), new SimpleDateFormat("MMM d, yyyy, h:mm:ss a").parse(d.getString("used")).toString());
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @Order(9)
    void updateUsedQuoteTC3() {
        try(Response response = usedQuoteService.updateUsedQuote(quote.toJson(), null)) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(10)
    void updateUsedQuoteTC4() {
        try(Response response = usedQuoteService.updateUsedQuote(quote.toJson(), "64823647823648")) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(11)
    void updateUsedQuoteTC5() {
        try(Response response = usedQuoteService.updateUsedQuote(quote.toJson(), "aaaaaaaaaaaaaaaaaaaaaaaa")) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(12)
    void updateUsedQuoteTC6() {
        try(Response response = usedQuoteService.updateUsedQuote(null, _id.toString())) {
            assertEquals(400, response.getStatus());
        }
    }

    @Test
    @Order(13)
    void updateUsedQuoteTC7() {
        try(Response response = usedQuoteService.updateUsedQuote("uewiyriewyriu", _id.toString())) {
            assertEquals(400, response.getStatus());
        }
    }

    @Test
    @Order(14)
    void updateUsedQuoteTC8() {
        try(Response response = usedQuoteService.updateUsedQuote("{}", _id.toString())) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(15)
    void updateUsedQuoteTC9() {
        try(Response response = usedQuoteService.updateUsedQuote(quote.toJson(), new ObjectId().toString())) {
            assertEquals(404, response.getStatus());
        }
    }

    // delete used quote
    // used quote successfully deleted: return 200
    // invalid used quote id: return 404
    // used quote not found: return 404
    @Test
    @Order(16)
    void deleteUsedQuoteTC1() {
        try(Response response = usedQuoteService.deleteUsedQuote(null)) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(17)
    void deleteUsedQuoteTC2() {
        try(Response response = usedQuoteService.deleteUsedQuote("637846895")) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(18)
    void deleteUsedQuoteTC3() {
        try(Response response = usedQuoteService.deleteUsedQuote("aaaaaaaaaaaaaaaaaaaaaaaa")) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(19)
    void deleteUsedQuoteTC4() {
        try(Response response = usedQuoteService.deleteUsedQuote(new ObjectId().toString())) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    @Order(20)
    void deleteUsedQuoteTC5() {
        try(Response response = usedQuoteService.deleteUsedQuote(_id.toString())) {
            assertEquals(200, response.getStatus());
        }
    }


}