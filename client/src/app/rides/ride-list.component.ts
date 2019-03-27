import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.scss'],
  providers: []
})

export class RideListComponent implements OnInit {
  // public so that tests can reference them (.spec.ts)
  public rides: Ride[];

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService) {
 //   rideListService.addListener(this);
  }

  /**
   * Starts an asynchronous operation to update the rides list
   *
   */
  refreshRides(): Observable<Ride[]> {
    // Get Rides returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)
    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        this.rides = rides;
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  loadService(): void {
    this.rideListService.getRides().subscribe(
      rides => {
        this.rides = rides;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshRides();
    this.loadService();
  }

  // Lifted from the server side code. Parses ISO dates for human readable month/day. For example:
// 2019-03-26T05:00:00.000Z becomes March 26th
  public dateParse(selectedDate: string) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(selectedDate);
    const dateFullMonth = months[date.getMonth()];
    const dateDay = days[date.getDay()];
    console.log('It is ' + dateDay + ' my dude');
    let dateDate = date.getDate().toString();
    if (dateDate === '1' || dateDate === '21' || dateDate === '31') {
      dateDate += 'st';
    } else if (dateDate === '2' || dateDate === '22') {
      dateDate += 'nd';
    } else if (dateDate === '3' || dateDate === '23') {
      dateDate += 'rd';
    } else {
      dateDate += 'th';
    }

    return dateFullMonth + " " + dateDate;
  }
}
