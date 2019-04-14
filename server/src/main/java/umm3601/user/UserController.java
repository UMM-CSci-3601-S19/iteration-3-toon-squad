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

  public UserController(MongoDatabase database) {
    userCollection = database.getCollection("users");
  }

  public String getUser(String userId) {
    FindIterable<Document> jsonUser = userCollection.find(eq("userId", userId));

    Iterator<Document> iterator = jsonUser.iterator();
    if (iterator.hasNext()) {
      Document user = iterator.next();
      return user.toJson();
    } else {
      // We didn't find the desired user
      return null;
    }
  }

  public String addNewUser(String userId, String email, String fullName, String pictureUrl, String lastName, String firstName) {

    Document filterDoc = new Document();

    Document contentRegQuery = new Document();
    contentRegQuery.append("$regex", userId);
    contentRegQuery.append("$options", "i");
    filterDoc = filterDoc.append("userId", contentRegQuery);

    FindIterable<Document> matchingUsers = userCollection.find(filterDoc);
    System.out.println("HERRREEEEEE~~~!!" + matchingUsers);

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
         return JSON.serialize(newUser);

//        Document userInfo = new Document();
//        userInfo.append("_id", matchingUsers.first().get("_id"));
//        userInfo.append("userId", matchingUsers.first().get("userId"));
//        userInfo.append("email", matchingUsers.first().get("email"));
//        userInfo.append("fullName", matchingUsers.first().get("fullName"));
//        userInfo.append("pictureUrl", matchingUsers.first().get("pictureUrl"));
//        userInfo.append("lastName", matchingUsers.first().get("lastName"));
//        userInfo.append("firstName", matchingUsers.first().get("firstName"));

//        return JSON.serialize(userInfo);

      } catch(MongoException me) {
        me.printStackTrace();
        return null;
      }

    } else {

      Document userInfo = new Document();
      userInfo.append("_id", matchingUsers.first().get("_id"));
      userInfo.append("userId", matchingUsers.first().get("userId"));
      userInfo.append("email", matchingUsers.first().get("email"));
      userInfo.append("fullName", matchingUsers.first().get("fullName"));
      userInfo.append("pictureUrl", matchingUsers.first().get("pictureUrl"));
      userInfo.append("lastName", matchingUsers.first().get("lastName"));
      userInfo.append("firstName", matchingUsers.first().get("firstName"));

      return JSON.serialize(userInfo);
    }

  }
}
