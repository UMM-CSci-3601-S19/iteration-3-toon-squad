package umm3601.user;


import spark.Request;
import spark.Response;


public class UserRequestHandler {

  private final UserController userController;

  public UserRequestHandler(UserController userController) {
    this.userController = userController;
  }


  public String getUserJSON(Request req, Response res) {
    res.type("application/json");
    String userId = req.params("id");
    System.err.println("The user userId req params got is " + userId);
    String user;
    try {
      user = userController.getUser(userId);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested user userId " + userId + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (user != null) {
      return user;
    } else {
      res.status(404);
      res.body("The requested user with userId " + userId + " was not found");
      return "";
    }
  }


}
