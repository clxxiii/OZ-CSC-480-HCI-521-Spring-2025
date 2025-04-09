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



    //Testing parseQuote methods
    //method is private

     //test when we update quotes
    @Test
    public void testUpdateQuotes(){
        quoteObject.setText("this is a test");
        quoteObject.setAuthor("author2");
        assertTrue(mongoUtil.updateQuote(quoteObject));
    }


    //failed cause when getting quote object with null quoteObject
    @Test
    public void testUpdateQuotesWithNull(){
        quoteObject = null;
        assertFalse(mongoUtil.updateQuote(quoteObject));
    }



    //Failed because if getQuotes is null then parse method returns exception
    @Test
    public void testUpdateQuotesWithRandomId(){
        QuoteObject newQuoteObject = new QuoteObject();
        newQuoteObject.setId(new ObjectId());
        newQuoteObject.setAuthor("author3");
        assertFalse(mongoUtil.updateQuote(newQuoteObject));
    }



    //Failed if id is null then getObject gives you null
    @Test
    public void testUpdateQuotesWithNullId(){
        quoteObject.setId(null);
        assertFalse(mongoUtil.updateQuote(quoteObject));
    }


    //the jwtString creates error
    @Test
    void testSearchWithoutFilters() {
        String searchQuery = "test";
        boolean filterUsed = false;
        boolean filterBookmarked = false;
        boolean filterUploaded = false;
        String includeTerms = null;
        String excludeTerms = null;
        String jwtString = "jwtString";
        String result = mongoUtil.searchQuote(searchQuery, filterUsed, filterBookmarked, filterUploaded, includeTerms, excludeTerms, jwtString);
        assertNotNull(result);
        assertTrue(result.contains("test"));  // Ensure the search term "test" is present in the result
    }







}
