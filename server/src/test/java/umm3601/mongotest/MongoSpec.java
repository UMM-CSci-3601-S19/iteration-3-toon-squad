package umm3601.mongotest;

import com.mongodb.MongoClient;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static org.junit.Assert.*;

public class MongoSpec {

  private MongoCollection<Document> rideDocuments;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    rideDocuments = db.getCollection("rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Santa Clause\",\n" +
      "                    notes: \"I will pay for gas??!\",\n" +
      "                    seatsAvailable: -1,\n" +
      "                    origin: \"South Pole\",\n" +
      "                    destination: \"North Pole\",\n" +
      "                    departureDate: \"\"\n" +
      "                    departureTime: \"\"\n" +
      "                    isDriving: false\n" +
      "                    nonSmoking: true\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Myles Bennett Dyson\",\n" +
      "                    notes: \"Get ready for the big surprise\",\n" +
      "                    seatsAvailable: 10,\n" +
      "                    origin: \"Miami\",\n" +
      "                    destination: \"232 Alton Drive\",\n" +
      "                    departureDate: \"\"\n" +
      "                    departureTime: \"\"\n" +
      "                    isDriving: true\n" +
      "                    nonSmoking: true\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Sarah Connor\",\n" +
      "                    notes: \"Skynet must be stopped\",\n" +
      "                    seatsAvailable: -1,\n" +
      "                    origin: \"Death Valley\",\n" +
      "                    destination: \"Skynet Cybernetics HQ\",\n" +
      "                    departureDate: \"\"\n" +
      "                    departureTime: \"\"\n" +
      "                    isDriving: false\n" +
      "                    nonSmoking: false\n" +
      "                }"));
    rideDocuments.insertMany(testRides);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> rides = new ArrayList<>();
    documents.into(rides);
    return rides;
  }

  private int countRides(FindIterable<Document> documents) {
    List<Document> rides = intoList(documents);
    return rides.size();
  }

  @Test
  public void shouldBeThreeRides() {
    FindIterable<Document> documents = rideDocuments.find();
    int numberOfRides = countRides(documents);
    assertEquals("Should be 3 total rides", 3, numberOfRides);
  }

  @Test
  public void shouldBeOneToNorthPole() {
    FindIterable<Document> documents = rideDocuments.find(eq("destination", "North Pole"));
    int numberOfRides = countRides(documents);
    assertEquals("Should be 1 ride to North pole", 1, numberOfRides);
  }

  @Test
  public void shouldBeOneFromMiami() {
    FindIterable<Document> documents = rideDocuments.find(eq("origin", "Miami"));
    System.out.println(documents);
    int numberOfRides = countRides(documents);
    assertEquals("Should be 1 from Earth", 1, numberOfRides);
  }

  @Test
  public void shouldBeTwoNonSmoking() {
    FindIterable<Document> documents = rideDocuments.find(eq("nonSmoking", true));
    System.out.println(documents);
    int numberOfRides = countRides(documents);
    assertEquals("Should be 2 non-smoking", 2, numberOfRides);
  }

  @Test
  public void isDrivingFalseSortedByDestination() {
    FindIterable<Document> documents
      = rideDocuments.find(eq("isDriving", false))
      .sort(Sorts.ascending("destination"));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 2", 2, docs.size());
    assertEquals("First should be to North Pole", "North Pole", docs.get(0).get("destination"));
    assertEquals("Second should be to Skynet HQ", "Skynet Cybernetics HQ", docs.get(1).get("destination"));
  }

  @Test
  public void isDrivingFalseAndSeatsNegative() {
    FindIterable<Document> documents
      = rideDocuments.find(and(eq("isDriving", false),
      eq("seatsAvailable", -1)));
    List<Document> docs = intoList(documents);
    assertEquals("First should be Santa driving", "Santa Clause", docs.get(0).get("driver"));
  }

}
