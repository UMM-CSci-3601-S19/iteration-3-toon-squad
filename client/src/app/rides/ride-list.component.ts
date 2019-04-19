import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from "@angular/material";
import {DeleteRideComponent} from "./delete-ride.component";
import {joinRideObject} from "./joinRideObject";

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

  // target values used in filtering
  public rideDestination: string;
  public rideOrigin: string;
  public rideDriving: boolean;
  public rideNonSmoking: boolean = false; // this defaults the box to be unchecked
  private highlightedDestination: string = '';
  public currUserId = localStorage.getItem("userId");
  public currUserFullName = localStorage.getItem("userFullName");
  private highlightedID: string = '';

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public dialog: MatDialog) {
 //   rideListService.addListener(this);
  }

  // This method is used in the HTML instead of ngModel, since it solves a problem where
  // clicking on the checkbox didn't always 'uncheck' the box. Implementing this method with
  // (click)=toggleNonSmoking, and checked="rideNonSmoking", fixes that bothersome problem.
  public toggleNonSmoking() {
    this.rideNonSmoking = !this.rideNonSmoking;
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
                     searchIsDriving: boolean, searchNonSmoking): Ride[] {

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

    // We only check for true, so that an unchecked box allows all rides to come through.
    if (searchNonSmoking === true) {

      this.filteredRides = this.filteredRides.filter(ride => {
        return ride.nonSmoking === searchNonSmoking;
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
        this.filterRides(this.rideDestination, this.rideOrigin, this.rideDriving, this.rideNonSmoking);
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
            console.log('openDeleteDialog has gotten a result!');
            this.highlightedDestination = result;
            console.log('The result is ' + result);
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

  printCurrRide(ride: Ride): void {
    console.log((ride));
  }


  joinRide(_id: string, seatsAvailable: number, passengerIds: string[], passengerNames: string[]): void {

    passengerIds.push(this.currUserId);
    passengerNames.push(this.currUserFullName);
    seatsAvailable = (seatsAvailable - 1);

    const joinedRide: joinRideObject = {
      _id: _id,
      seatsAvailable: seatsAvailable,
      passengerIds: passengerIds,
      passengerNames: passengerNames,
    };

    this.rideListService.joinRide(joinedRide).subscribe(

        result => {
          console.log("here it is:" + result);
          this.highlightedID = result;
        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error adding the ride.');
          console.log('The newRide or dialogResult was ' );
          console.log('The error was ' + JSON.stringify(err));
        });

      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();

  };




  // openJoinDialog(currentId: string): void{
  //   const currentRide: Ride = {
  //     _id: currentId
  //   };
  //   // Constructs dialog box
  //   const dialogRef = this.dialog.open(EditRideComponent, {
  //     width: '500px',
  //     data: {ride: currentRide}
  //   });
  //   dialogRef.afterClosed().subscribe(currentRide => {
  //     if (currentRide != null) {
  //       this.rideListService.editRide(currentRide).subscribe(
  //         result => {
  //           this.highlightedDestination = result;
  //           this.refreshRides();
  //           console.log('The currentRide or dialogResult was ' + JSON.stringify(currentRide));
  //         },
  //         err => {
  //           console.log('There was an error editing the ride.');
  //           console.log('The currentRide or dialogResult was error ' + JSON.stringify(currentRide));
  //           console.log('The error was ' + JSON.stringify(err));
  //         });
  //     }
  //   });
  // }
}
