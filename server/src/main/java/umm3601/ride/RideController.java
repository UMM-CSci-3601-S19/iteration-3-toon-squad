package umm3601.ride;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.DatabaseHelper;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

public class RideController {

  private final MongoCollection<Document> rideCollection;

  /**
   * Construct a controller for rides.
   *
   * @param database the database containing ride data
   */
  public RideController(MongoDatabase database) {
    rideCollection = database.getCollection("rides");
  }

  /**
   * Helper method that gets a single ride specified by the `id`
   * parameter in the request.
   *
   * @param id the Mongo ID of the desired ride
   * @return the desired ride as a JSON object if the ride with that ID is found,
   * and `null` if no ride with that ID is found
   */
  public String getRide(String id) {
    FindIterable<Document> jsonRides
      = rideCollection
      .find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonRides.iterator();
    if (iterator.hasNext()) {
      Document ride = iterator.next();
      return ride.toJson();
    } else {
      // We didn't find the desired ride
      return null;
    }
  }

  /**
   * Helper method which returns all existing rides.
   *
   * @return an array of Rides in a JSON formatted string
   */
  public String getRides(Map<String, String[]> queryParams) {

    // server-side filtering will happen here if we sell that in future stories.
    // Right now, this method simply returns all existing rides.
    Document filterDoc = new Document();

    if (queryParams.containsKey("isDriving")) {
      String targetDriving = (queryParams.get("isDriving")[0]);
      boolean targetDrivingBool;
      if (targetDriving.equals("true")) {
        targetDrivingBool = true;
      } else {
        targetDrivingBool = false;
      }
      filterDoc = filterDoc.append("isDriving", targetDrivingBool);
    }

    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);

    return DatabaseHelper.serializeIterable(matchingRides);
  }

  public String addNewRide(String driver, String notes, int seatsAvailable, String origin, String destination,
                           String departureTime, String departureDate, Boolean isDriving, boolean nonSmoking) {

    if (!isDriving) {
      seatsAvailable = 0;
    }

    Document newRide = new Document();
    newRide.append("driver", driver);
    newRide.append("notes", notes);
    newRide.append("seatsAvailable", seatsAvailable);
    newRide.append("origin", origin);
    newRide.append("destination", destination);
    newRide.append("departureTime", departureTime);
    newRide.append("departureDate", departureDate);
    newRide.append("isDriving", isDriving);
    newRide.append("nonSmoking", nonSmoking);

    System.out.println(newRide);

    try {
      rideCollection.insertOne(newRide);
      ObjectId id = newRide.getObjectId("_id");
      System.err.println("Successfully added new ride [_id=" + id + ", driver=" + driver + ", notes=" + notes +
        ", seatsAvailable=" + seatsAvailable + ", origin=" + origin + ", destination=" + destination +
        ", departureTime=" + departureTime + ", departureDate=" + departureDate + ", isDriving=" + isDriving +
        ", nonSmoking=" + nonSmoking + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
