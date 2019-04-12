package umm3601.user;


import spark.Request;
import spark.Response;


public class UserRequestHandler {

  private final UserController userController;

  public UserRequestHandler(UserController userController) {
    this.userController = userController;
  }

}
