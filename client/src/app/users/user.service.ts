import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {environment} from '../../environments/environment';



@Injectable()
export class UserListService {
  readonly baseUrl: string = environment.API_URL + 'user';
  private userUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getUserById(id: string): Observable<User> {
    console.log("This url get UserById goes to is " + this.userUrl + '/'  + id);
    return this.http.get<User>(this.userUrl + '/' + id);
  }
}
