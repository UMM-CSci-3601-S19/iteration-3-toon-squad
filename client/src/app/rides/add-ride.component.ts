import {Component, Inject, OnInit} from '@angular/core';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideListService} from "./ride-list.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
  styleUrls: ['./add-ride.component.scss'],
})

export class AddRideComponent implements OnInit {
  minDate = new Date();

  public rides: Ride[];

  private highlightedID: string = '';

  public addRideForm: FormGroup;

  // public rideUser: string;
  public rideUser = localStorage.getItem("userFullName");
  public rideUserId = localStorage.getItem("userId");
  public rideNotes: string;
  public rideSeats: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;


  // Please leave as true for now, it's important.
  public rideDriving: boolean = true;
  public rideRoundTrip: boolean = false;
  public rideNonSmoking: boolean = false;


  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, private fb: FormBuilder) {

  }

  add_ride_validation_messages = {

    'user': [
      {type: 'required', message: 'Please enter your name'},
      {type: 'minlength', message: 'Please enter your full name'},
      {type: 'pattern', message: 'Please enter a valid name'}
    ],

    'seatsAvailable': [
      {type: 'required', message: 'Please specify how many seats you\'re offering'},
      {type: 'min', message: 'Please offer at least 1 seat'},
      {type: 'max', message: 'Can\'t offer more than 12 seats'},
    ],

    'origin': [
      {type: 'required', message: 'Origin is required'}
    ],

    'destination': [
      {type: 'required', message: 'Destination is required'}
    ],

    'driving' : [
      {type: 'required', message: 'You must indicate whether you are the user or not'},
    ]
  };

  addRide(): void {
    const newRide: Ride = {
      _id: '',
      user: this.rideUser,
      userId: this.rideUserId,
      notes: this.rideNotes,
      seatsAvailable: this.rideSeats,
      origin: this.rideOrigin,
      destination: this.rideDestination,
      departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime,
      isDriving: this.rideDriving,
      roundTrip: this.rideRoundTrip,
      nonSmoking: this.rideNonSmoking
    };

    console.log("COMPONENT: The new Ride in addRide() is " + JSON.stringify(newRide));

    if (newRide != null) {
      this.rideListService.addNewRide(newRide).subscribe(
        result => {
          console.log("here it is:" + result);
          this.highlightedID = result;
        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error adding the ride.');
          console.log('The newRide or dialogResult was ' + newRide);
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
    }
  };

  createForm() {

      this.addRideForm = this.fb.group({
        user: new FormControl('user', Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
        ])),

        origin: new FormControl('origin', Validators.compose([
          Validators.required
        ])),

        destination: new FormControl('destination', Validators.compose([
          Validators.required
        ])),

        seatsAvailable: new FormControl('seatsAvailable', Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(12)
        ])),

        driving: new FormControl('driving', Validators.compose([
          Validators.required
        ])),

        departureDate: new FormControl('departureDate'),

        departureTime: new FormControl('departureTime'),

        notes: new FormControl('notes'),
      })
  }

  refreshRides(): Observable<Ride[]> {
    // Get Rides returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)
    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        console.log("THESE ARE THE RIDES addRide Refresh got " + JSON.stringify(rides));
        this.rides = rides;
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  // IMPORTANT! This function gets called whenever the user selects 'looking for a ride'.
  //   This is so that form validator doesn't get mad for having an invalid 'rideSeats' value.
  //   Before adding the ride to the DB, the value gets set to 0 (by the ride controller).
  //   Also, ride-list component HTML won't display this number unless it is indeed a User that is driving.
  setRideSeats() {
    this.rideSeats = 1;
  }


  ngOnInit() {
    this.createForm();

  }


}



