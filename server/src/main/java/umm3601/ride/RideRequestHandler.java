package umm3601.ride;

import org.bson.Document;
import spark.Request;
import spark.Response;

import java.text.DateFormatSymbols;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class RideRequestHandler {

  private final RideController rideController;
  private String departureDateDay;

  public RideRequestHandler(RideController rideController) {
    this.rideController = rideController;
  }

  /**
   * Method called from Server when the 'api/rides' endpoint is received.
   * This handles the request received and the response that will be sent back.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return an array of rides in JSON formatted String
   */
  public String getRides(Request req, Response res) {
    res.type("application/json");
    return rideController.getRides(req.queryMap().toMap());
  }



  public String getMyRides(Request req, Response res) {
    res.type("application/json");
    return rideController.getMyRides(req.queryMap().toMap());
  }

  /**
   * Method called from Server when the 'api/rides/new' endpoint is received.
   * Gets specified rides info from request and calls addNewRide helper method
   * to append that info to a document
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return a boolean as whether the ride was added successfully or not
   */
  public String addNewRide(Request req, Response res) {
    res.type("application/json");

    Document newRide = Document.parse(req.body());

    String user = newRide.getString("user");
    String userId = newRide.getString("userId");
    String notes = newRide.getString("notes");
    int seatsAvailable = newRide.getInteger("seatsAvailable");
    String origin = newRide.getString("origin");
    String destination = newRide.getString("destination");
    String departureDate = newRide.getString("departureDate");
    String departureTime = newRide.getString("departureTime");
    boolean isDriving = newRide.getBoolean("isDriving");
    boolean roundTrip = newRide.getBoolean("roundTrip");
    boolean nonSmoking = newRide.getBoolean("nonSmoking");


    System.out.println("Adding new ride [user=" + user + ", userId=" + userId + ", driving=" + isDriving +
      ", notes=" + notes + ", seatsAvailable=" + seatsAvailable +
      ", origin=" + origin + ", destination=" + destination +
       ", departureDate=" + departureDate + ", departureTime=" + departureTime +
      ", isDriving=" + isDriving + ", roundTrip=" + roundTrip +", nonSmoking=" + nonSmoking + ']');

    return rideController.addNewRide(user, userId, notes, seatsAvailable, origin, destination,
      departureDate, departureTime, isDriving, roundTrip, nonSmoking);

  }

}
