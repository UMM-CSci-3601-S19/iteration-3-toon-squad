import {Component, Inject, OnInit} from '@angular/core';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideListComponent} from "./ride-list.component";
import {RideListService} from "./ride-list.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
  styleUrls: ['./add-ride.component.scss'],
  providers: [ RideListComponent],
})

export class AddRideComponent implements OnInit {

  public rides: Ride[];

  private highlightedID: string = '';

  public addRideForm: FormGroup;

  public rideDriver: string;
  public rideNotes: string;
  public rideSeats: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, private fb: FormBuilder) {

  }

  add_ride_validation_messages = {
    'driver': [
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
    ]
  };

  addRide(): void {
    const newRide: Ride = {_id: '',
      driver: this.rideDriver,
      notes: this.rideNotes,
      seatsAvailable: Number(this.rideSeats),
      origin: this.rideOrigin,
      destination: this.rideDestination,
      // departureDate: dateParse(this.rideDepartureDate),
      departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime};

    console.log(newRide);

    if (newRide != null) {
      this.rideListService.addNewRide(newRide).subscribe(
        result => {
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
    // This is the only solution to a refresh-on-addride
      // we were having that worked consistently, it's hacky but seems to work well.
    }
  };

  createForm() {
    this.addRideForm = this.fb.group({
      driver: new FormControl('driver', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),

      seatsAvailable: new FormControl('seatsAvailable', Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(12)
      ])),

      origin: new FormControl('origin', Validators.compose([
        Validators.required
      ])),

      destination: new FormControl('destination', Validators.compose([
        Validators.required
      ])),

      departureDate: new FormControl('departureDate'),

      departureTime: new FormControl('departureTime'),

      notes: new FormControl('notes')
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


  ngOnInit() {
    this.createForm();
  }


}



