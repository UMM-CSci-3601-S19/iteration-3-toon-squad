import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Ride} from './ride';
import {environment} from '../../environments/environment';
import {RideListComponent} from "./ride-list.component";


@Injectable()
export class RideListService {
  readonly baseUrl: string = environment.API_URL + 'rides';
  private rideUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  private parameterPresent(searchParam: string) {
    return this.rideUrl.indexOf(searchParam) !== -1;
  }

  private removeParameter(searchParam: string) {
    let start = this.rideUrl.indexOf(searchParam);
    let end = 0;
    if (this.rideUrl.indexOf('&') !== -1) {
      end = this.rideUrl.indexOf('&', start) + 1;
    } else {
      end = this.rideUrl.indexOf('&', start);
    }
    this.rideUrl = this.rideUrl.substring(0, start) + this.rideUrl.substring(end);
  }

  getRides(rideDriving?: string): Observable<Ride[]> {
    this.filterByDriving(rideDriving);
    return this.http.get<Ride[]>(this.rideUrl);
  }

  filterByDriving(rideDriving?: string): void {
    console.log("filter driving called")

    if (!(rideDriving == null || rideDriving === '')) {
      if (this.parameterPresent('isDriving=')) {
        // there was a previous search by driving that we need to clear
        this.removeParameter('isDriving=');
      }

      if (this.rideUrl.indexOf('?') !== -1) {
        // console.log("there was already some information passed in this url");
        this.rideUrl += 'isDriving=' + rideDriving + '&';

      } else {
        // console.log("this was the first bit of information to pass in the url");
        this.rideUrl += '?isDriving=' + rideDriving + '&';
      }


    } else {
      // console.log("there was nothing in the box to put onto the URL... reset");
      if (this.parameterPresent('isDriving=')) {
        let start = this.rideUrl.indexOf('isDriving=');
        const end = this.rideUrl.indexOf('&', start);
        if (this.rideUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.rideUrl = this.rideUrl.substring(0, start) + this.rideUrl.substring(end + 1);
      }
    }

    console.log(this.rideUrl)
  }

  addNewRide(newRide: Ride): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new ride back
      // so we know how to find/access that user again later.
      responseType: 'text' as 'json'
    };


    // Send post request to add a new user with the user data as the body with specified headers.

    //this.rlc.refreshRides();
    const id = this.http.post<string>(this.rideUrl + '/new', newRide, httpOptions);
    return id;

  }
}
