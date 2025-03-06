package quotes;

import com.quotes.QuoteObject;
import com.quotes.QuoteSearchResource;
import com.quotes.SanitizerClass;
import jakarta.json.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.Assertions;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class QuotesUnitTesting {
    private static Client client;
    private static QuoteObject quote;
    private static JsonObject quoteJsonObject;
    private static String rootUrl;
    private static ArrayList<String> testIds = new ArrayList<>();
    private static Response addQuoteResponse;
    private static boolean deleteQuoteResponse = false;
    private static SanitizerClass sanitizerClass;


    @BeforeAll
    public static void setUp() {
        sanitizerClass = new SanitizerClass();
        client = ClientBuilder.newClient();
        String port = "9082";
        String contextPath = "/";
        rootUrl = "http://localhost:" + port + contextPath;
        JsonObjectBuilder quoteObjectBuilder = Json.createObjectBuilder();
        quoteObjectBuilder.add("id", "1");
        quoteObjectBuilder.add("author", "John Doe");
        quoteObjectBuilder.add("quote", "This is testing");
        quoteObjectBuilder.add("bookmarks", 1);
        quoteObjectBuilder.add("shares", 1);
        JsonArrayBuilder tags = Json.createArrayBuilder();
        tags.add("tag1");
        tags.add("tag2");
        quoteObjectBuilder.add("tags", tags);
        quoteObjectBuilder.add("flags", 1);
        quoteObjectBuilder.add("isPrivate", true);
        quoteObjectBuilder.add("creator", "John Doe");
        quoteJsonObject = quoteObjectBuilder.build();
    }

    @BeforeEach
    public void beforeEach() {
        String url = rootUrl + "/quotes/create";
        JsonObject jsonObject = quoteJsonObject;
        addQuoteResponse = client.target(url).request(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).post(Entity.json(jsonObject));
        testIds.add(addQuoteResponse.readEntity(JsonObject.class).getString("_id"));
    }

    @AfterEach
    public void afterEach() {
        if(!deleteQuoteResponse) {
            for (String id : testIds) {
                String url = rootUrl + "/quotes/delete/" + id;
                client.target(url).request(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).delete();
                testIds.remove(id);
            }
        }
        deleteQuoteResponse = false;
        client.close();
    }

    @AfterAll
    public static void tearDown() {
        client.close();
    }

    @Test
    public void CreateQuote1() {
       String url = rootUrl + "/quotes/create";
//        Response response = client.target(url).request().post(Entity.json(quoteJsonObject));
//        this.assertResponse(url, response);
//        JsonObject quote = response.readEntity(JsonObject.class);
//        testIds.add(quote.getString("_id"));
//        response.close();

         this.assertResponse(url, addQuoteResponse);
    }

    @Test
    public void sanitizeNull(){
        String nullString = SanitizerClass.sanitize(null);
        assertNull(nullString);
    }

    @Test
    public void sanitizeEmpty(){
        String emptyString = SanitizerClass.sanitize("");
        assertEquals("", emptyString);
    }

    @Test
    public void sanitizeWord(){
        String word = SanitizerClass.sanitize("word");
        assertEquals("word", word);
    }

    @Test
    public void CreateQuote2() {
        String quoteJson = "{\"author\": \"Test Author\", \"quote\": \"Test quote text\", \"tags\": [\"test\"]}";
        String url = rootUrl + "/quotes/create";
        Response response = client.target(url).request().post(Entity.json(quoteJson));
        this.assertResponse(url, response);
        JsonObject quote = response.readEntity(JsonObject.class);
        testIds.add(quote.getString("_id"));
        response.close();
    }

    //testing to create a null group

    @Test
    public void deleteQuote1(){
        String url = rootUrl + "/quotes/delete/" + testIds.get(0);
        Response response = client.target(url).request().delete();
        this.assertResponse(url, response);
        testIds.remove(0);
        response.close();
    }

    @Test
    public void idSearchTest(){
        String id = testIds.get(0);
        String url = rootUrl + "/quotes/search/id/" + id;
        Response response = client.target(url).request().get();
        this.assertResponse(url, response);
        response.close();
    }

    @Test
    public void idSearchInvalidTest(){
        String id = "kjaisdngai";
        String url = rootUrl + "/quotes/search/id/" + id;
        Response response = client.target(url).request().get();
        this.assertInvalidResponse(url, response);
        response.close();
    }

    @Test
    public void idSearchInvalidTest2(){
        String id = "67c5552cbcbeea33d7cbbed7";
        String url = rootUrl + "/quotes/search/id/" + id;
        Response response = client.target(url).request().get();
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus(), "Incorrect response code from " + url);
        response.close();
    }

    @Test
    public void idSearchIllegalTest(){
        String id = "ja#ki";
        String url = rootUrl + "/quotes/search/id/" + id;
        Response response = client.target(url).request().get();
        assertEquals(Response.Status.CONFLICT.getStatusCode(), response.getStatus(), "Incorrect response code from " + url);
        response.close();
    }





//    @Test
//    @Order(8)
//    public void testSanitization(){
//        assertNull(SanitizerClass.sanitize(null));
//    }
//
//    @Test
//    public void testSanitize(){
//
//    }


    public void assertResponse(String url, Response response) {
        assertEquals(200, response.getStatus(), "Incorrect response code from " + url);
    }


    public void assertInvalidResponse(String url, Response response) {
        assertEquals(400, response.getStatus(), "Incorrect response code from " + url);
    }
}
