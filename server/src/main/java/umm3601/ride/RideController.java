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


  public String getMyRides(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("userId")) {
      String targetContent = (queryParams.get("userId")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("userId", contentRegQuery);
    }

    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);

    return DatabaseHelper.serializeIterable(matchingRides);
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

    // See methods at bottom of RideController
    seatsAvailable = setSeatsForRequestedRide(isDriving, seatsAvailable);
    departureDate = checkUnspecifiedDate(departureDate);
    departureTime = checkUnspecifiedTime(departureTime);

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
      return id.toHexString();
    }
    catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }

  Boolean deleteRide(String id){

    // First format the id so Mongo can handle it correctly.
    ObjectId objId = new ObjectId(id); // _id must be formatted like this for the match to work
    Document filter = new Document("_id", objId); // Here is the actual document we match against

    try{
      // Call deleteOne(the document to match against)
      DeleteResult out = rideCollection.deleteOne(filter);
      //Returns true if 1 document was deleted
      return out.getDeletedCount() == 1;
    }
    catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }

  Boolean editRide(String id, String notes, int seatsAvailable, String origin, String destination,
                   String departureDate, String departureTime, Boolean isDriving, Boolean roundTrip, Boolean nonSmoking)
  {

    // See methods at bottom of RideController
    seatsAvailable = setSeatsForRequestedRide(isDriving, seatsAvailable);
    departureDate = checkUnspecifiedDate(departureDate);
    departureTime = checkUnspecifiedTime(departureTime);

    // First we create a document for which we can match the document we would like to update
    ObjectId objId = new ObjectId(id); // _id must be formatted like this for the match to work
    Document filter = new Document("_id", objId); // Here is the actual document we match against

    // Now we create a document containing the fields that should be updated in the matched ride document
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

    // A new document with the $set parameter so Mongo can update appropriately, and the values of $set being
    // the document we just made (which contains the fields we would like to update).
    Document updateDoc = new Document("$set", updateFields);

    // Now the actual updating of seatsAvailable, passengers, and names.
    return tryUpdateOne(filter, updateDoc);
  }

  boolean joinRide(String rideId, Number seatsAvailable, Object passengerIds, Object passengerNames) {

    // First we create a document for which we can match the document we would like to update

    ObjectId objId = new ObjectId(rideId); // _id must be formatted like this for the match to work
    Document filter = new Document("_id", objId); // Here is the actual document we match against

    // Now we create a document containing the fields that should be updated in the matched ride document
    Document updateFields = new Document();
    updateFields.append("seatsAvailable", seatsAvailable);
    updateFields.append("passengerIds", passengerIds);
    updateFields.append("passengerNames", passengerNames);

    // A new document with the $set parameter so Mongo can update appropriately, and the values of $set being
    // the document we just made (which contains the fields we would like to update).
    Document updateDoc = new Document("$set", updateFields);

    // Now the actual updating of seatsAvailable, passengers, and names.
    return tryUpdateOne(filter, updateDoc);
  }

  boolean tryUpdateOne(Document filter, Document updateDoc) {
    try {
      // Call updateOne(the document to match against, and the $set + updated fields document
      UpdateResult output = rideCollection.updateOne(filter, updateDoc);
      //returns true if 1 document was updated
      return output.getModifiedCount() == 1;
    }
    catch (MongoException e) {
      e.printStackTrace();
      return false;
    }
  }

  // We check for unspecified times, and set them way ahead into the future. This is necessary for how the date
  // sorting works. Null dates get excluded from sorting, so we can't have that. Choosing a date far in the future
  // puts this ride entry at the bottom of the sorted ride list.
  String checkUnspecifiedDate(String departureDate) {
    if (departureDate == null || departureDate == "") {
      departureDate = "3000-01-01T05:00:00.000Z";
    }
    return departureDate;
  }

  // Same idea for time. Unspecified times get excluded from sorting, and a time like "99:99" puts it at the bottom of
  // the ride list (after sorting for date).
  String checkUnspecifiedTime(String departureTime) {
    if (departureTime == null || departureTime == "") {
      departureTime = "99:99";
    }
    return departureTime;
  }

  // We should set seatsAvailable to 0 for rides requested (this is to make it less confusing for people
  // browsing the database directly.)
  int setSeatsForRequestedRide(boolean isDriving, int seatsAvailable) {
    if (!isDriving) {
      seatsAvailable = 0;
    }
    return seatsAvailable;
  }


}
