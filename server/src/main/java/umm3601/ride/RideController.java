package umm3601.ride;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import umm3601.DatabaseHelper;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.TimeZone;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.orderBy;

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

    //https://stackoverflow.com/a/3914498 @ Joachim Sauer (Oct 12 2010) & L S (Jun 29 2016)
    //Creates a date in ISO format
    TimeZone tz = TimeZone.getTimeZone("America/Chicago");
    DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'"); // Quoted "Z" to indicate UTC, no timezone offset
    df.setTimeZone(tz);
    String nowAsISO = df.format(new Date());

    //siddhartha jain, Feb 24, 17
    // @ https://stackoverflow.com/questions/42438887/how-to-sort-the-documents-we-got-from-find-command-in-mongodb
    Bson sortDate = ascending("departureDate");
    Bson sortTime = ascending("departureTime");

    //filters out dates that aren't greater than or equal to today's date
    Bson pastDate = gte("departureDate", nowAsISO.substring(0,10)+"T05:00:00.000Z");
    //filters out times that aren't greater than or equal to the current time
    Bson pastTime = gte("departureTime", nowAsISO.substring(11,16));
    //filters out anything past the current date and time
    Bson sameDayPastTime = and(pastDate, pastTime);
    //filters out anything today or later
    Bson tomorrowOrLater = gt("departureDate",nowAsISO.substring(0,10)+"T05:00:00.000Z");
    //Only shows dates that are either (today ^ (today ^ laterThanNow)) or dates after today
    Bson oldRides= or(sameDayPastTime, tomorrowOrLater);

    Bson order = orderBy(sortDate, sortTime);

    FindIterable<Document> matchingRides = rideCollection.find(oldRides).filter(oldRides).sort(order);

    return DatabaseHelper.serializeIterable(matchingRides);
  }

  public String addNewRide(String user, String userId, String notes, int seatsAvailable, String origin, String destination,
                           String departureDate, String departureTime, boolean isDriving, boolean roundTrip, boolean nonSmoking) {


    if (!isDriving) {
      seatsAvailable = 0;
    }

    if (departureDate == null) {
      departureDate = "3000-01-01T05:00:00.000Z";
    }

    if (departureTime == null) {
      departureTime = "99:99";
    }

    Document newRide = new Document();
    newRide.append("user", user);
    newRide.append("userId", userId);
    newRide.append("notes", notes);
    newRide.append("seatsAvailable", seatsAvailable);
    newRide.append("origin", origin);
    newRide.append("destination", destination);
    newRide.append("departureDate", departureDate);
    newRide.append("departureTime", departureTime);
    newRide.append("isDriving", isDriving);
    newRide.append("roundTrip", roundTrip);
    newRide.append("nonSmoking", nonSmoking);

    try {
      rideCollection.insertOne(newRide);
      ObjectId id = newRide.getObjectId("_id");

      System.err.println("Successfully added new ride [_id=" + id + ", user=" + user + ", userId=" +
        userId + ", notes=" + notes + ", seatsAvailable=" + seatsAvailable + ", origin=" + origin +
        ", destination=" + destination + ", departureDate=" + departureDate + ", departureTime=" + departureTime +
        ", isDriving=" + isDriving + ", roundTrip=" + roundTrip + ", nonSmoking=" + nonSmoking + ']');

      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }

  Boolean deleteRide(String id){
    ObjectId objId = new ObjectId(id);
    try{
      DeleteResult out = rideCollection.deleteOne(new Document("_id", objId));
      //Returns true if at least 1 document was deleted
      return out.getDeletedCount() != 0;
    }
    catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }

  Boolean editRide(String id, String notes, Number seatsAvailable, String origin, String destination,
                   String departureDate, String departureTime, Boolean isDriving, Boolean roundTrip, Boolean nonSmoking)
  {

    if (!isDriving) {
      seatsAvailable = 0;
    }

    if (departureDate == null || departureDate == "") {
      departureDate = "3000-01-01T05:00:00.000Z";
    }

    if (departureTime == null || departureTime == "") {
      departureTime = "99:99";
    }

    ObjectId objId = new ObjectId(id);
    Document filter = new Document("_id", objId);

    Document updateFields = new Document();
    updateFields.append("notes", notes);
    updateFields.append("seatsAvailable", seatsAvailable);
    updateFields.append("origin", origin);
    updateFields.append("destination", destination);
    updateFields.append("departureDate", departureDate);
    updateFields.append("departureTime", departureTime);
    updateFields.append("isDriving", isDriving);
    updateFields.append("roundTrip", roundTrip);
    updateFields.append("nonSmoking", nonSmoking);

    Document updateDoc = new Document("$set", updateFields);

    try{
      UpdateResult out = rideCollection.updateOne(filter, updateDoc);
      //returns false if no documents were modified, true otherwise
      return out.getModifiedCount() != 0;
    }

    catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }
}
