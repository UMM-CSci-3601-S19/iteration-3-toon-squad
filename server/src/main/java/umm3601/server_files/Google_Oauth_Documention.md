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

The HTTPS Tutorial is especially important as you need a top level domain, and it should go through Cloudflare to make the droplet's oauth implementation more secure. Also, ensure that your `environment.prod.ts` file uses your top level domain name "instead of your DigitalOcean droplet's IP address. To do this, on the line API_URL, enter `https://yoursite.yourTopLevelDomain/api/`." Contrary to the `UMM-CSci-3601's Droplet Setup Instructions`, you don't need to include the port, and in our experience, likely shouldn't. You can commit that change to master and never need to change it again manually after you pull in your repo. 

Additionally, contrary to the Droplet Setup instructions, ssh into root@[your_ip] instead of deploy-user@[your_ip].

## Modifying `Server.java`
>cd ~     
>cd your-repos-name-here/server/src/main/java/umm3601/    
>nano Server.java

### `Server.java`
#### Import java's file class
```java
  import java.io.File;
```
#### Change the serverPort to 80:
```java
  private static final int serverPort = 80;
```
#### Replace the first part of the 'try' with:
```java
try {
  File file = new File("./your-repos-name-here/server/src/main/java/umm3601/server_files/credentials.json");
  String path = file.getAbsolutePath();
  System.out.println("The path: "+ path);
  String CLIENT_SECRET_FILE = path;

  GoogleClientSecrets clientSecrets =
    GoogleClientSecrets.load(
      JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));
```
#### Ensure that in your Server.java that you set your top level domain, and in https:
```java
      // Replace clientSecret with the localhost one if testing
      //Your top level domain. Must match "redirect_uris" field in credentials.json. Must be https. No port. 
      clientSecrets.getDetails().getClientSecret(),
      authCode,
      "https://yoursite.yourTopLevelDomain")
```

## Adding (or editing) `credentials.json`
You shouldn't have credentials.json in a freshly cloned Droplet because it should hopefully be declared as hidden in the .gitignore at the root of your project. 

Add a server_files folder under umm3601 if one does not exist. This can be done using the command "mkdir" on command. Then in that folder you can create and edit credentials.json using the nano command.

>cd ~     
>cd your-repos-name-here/server/src/main/java/umm3601/      
>mkdir server_files   
>cd server_files  
>nano credentials.json

Copy and paste into credentials.json your Google OAUTH API's JSON that you can get in the Google API Console from "Download JSON." **If you are the group member that set up your project's OUATH API, make sure you go to the "IAM & admin" panel in the Developer Console and add all your group members as project owners so that anyone can retrieve this information or make changes as needed. If you are reading this as a deploying member without access, bug your project's owner for this permission; in the meantime if you really need to hit the ground running without the owner, nothing is stopping you from making your own Google API version of your project for the moment. And whoever you are, ensure your next iteration group does all this sharing before any new code is written.**

A client_secret field *may* need to be added manually to the credentials. It should come authomatically with the JSON download, but sometimes it doesn't. The client_secret can be retrieved from a field on the same page where you downloaded the JSON and set the authorized javascript origins and authorized redirect uri's. However, some people have downloaded the JSON and it did not have the secret, or the page of the download not have the field for the secret either. Refresh the page or close out of the console until it either shows up on in the field on the page or shows up in a new JSON download. This situation doesn't happen often but when it does it can be confusing. 

It should look something like this, just maybe not as formatted:

### `credentials.json`
```json
{"web":
        {"client_id":     "filled_in_by_json_download",
         "client_secret": "filled_in_by_json_download OR may_need_to_be_manually_added____see_above",
         "project_id":    "filled_in_by_json_download",
         "auth_uri":      "filled_in_by_json_download",
         "token_uri":     "filled_in_by_json_download",
         "auth_provider_x509_cert_url":"filled_in_by_json_download",
         "redirect_uris":["https://yoursite.yourTopLevelDomain(ensure this matches your Server.java)"],
         "javascript_origins":
            ["https://yoursite.yourTopLevelDomain",
            "https://your_droplet_ip",
            "http://your_droplet_ip"]
        }
}
```

## WHY these changes fix the problems
(I'll add these later when I feel like it) 

## Misc things from other documentation we might as well clear up while you're here
(I'll add these later when I feel like it) 







