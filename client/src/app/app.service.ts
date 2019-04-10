import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import 'rxjs/add/observable/of';

declare let gapi: any;

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {
  }

  googleAuth;

  initClient() {
    gapi.client.init({
      'clientId': '121498793046-vuuo0thmp21gmnskaei3330bq50ni6s7.apps.googleusercontent.com',
      'scope': 'profile email'
    });
  }

  handleClientLoad() {
    gapi.load('client:auth2', this.initClient);
  }

  // This sends the auth code of our user to the server and stores the fields in local storage when we get data back
  // from gapi
  sendAuthCode(code: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
      .subscribe(onSuccess => {
        console.log("Code sent to server");
        console.log(onSuccess["_id"]);
        console.log(onSuccess["_id"]["$oid"]);
        console.log(onSuccess["email"]);
        console.log(onSuccess["fullName"]);
        console.log(onSuccess["lastName"]);
        console.log(onSuccess["firstName"]);
        console.log(onSuccess["pictureUrl"]);
        localStorage.setItem("_id", onSuccess["_id"]);
        localStorage.setItem("oid", onSuccess["_id"]["$oid"]);
        localStorage.setItem("email", onSuccess["email"]);
        localStorage.setItem("userFullName", onSuccess["fullName"]);
        localStorage.setItem("userLastName", onSuccess["lastName"]);
        localStorage.setItem("userFirstName", onSuccess["firstName"]);
        localStorage.setItem("pictureUrl", onSuccess["pictureUrl"]);

      }, onFail => {
        console.log("ERROR: Code couldn't be sent to the server");
      });
  }


  signIn() {
    this.googleAuth = gapi.auth2.getAuthInstance();
    console.log(" This is google Auth " + this.googleAuth);
    this.googleAuth.grantOfflineAccess().then((resp) => {
      localStorage.setItem('isSignedIn', 'true');
      this.sendAuthCode(resp.code);
    });
  }

  signOut() {
    this.handleClientLoad();

    this.googleAuth = gapi.auth2.getAuthInstance();

    this.googleAuth.then(() => {
      this.googleAuth.signOut();
      localStorage.setItem('isSignedIn', 'false');
      localStorage.setItem("userID", "");
      window.location.reload();
    })
  }

  public isSignedIn(): boolean {
    status = localStorage.getItem('isSignedIn');
    if (status == 'true') {
      return true;
    }
    else {
      return false;
    }
  }

}
