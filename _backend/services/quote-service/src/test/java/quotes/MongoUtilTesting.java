package quotes;

import com.quotes.MongoUtil;
import com.quotes.QuoteObject;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObjectBuilder;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class MongoUtilTesting {
    public static MongoUtil mongoUtil;
    public static QuoteObject quoteObject;
    ObjectId id;
    public static ArrayList<ObjectId> ids;

    @BeforeAll
    public static void setUp() {
        mongoUtil = new MongoUtil("mongodb+srv://database_admin:pXzO2cMkmk7LXVCH@csc480cluster.ldmco.mongodb.net/?retryWrites=true&w=majority");
        ids = new ArrayList<>();
    }

    @BeforeEach
    public void beforeEach() {
        ObjectId objectId = new ObjectId();
        ObjectId creatorId = new ObjectId();
        quoteObject = new QuoteObject();
        quoteObject.setId(objectId);
        quoteObject.setAuthor("author");
        quoteObject.setBookmarks(1);
        quoteObject.setShares(1);
        quoteObject.setTags(new ArrayList<>(Arrays.asList("tag1", "tag2")));
        quoteObject.setText("text");
        quoteObject.setCreator(creatorId);
        id = mongoUtil.createQuote(quoteObject);
        System.out.println(id);
        ids.add(id);
    }

    @AfterEach
    public void afterEach() {
        for (ObjectId id : ids) {
            mongoUtil.deleteQuote(id);
        }
    }

    @Test
    public void testCreateQuote() {
        assertEquals(1, ids.size());
    }


      //create Quote with empty text
    @Test
    public void testCreateQuoteWithEmptyText(){
        ObjectId objectId = new ObjectId();
        quoteObject.setId(objectId);
        quoteObject.setAuthor("author");
        quoteObject.setText("");
        quoteObject.setCreator(objectId);
        assertNull(mongoUtil.createQuote(quoteObject));
    }

    // just passing id and text
    @Test
    public void testCreateQuoteWithIdAndText(){
        quoteObject.setText("test");
        ids.add(mongoUtil.createQuote(quoteObject));
        assertEquals(2, ids.size());
    }

    //setting text null
    @Test
    public void testCreateQuoteWithTextNull(){
        quoteObject.setText(null);
        assertNull(mongoUtil.createQuote(quoteObject));
    }

    @Test
    public void testGetQuote(){
        assertNotNull(mongoUtil.getQuote(id));
    }


    //checking when the id is not present in the database
    @Test
    public void testGetQuoteswithRandomID(){
        assertNull(mongoUtil.getQuote(new ObjectId()));
    }

    //checking when the id is null
    @Test
    public void testGetQuoteswithNullID(){
        assertNull(mongoUtil.getQuote(null));
    }

    //checking when the create is null
    //need to make sure the creator is not null
    @Test
    public void testGetQuoteswithNullCreator(){
        ObjectId objectId = new ObjectId();
        quoteObject = new QuoteObject();
        quoteObject.setId(objectId);
        quoteObject.setAuthor("author");
        quoteObject.setText("trial");
        ObjectId id = mongoUtil.createQuote(quoteObject);
        assertNull(mongoUtil.getQuote(id));
    }

    @Test
    public void testSearchQuotes(){
        String searchQuery = "text";
        assertNotNull(mongoUtil.searchQuote(searchQuery));
    }



    //have not properly set up for null text
    @Test
    public void testSearchQuoteswithNullText(){
        String searchQuery = null;
        assertNotNull(mongoUtil.searchQuote(searchQuery));
    }


    //com.mongodb.MongoCommandException: Command failed with error 8 (UnknownError): '"text.query" cannot be empty' on server csc480cluster-shard-00-02.ldmco.mongodb.net:27017. The full response is {"ok": 0.0, "errmsg": "\"text.query\" cannot be empty", "code": 8, "codeName": "UnknownError", "$clusterTime": {"clusterTime": {"$timestamp": {"t": 1743743791, "i": 7}}, "signature": {"hash": {"$binary": {"base64": "ITnzdP/EWTN6dtwJZezgavFGxAE=", "subType": "00"}}, "keyId": 7431942852730421250}}, "operationTime": {"$timestamp": {"t": 1743743791, "i": 7}}}
    @Test
    public void testSearchQuotesWithEmptyText(){
        String searchQuery = "";
        assertNotNull(mongoUtil.searchQuote(searchQuery));
    }


    //gives "[]" back
    @Test
    public void testSearchQuotesWithRandomText(){
        String searchQuery = "asfah";
        assertNotNull(mongoUtil.searchQuote(searchQuery));
    }





}
