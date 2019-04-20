package umm3601.ride;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.Document;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.conversions.Bson;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.user.UserController;

import java.util.*;
import java.util.stream.Collectors;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;


public class UserControllerSpec {
  private UserController userController;
  private ObjectId knownId;

  @Before
  public void clearAndPopulateDB(){
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(Document.parse("{\n" +
      "                    userId: \"655477182929676100000\",\n" +
      "                    email: \"Aquamate64@morris.umn.edu\",\n" +
      "                    fullName: \"Imogene Swanson\",\n" +
      "                    pictureUrl: \"https://picsum.photos/200/300/?random\"\n" +
      "                    lastName: \"Swanson\",\n" +
      "                    firstName: \"Imogene\",\n" +
      "                    phone: \"(981) 461-3498\",\n" +
      "                }"));
    testUsers.add(Document.parse("{\n" +
      "                    userId: \"537114095323778200000\",\n" +
      "                    email: \"Kengen91@gmail.com\",\n" +
      "                    fullName: \"Duran Mcgowan\",\n" +
      "                    pictureUrl: \"https://picsum.photos/200/300/?random\"\n" +
      "                    lastName: \"Mcgowan\",\n" +
      "                    firstName: \"Duran\",\n" +
      "                    phone: \"(854) 531-3206\",\n" +
      "                }"));
    testUsers.add(Document.parse("{\n" +
      "                    userId: \"832471086850197300000\",\n" +
      "                    email: \"Medesign54@morris.umn.edu\",\n" +
      "                    fullName: \"Patton Vang\",\n" +
      "                    pictureUrl: \"https://picsum.photos/200/300/?random\"\n" +
      "                    lastName: \"Vang\",\n" +
      "                    firstName: \"Patton\",\n" +
      "                    phone: \"(810) 497-2006\",\n" +
      "                }"));
    userDocuments.insertMany(testUsers);

    knownId = new ObjectId();
    BasicDBObject knownObj = new BasicDBObject("_id", knownId);
    knownObj = knownObj
      .append("userId","245390728780678040000")
      .append("email", "Ecraze33@morris.umn.edu")
      .append("fullName", "Herminia Ross")
      .append("pictureUrl", "https://picsum.photos/200/300/?random")
      .append("lastName","Ross")
      .append("firstName","Herminia")
      .append("phone","(923) 442-3088");
    userDocuments.insertOne(Document.parse(knownObj.toJson()));

    userController = new UserController(db);
  }

  private static BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getAttribute(BsonValue val, String attribute){
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get(attribute)).getValue();
  }

  private static String getFirstName(BsonValue val){
    return getAttribute(val,"firstName");
  }

  @Test
  public void addUser(){
    Map<String, String[]> emptyMap = new HashMap<>();

    String beforeResult = userController.getUsers(emptyMap);
    BsonArray beforeDocs = parseJsonArray(beforeResult);

    assertEquals("Should have 4 users before addNewUser is called", 4, beforeDocs.size());

    String jsonResult = userController.addNewUser("342389477594424000000","Dreamia5@gmail.com",
      "Suzette Rutledge","https://picsum.photos/200/300/?random",
      "Rutledge", "Suzette");

    assertNotNull("Add user result should not be null", jsonResult);

    String afterResult = userController.getUsers(emptyMap);
    BsonArray afterDocs = parseJsonArray(afterResult);

    assertEquals("Should have 5 users after addNewUser is called", 5, afterDocs.size());


    List<String> firstNames = afterDocs.stream().map(UserControllerSpec::getFirstName).collect(Collectors.toList());
    assertTrue("Should contain newly added firstName", firstNames.contains("Suzette"));
  }

  @Test
  public  void getUser(){

    String desiredUser = userController.getUser("655477182929676100000");
    assertNotNull("getUser should have found a user", desiredUser);

    String nonExistingUser = userController.getUser("123456789");
    assertNull("getUser should have not found a user", nonExistingUser);

    // Turning the user string into a Bson Document
    BsonDocument afterDocs = BsonDocument.parse(desiredUser);

    assertEquals("Should return 8 fields associated with that user", 8, afterDocs.size());

    //_id is randomly generated by MongoDB every time, so there is no point of checking it except
    // that the field exists. We could test it, but it would just be getting the id via
    // afterDocs.get("_id").asObjectId().getValue() and testing it matches the id via the same
    // exact function
    assertTrue("user should have the _id field",afterDocs.containsKey("_id"));

    // Here we check that the fields(or keys) that our user object has exists and that those
    // fields have the value associated with the user getUser should have gotten back
    assertTrue("user should have the userId field",afterDocs.containsKey("userId"));
    assertEquals("user should contain the right userId", "655477182929676100000",
      afterDocs.get("userId").asString().getValue());

    assertTrue("user should have the email field",afterDocs.containsKey("email"));
    assertEquals("user should contain the right email", "Aquamate64@morris.umn.edu",
      afterDocs.get("email").asString().getValue());

    assertTrue("user should have the fullName field",afterDocs.containsKey("fullName"));
    assertEquals("user should contain the right fullName", "Imogene Swanson",
      afterDocs.get("fullName").asString().getValue());

    assertTrue("user should have the pictureUrl field",afterDocs.containsKey("pictureUrl"));
    assertEquals("user should contain the right pictureUrl", "https://picsum.photos/200/300/?random",
      afterDocs.get("pictureUrl").asString().getValue());

    assertTrue("user should have the lastName field",afterDocs.containsKey("lastName"));
    assertEquals("user should contain the right lastName", "Swanson",
      afterDocs.get("lastName").asString().getValue());

    assertTrue("user should have the firstName field",afterDocs.containsKey("firstName"));
    assertEquals("user should contain the right firstName", "Imogene",
      afterDocs.get("firstName").asString().getValue());

    assertTrue("user should have the phone field",afterDocs.containsKey("phone"));
    assertEquals("user should contain the right phone", "(981) 461-3498",
      afterDocs.get("phone").asString().getValue());
  }

}
