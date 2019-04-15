import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {Ride} from "../rides/ride";
import {environment} from '../../environments/environment';



@Injectable()
export class UserService {
  readonly baseUrl: string = environment.API_URL + 'user';
  private userUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(this.userUrl + '/' + userId);
  }

  getMyRides(userId: string): Observable<Ride[]> {
    console.log("This is where we are sending the url rom getMyRides " + environment.API_URL + 'myRides?userId=' + userId);
    return this.http.get<Ride[]>(environment.API_URL + 'myRides?userId=' + userId);
  }
}
