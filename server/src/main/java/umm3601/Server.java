package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.utils.IOUtils;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;
import umm3601.ride.RideController;
import umm3601.ride.RideRequestHandler;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

import java.io.FileReader;
import java.io.InputStream;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.json.*;

public class Server {
  private static final String databaseName = "dev";
  private static final int serverPort = 4567;

  public static void main(String[] args) {

    // DATABASE
    MongoClient mongoClient = new MongoClient();
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    UserController userController = new UserController(database);
    RideController rideController = new RideController(database);

    UserRequestHandler userRequestHandler = new UserRequestHandler(userController);
    RideRequestHandler rideRequestHandler = new RideRequestHandler(rideController);

    //Configure Spark
    port(serverPort);
    enableDebugScreen();

    // Specify where assets like images will be "stored"
    staticFiles.location("/public");

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    // Redirects for the "home" page
    redirect.get("", "/");

    Route clientRoute = (req, res) -> {
      InputStream stream = Server.class.getResourceAsStream("/public/index.html");
      return IOUtils.toString(stream);
    };

    get("/", clientRoute);

    // RIDE ENDPOINTS'
    get("api/rides", rideRequestHandler::getRides);
    get("api/myRides", rideRequestHandler::getMyRides);
    post("api/rides/new", rideRequestHandler::addNewRide);
    post("api/rides/remove", rideRequestHandler::deleteRide);
    post("api/rides/update", rideRequestHandler::editRide);
    post("api/rides/join", rideRequestHandler::joinRide);

    // USER ENDPOINTS
    get("api/user/:id",userRequestHandler::getUserJSON);

    // An example of throwing an unhandled exception so you can see how the
    // Java Spark debugger displays errors like this.
    get("api/error", (req, res) -> {
      throw new RuntimeException("A demonstration error");
    });

    post("api/login", (req, res) -> {

      JSONObject obj = new JSONObject(req.body());
      String authCode = obj.getString("code");

      try {

        String CLIENT_SECRET_FILE = "./src/main/java/umm3601/credentials.json";


        GoogleClientSecrets clientSecrets =
          GoogleClientSecrets.load(
            JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));


        GoogleTokenResponse tokenResponse =
          new GoogleAuthorizationCodeTokenRequest(
            new NetHttpTransport(),
            JacksonFactory.getDefaultInstance(),
            "https://oauth2.googleapis.com/token",
            clientSecrets.getDetails().getClientId(),

            // Replace clientSecret with the localhost one if testing
            clientSecrets.getDetails().getClientSecret(),
            authCode,
            "http://localhost:9000")
            //Not sure if we have a redirectUri

            // Specify the same redirect URI that you use with your web
            // app. If you don't have a web version of your app, you can
            // specify an empty string.
            .execute();


        // Get profile info from ID token
        GoogleIdToken idToken = tokenResponse.parseIdToken();
        GoogleIdToken.Payload payload = idToken.getPayload();
        String userId = payload.getSubject();     // Use this value as a key to identify a user.
        String email = payload.getEmail();
        boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        String locale = (String) payload.get("locale");
        String familyName = (String) payload.get("family_name");
        String givenName = (String) payload.get("given_name");

        // Debugging Code
        System.out.println("---------------------------");
        System.out.println("UserID is " + userId);
        System.out.println("Email is " + email);
        System.out.println("Is Email verified? " + emailVerified);
        System.out.println("Name is " + name);
        System.out.println("Picture Url is " + pictureUrl);
        System.out.println("Locale is " + locale);
        System.out.println("familyName is " + familyName);
        System.out.println("givenName is " + givenName);
        System.out.println("---------------------------");

        return userController.addNewUser(userId, email, name, pictureUrl, familyName, givenName);

      } catch (Exception e) {
        System.out.println(e);
      }

      return "";
    });



    // Called after each request to insert the GZIP header into the response.
    // This causes the response to be compressed _if_ the client specified
    // in their request that they can accept compressed responses.
    // There's a similar "before" method that can be used to modify requests
    // before they they're processed by things like `get`.
    after("*", Server::addGzipHeader);

    get("/*", clientRoute);

    // Handle "404" file not found requests:
    notFound((req, res) -> {
      res.type("text");
      res.status(404);
      return "Sorry, we couldn't find that!";
    });
  }

  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }
}
