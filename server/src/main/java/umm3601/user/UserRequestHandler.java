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
    String id = req.params("id");
    System.err.println("The id req params got was is " + id);
    String user;
    try {
      user = userController.getUser(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested user id " + id + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (user != null) {
      return user;
    } else {
      res.status(404);
      res.body("The requested user with id " + id + " was not found");
      return "";
    }
  }


}
