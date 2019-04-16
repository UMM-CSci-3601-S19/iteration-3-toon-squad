import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideListService} from "./ride-list.service";
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'edit-ride.component',
  templateUrl: 'edit-ride.component.html',
})

export class EditRideComponent implements OnInit {
  editRideForm: FormGroup;
  minDate = new Date();
  public rides: Ride[];
  private highlightedID: string = '';

  public rideId: string;
  public rideUser = localStorage.getItem("userFullName");
  public rideUserId = localStorage.getItem("userId");
  public rideNotes: string;
  public rideSeatsAvailable: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;


  // Please leave as true for now, it's important.
  public rideIsDriving: boolean = true;
  public rideRoundTrip: boolean = false;
  public rideNonSmoking: boolean = false;

  constructor(
    public rideListService : RideListService, private fb: FormBuilder) {
  }

  edit_ride_validation_messages = {

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

  editRide(): void {
    const editedRide: Ride = {
      _id: this.rideId,
      user: this.rideUser,
      userId: this.rideUserId,
      notes: this.rideNotes,
      seatsAvailable: this.rideSeatsAvailable,
      origin: this.rideOrigin,
      destination: this.rideDestination,
      departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime,
      isDriving: this.rideIsDriving,
      roundTrip: this.rideRoundTrip,
      nonSmoking: this.rideNonSmoking
    };

    console.log(" The edited Ride in editRide() is " + JSON.stringify(editedRide));

    if (editedRide != null) {
      this.rideListService.editRide(editedRide).subscribe(
        result => {
          console.log("here it is:" + result);
          this.highlightedID = result;
        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error adding the ride.');
          console.log('The newRide or dialogResult was ' + editedRide);
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

    this.editRideForm = this.fb.group({
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
        this.rides = rides;
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  setRideFields() {
    this.rideId = this.rideListService.singleRide._id;
    this.rideUser = this.rideListService.singleRide.user;
    this.rideUserId = this.rideListService.singleRide.userId;
    this.rideNotes = this.rideListService.singleRide.notes;
    this.rideSeatsAvailable = this.rideListService.singleRide.seatsAvailable;
    this.rideOrigin = this.rideListService.singleRide.origin;
    this.rideDestination = this.rideListService.singleRide.destination;
    this.rideDepartureDate = this.rideListService.singleRide.departureDate;
    this.rideDepartureTime = this.rideListService.singleRide.departureTime;
    this.rideIsDriving = this.rideListService.singleRide.isDriving;
    this.rideRoundTrip = this.rideListService.singleRide.roundTrip;
    this.rideNonSmoking = this.rideListService.singleRide.nonSmoking
  }

  ngOnInit() {
    this.createForm();
    console.log(this.rideListService.singleRide);
    this.setRideFields();
  }

}
