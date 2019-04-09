package umm3601.user;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import com.mongodb.util.JSON;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about users.
 */
public class UserController {

  private final MongoCollection<Document> userCollection;

  /**
   * Construct a controller for users.
   *
   * @param database the database containing user data
   */
  public UserController(MongoDatabase database) {
    userCollection = database.getCollection("users");
  }

  /**
   * Helper method that gets a single user specified by the `id`
   * parameter in the request.
   *
   * @param id the Mongo ID of the desired user
   * @return the desired user as a JSON object if the user with that ID is found,
   * and `null` if no user with that ID is found
   */
  public String getUser(String id) {
    FindIterable<Document> jsonUsers
      = userCollection
      .find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonUsers.iterator();
    if (iterator.hasNext()) {
      Document user = iterator.next();
      return user.toJson();
    } else {
      // We didn't find the desired user
      return null;
    }
  }


  /**
   * Helper method which iterates through the collection, receiving all
   * documents if no query parameter is specified. If the age query parameter
   * is specified, then the collection is filtered so only documents of that
   * specified age are found.
   *
   * @param queryParams the query parameters from the request
   * @return an array of Users in a JSON formatted string
   */
  public String getUsers(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("age")) {
      int targetAge = Integer.parseInt(queryParams.get("age")[0]);
      filterDoc = filterDoc.append("age", targetAge);
    }

    if (queryParams.containsKey("company")) {
      String targetContent = (queryParams.get("company")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("company", contentRegQuery);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingUsers = userCollection.find(filterDoc);

    return serializeIterable(matchingUsers);
  }

  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }



  public String addNewUser(String userId, String email, String fullName, String pictureUrl, String lastName, String firstName) {

    Document filterDoc = new Document();

    Document contentRegQuery = new Document();
    contentRegQuery.append("$regex", userId);
    contentRegQuery.append("$options", "i");
    filterDoc = filterDoc.append("userId", contentRegQuery);

    FindIterable<Document> matchingUsers = userCollection.find(filterDoc);

    if(JSON.serialize(matchingUsers).equals("[ ]")){
      ObjectId id = new ObjectId();

      Document newUser = new Document();
      newUser.append("_id", id);
      newUser.append("userId", userId);
      newUser.append("email", email);
      newUser.append("fullName", fullName);
      newUser.append("pictureUrl", pictureUrl);
      newUser.append("lastName", lastName);
      newUser.append("firstName", firstName);

      try {
        userCollection.insertOne(newUser);
        System.err.println("Successfully added new user [_id=" + id + ", userId=" + userId + " email=" + email + " fullName=" + fullName + " pictureUrl " + pictureUrl + " lastName " + lastName
          + " firstName " + firstName + "]");
        // return JSON.serialize(newUser);
        Document userInfo = new Document();
        userInfo.append("_id", matchingUsers.first().get("_id"));
        userInfo.append("email", matchingUsers.first().get("email"));
        userInfo.append("fullName", matchingUsers.first().get("fullName"));
        userInfo.append("pictureUrl", matchingUsers.first().get("pictureUrl"));
        userInfo.append("lastName", matchingUsers.first().get("lastName"));
        userInfo.append("firstName", matchingUsers.first().get("firstName"));

        return JSON.serialize(userInfo);

      } catch(MongoException me) {
        me.printStackTrace();
        return null;
      }

    } else {

      Document userInfo = new Document();
      userInfo.append("_id", matchingUsers.first().get("_id"));
      userInfo.append("email", matchingUsers.first().get("email"));
      userInfo.append("fullName", matchingUsers.first().get("fullName"));
      userInfo.append("pictureUrl", matchingUsers.first().get("pictureUrl"));
      userInfo.append("lastName", matchingUsers.first().get("lastName"));
      userInfo.append("firstName", matchingUsers.first().get("firstName"));

      return JSON.serialize(userInfo);
    }

  }
}
