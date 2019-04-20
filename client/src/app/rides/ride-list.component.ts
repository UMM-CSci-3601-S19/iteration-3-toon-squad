import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from "@angular/material";
import {EditRideComponent} from "./edit-ride.component";
import {DeleteRideComponent} from "./delete-ride.component";

@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.scss'],
  providers: []
})

export class RideListComponent implements OnInit {
  // public so that tests can reference them (.spec.ts)
  public rides: Ride[];
  public filteredRides: Ride[];

  // text input values used in filtering
  public rideDestination: string;
  public rideOrigin: string;
  public rideDriving: boolean;

  // checkbox values for tag filtering
  public rideNonSmoking: boolean = false; // this defaults the box to be unchecked
  public rideRoundTrip: boolean = false; // this defaults the box to be unchecked

  private highlightedDestination: string = '';

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public dialog: MatDialog) {
 //   rideListService.addListener(this);
  }

  // This method is used in the HTML instead of ngModel, since it solves a problem where
  // clicking on the checkbox didn't always 'uncheck' the box. Implementing this method with
  // (click)=toggleNonSmoking, and checked="rideNonSmoking", fixes that bothersome problem.
  public toggleNonSmoking() {
    this.rideNonSmoking = !this.rideNonSmoking
  }

  public toggleRoundTrip() {
    this.rideRoundTrip = !this.rideRoundTrip
  }

  public getLocalUserId() {
    return localStorage.getItem("userId");
  }

  public checkImpossibleDate(ride: Ride) {
    return (ride.departureDate.includes("3000"))
  }

  public checkImpossibleTime(ride: Ride) {
    return (ride.departureTime.includes("99") || ride.departureTime === "")
  }

  public filterRides(searchDestination: string, searchOrigin: string,
                     searchIsDriving: boolean, searchNonSmoking: boolean,
                     searchRoundTrip: boolean): Ride[] {

    this.filteredRides = this.rides;

    // Filter by destination
    if (searchDestination != null) {
      searchDestination = searchDestination.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.destination.toLowerCase().indexOf(searchDestination) !== -1;
      });
    }

    // Filter by origin
    if (searchOrigin != null) {
      searchOrigin = searchOrigin.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchOrigin || ride.origin.toLowerCase().indexOf(searchOrigin) !== -1;
      });
    }

    if (searchIsDriving != null) {

      this.filteredRides = this.filteredRides.filter(ride => {
        return ride.isDriving === searchIsDriving;
      });
    }

    // Tag filtering works like this: if you check the nonSmoking checkbox,
    // ride-list only displays rides with nonSmoking specified. However, unchecking the box
    // displays rides with AND without the nonSmoking tag. The same is true for roundTrip tag.

    // nonSmoking Tag
    if (searchNonSmoking === true) {  // the search parameter for nonSmoking tag is TRUE

      this.filteredRides = this.filteredRides.filter(ride => {   // filter the ridelist...
        return ride.nonSmoking === searchNonSmoking;    // and return only rides with nonSmoking tag
      });
    }

    // roundTrip tag
    if (searchRoundTrip === true) { // the search parameter for roundTrip tag is TRUE

      this.filteredRides = this.filteredRides.filter(ride => {   // filter the ridelist...
        return ride.roundTrip === searchRoundTrip;   // and return only rides with roundTrip tag
      });
    }

    return this.filteredRides;
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
        this.filterRides(this.rideDestination, this.rideOrigin, this.rideDriving,
          this.rideNonSmoking, this.rideRoundTrip);
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

  /**
   * Parses ISO dates for human readable month/day, adds ordinal suffixes
   * @param {string} selectedDate The date to be parsed, an ISO string like "2019-04-10T05:00:00.000Z"
   * @returns {string} Returns human readable date like "April 12th"
   */
  public dateParse(selectedDate: string) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"];
    const dateDateFormat = new Date(selectedDate);
    const dateFullMonth = months[dateDateFormat.getMonth()];
    let date = dateDateFormat.getDate().toString();
    if (date === '1' || date === '21' || date === '31') {
      date += 'st';
    } else if (date === '2' || date === '22') {
      date += 'nd';
    } else if (date === '3' || date === '23') {
      date += 'rd';
    } else {
      date += 'th';
    }

    return dateFullMonth + " " + date;
  }

  /**
   * Converts 24 hour time to AM/PM (modified from Tushar Gupta @ https://jsfiddle.net/cse_tushar/xEuUR/)
   * @param {string} time The time to be parsed in 24 hour format, 00:00 to 23:59.
   * @returns {string} formats time like "12:00 AM" or "11:59 PM"
   */
  public hourParse(time) {
    let hours = time.substring(0,2);
    let min = time.substring(3,5);
    if(hours == 0) {
      return '12:' + min + ' AM';
    } else if (hours == 12) {
      return '12:' + min + ' PM';
    } else if (hours < 12) {
      if(hours<10){return hours[1] + ':' + min + ' AM';} //strip off leading 0, ie "09:XX" --> "9:XX"
      else{return hours + ':' + min + ' AM';}
    } else {
      hours = hours - 12;
      hours = (hours.length < 10) ? '0' + hours:hours;
      return hours + ':' + min + ' PM';
    }
  }

  giveRideToService(ride: Ride){

    // Since unspecified times are still being given an 'impossible' date, we need to change that back
    // before we send the ride to edit-ride component. NOTE: This is not necessary with impossible times,
    // since the form handles those appropriately by leaving the time field empty.
    if (ride.departureDate === "3000-01-01T05:00:00.000Z") {
      ride.departureDate = null;
    }

    this.rideListService.grabRide(ride);
  }

  openDeleteDialog(currentId: object): void {
    console.log("openDeleteDialog");
    const dialogRef = this.dialog.open(DeleteRideComponent, {
      width: '500px',
      data: {id: currentId}
    })

    dialogRef.afterClosed().subscribe(deletedRideId => {
      if (deletedRideId != null) {
        this.rideListService.deleteRide(deletedRideId).subscribe(

          result => {
            console.log("openDeleteDialog has gotten a result!");
            this.highlightedDestination = result;
            console.log("The result is " + result);
            this.refreshRides();
          },

          err => {
            console.log('There was an error deleting the ride.');
            console.log('The id we attempted to delete was  ' + deletedRideId);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  printCurrRide(ride : Ride) : void {
    console.log((ride));
  }

}
