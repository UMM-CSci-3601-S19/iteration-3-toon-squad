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
   * Method called from Server when the 'api/rides/:id' endpoint is received.
   * Get a JSON response with a list of all the rides in the database.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return one ride in JSON formatted string and if it fails it will return text with a different HTTP status code
   */
  public String getRideJSON(Request req, Response res) {
    res.type("application/json");
    String id = req.params("id");
    String ride;
    try {
      ride = rideController.getRide(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested ride id " + id + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (ride != null) {
      return ride;
    } else {
      res.status(404);
      res.body("The requested ride with id " + id + " was not found");
      return "";
    }
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

  /**
   * Converts a number into a month string (ie 3 -> "March")
   * Joe (Jun 24, 09), edited by mmcdole (Jun 24, 09) @ https://stackoverflow.com/a/1038580
   *
   * @param month the integer to be turned into a month string
   */
  public String getMonth(int month) {
    return new DateFormatSymbols().getMonths()[month-1];
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

    System.out.println(newRide);

    String driver = newRide.getString("driver");
    String notes = newRide.getString("notes");
    int seatsAvailable = newRide.getInteger("seatsAvailable");
    String origin = newRide.getString("origin");
    String destination = newRide.getString("destination");
    String departureDate = parseDate(newRide.getString("departureDate"));
    String departureTime = parseTime(newRide.getString("departureTime"));
    boolean isDriving = newRide.getBoolean("isDriving");
    boolean nonSmoking = newRide.getBoolean("nonSmoking");

    System.out.println("Adding new ride [driver=" + driver + ", driving=" + isDriving + ", notes=" + notes + ", seatsAvailable=" + seatsAvailable
      + ", origin=" + origin + ", destination=" + destination + ", departureTime=" + departureTime + ", departureDate="
      + departureDate + ", isDriving=" + isDriving + ", nonSmoking=" + nonSmoking + ']');

    return rideController.addNewRide(driver, notes, seatsAvailable, origin, destination,
      departureTime, departureDate, isDriving, nonSmoking);
  }

  private String parseDate(String rawDate) {

    if (rawDate != null) {
      //Date from the datepicker is by default in ISO time, like "2019-03-13T05:00:00.000Z". departureDateISO retrieves that.
      //departureDateYYYYMMDD breaks off the irrelevant end data from the "T" and on. From there, month and day are broken off.
      String departureDateISO = rawDate;
      String departureDateYYYYMMDD = departureDateISO.split("T", 2)[0];
      String departureDateMonthUnformatted = departureDateYYYYMMDD.split("-", 3)[1];
      String departureDateDayUnformatted = departureDateYYYYMMDD.split("-", 3)[2]
        .replaceFirst("^0+(?!$)", "");

      //    Adds the right ending to dates, like the day 12 to 12th or the day 3 to 3rd
      int departureDateDayInt = Integer.parseInt(departureDateDayUnformatted);

      if (departureDateDayInt == 1 || departureDateDayInt == 21 || departureDateDayInt == 31) {
        departureDateDay = departureDateDayUnformatted.concat("st");
      } else if (departureDateDayInt == 2 || departureDateDayInt == 22) {
        departureDateDay = departureDateDayUnformatted.concat("nd");
      } else if (departureDateDayInt == 3 || departureDateDayInt == 23) {
        departureDateDay = departureDateDayUnformatted.concat("rd");
      } else {
        departureDateDay = departureDateDayUnformatted.concat("th");
      }

      //    turns the month number into a month name
      int departureDateMonthInt = Integer.parseInt(departureDateMonthUnformatted);
      String departureDateMonth = getMonth(departureDateMonthInt);

      String departureDateFinal = departureDateMonth + " " + departureDateDay;
      return departureDateFinal;
    } else {
      return "";
    }
  }

  private String parseTime(String rawTime) {
    if (rawTime != null) {
      // Agamprett Singh (Jul 3, 2018) @ https://www.quora.com/How-can-I-convert-the-24-hour-time-format-into-the-12-hour-format-in-Java/answer/Agampreet-Singh-4
      // Converts 24 hour time to 12 hour AM/PM time
      return LocalTime.parse(rawTime, DateTimeFormatter.ofPattern("HH:mm"))
        .format(DateTimeFormatter.ofPattern("hh:mm a"));
    } else {
      return "";
    }
  }
}
