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



    List<String> firstNames = afterDocs.stream().map(UserControllerSpec::getFirstName).collect(Collectors.toList());
    assertTrue("Should contain newly added firstName", firstNames.contains("Suzette"));
  }

  @Test
  public  void getUser(){
    String desiredUser = userController.getUser("655477182929676100000");

    BsonDocument afterDocs = BsonDocument.parse(desiredUser);
    assertEquals("Should return 8 fields associated with that user", 8, afterDocs.size());
  }

}
