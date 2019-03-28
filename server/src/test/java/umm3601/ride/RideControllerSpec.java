package umm3601.ride;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.DatabaseHelper;
import umm3601.user.UserControllerSpec;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static umm3601.DatabaseHelper.parseJsonArray;

public class RideControllerSpec {
  private RideController rideController;
  private ObjectId ellisRideId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Colt\",\n" +
      "                    seatsAvailable: 0,\n" +
      "                    origin: \"Morris Campus, Gay Hall\",\n" +
      "                    destination: \"Twin Cities\"\n" +
      "                    departure_date: \"Wednesday the 15th of March\",\n" +
      "                    departure_time: \"5:00PM\",\n" +
      "                    isDriving: false,\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Avery\",\n" +
      "                    seatsAvailable: 10,\n" +
      "                    origin: \"534 e 5th St, Morris MN 56261\",\n" +
      "                    destination: \"Culver's, Alexandria\"\n" +
      "                    departure_date: \"5/15/19\",\n" +
      "                    departure_time: \"3:30pm\",\n" +
      "                    isDriving: true,\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Michael\",\n" +
      "                    seatsAvailable: 0,\n" +
      "                    origin: \"On campus\",\n" +
      "                    destination: \"Willies\"\n" +
      "                    departure_date: \"\",\n" +
      "                    departure_time: \"5pm\",\n" +
      "                    isDriving: false,\n" +
      "                }"));

    ellisRideId = new ObjectId();
    BasicDBObject ellisRide = new BasicDBObject("_id", ellisRideId);
    ellisRide = ellisRide.append("driver", "Ellis")
      .append("seatsAvailable", 0)
      .append("origin", "Casey's General Store")
      .append("destination", "Perkin's")
      .append("departure_date", "March 17th")
      .append("departure_time", "")
      .append("isDriving", false);

    rideDocuments.insertMany(testRides);
    rideDocuments.insertOne(Document.parse(ellisRide.toJson()));

    rideController = new RideController(db);
  }

  private static String getDriver(BsonValue val) {
    BsonDocument ride = val.asDocument();
    return ((BsonString) ride.get("driver")).getValue();
  }

  private static int getSeatsAvailable(BsonValue val) {
    BsonDocument ride = val.asDocument();
    return ((BsonInt32) ride.get("seatsAvailable")).getValue();
  }

  @Test
  public void getAllRides() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = rideController.getRides(emptyMap);
    BsonArray rides = parseJsonArray(jsonResult);

    assertEquals("Should be 4 rides", 4, rides.size());
    List<String> drivers = rides
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Avery", "Colt", "Ellis", "Michael");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void getAllRidesOffered() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("isDriving", new String[]{"true"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 1 ride", 1, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Avery");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void getAllRidesRequested() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("isDriving", new String[]{"false"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 3 rides", 3, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Colt", "Ellis", "Michael");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }



  @Test
  public void addRide(){
    String newId = rideController.addNewRide("Dave Roberts", "I talk a lot about math", 2,
      "Shopko", "UMM Science Building Parking Lot", "5PM", "5/13/19", true);

    assertNotNull("Add new ride should return true when ride is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("driver", new String[]{"Dave Roberts"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> driverName = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return name of new driver", "Dave Roberts", driverName.get(2));
  }

  @Test
  public void addRideRequestedHasZeroSeats(){
    String newId = rideController.addNewRide("Nate Foss", "Good morning! How are you? ...Good.", 1,
      "Morris", "232 Alton Drive Miami, FL", "5PM", "5/13/19", false);

    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("isDriving", new String[]{"false"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 requested rides", 4, docs.size());
    List<Integer> rideSeatsAvailable = docs
      .stream()
      .map(RideControllerSpec::getSeatsAvailable)
      .sorted()
      .collect(Collectors.toList());
    List<Integer> expectedSeatsAvailable = Arrays.asList(0, 0, 0, 0);
    assertEquals("Should have 0 seats available", expectedSeatsAvailable, rideSeatsAvailable);
  }

  @Test
  public void getDriverByRideId() {
    String jsonResult = rideController.getRide(ellisRideId.toHexString());
    Document ellis = Document.parse(jsonResult);
    assertEquals("Name should match", "Ellis", ellis.get("driver"));
    String noJsonResult = rideController.getRide(new ObjectId().toString());
    assertNull("No driver name should match", noJsonResult);
  }

}
