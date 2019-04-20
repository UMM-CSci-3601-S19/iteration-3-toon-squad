# Google OAUTH: Deploying on Droplet

## The Problem
Setting up Google OATH to work on localhost is already one big learning process, but using documentation from previous classes ("Assumptions/Prerequisites") makes it viable. That said, that documentation is missing key steps to make Google OAUTH work on a Droplet. This guide builds upon the previous documentation and supplements it. 

That said, there are two major issues with deploying to a Droplet. 
1. The path for `String CLIENT_SECRET_FILE` in Server.java is unreachable as is in the Megabitron documentation.  
2. Our version of Google OATH implementation is out of date compared to how Google's OAUTH documentation and Google's API Console works.
3. Megabittron's documentation is set as is for localhost information and not top level domain information.

The following documentation is straight to the point what you should add or change. The end of the documentation had a section as to WHY these changes matter and how they relate to the problem. Additionally, some misc things that may or may not be relevant to OAUTH are clarified at the end. 

## Assumptions/Prerequisites
*  [Megabittron's Google OATH tutorial](https://github.com/UMM-CSci-3601-S18/iteration-4-megabittron/blob/master/Documentation/Secure%20Google%20Login/DocumentationForGoogleLogin.md)
* [Megabittron's HTTPS Tutorial](https://github.com/UMM-CSci-3601-S18/iteration-4-megabittron/blob/master/Documentation/HTTPS.md)
* [UMM-CSci-3601's Droplet Setup Instructions](https://github.com/UMM-CSci-3601/droplet-setup-and-build)

## Modifying `Server.java`
>cd ~     
>cd iteration-3-toon-squad/server/src/main/java/umm3601/    
>nano Server.java

### `Server.java`
#### Replace the first part of the 'try' with
```java
  try {
          File file = new File("./iteration-3-toon-squad/server/src/main/java/umm3601/server_files/credentials.json");
          String path = file.getAbsolutePath();
          System.out.println("The path: "+ path);
          String CLIENT_SECRET_FILE = path;
  
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
              //Your top level domain. Must match "redirect_uris" field in credentials.json. Must be https. No port. 
              clientSecrets.getDetails().getClientSecret(),
              authCode,
              "https://moridemorris.site") 
              
```
## Adding (or editing) `credentials.json`
You shouldn't have credentials.json in a freshly cloned Droplet because it should hopefully be declared as hidden in the .gitignore at the root of your project. 

Add a server_files folder under umm3601 if one does not exist. This can be done using the command "mkdir" on command. Then in that folder you can create and edit credentials.json using the nano command.

>cd ~     
>cd iteration-3-toon-squad/server/src/main/java/umm3601/      
>mkdir server_files   
>cd server_files  
>nano credentials.json

Copy and paste into credentials.json your Google OAUTH API's JSON that you can get in the Google API Console from "Download JSON."

A client_secret field will need to be added to the credentials. The client_secret can be retrieved from the same page where you downloaded the json and set the authorized javascript origins and authorized redirect uri's. 

It should look something like this, just maybe not as formatted:

### `credentials.json`
```json
{"web":
        {"client_id":     "filled_in_by_json_download",
         "client_secret":   "INSERT_YOUR_CLIENT_SECRET",
         "project_id":    "filled_in_by_json_download",
         "auth_uri":      "filled_in_by_json_download",
         "token_uri":     "filled_in_by_json_download",
         "auth_provider_x509_cert_url":"filled_in_by_json_download",
         "redirect_uris":["https://yousite.yourTopLevelDomain(ensure this matches you Server.java)"],
         "javascript_origins":
            ["https://yousite.yourTopLevelDomain",
            "https://your_droplet_ip",
            "http://your_droplet_ip"]
        }
}
```

## WHY these changes fix the problems
(I'll add these later when I feel like it) 

## Misc things from other documentation we might as well clear up while you're here
(I'll add these later when I feel like it) 







