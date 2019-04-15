import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideListService} from "./ride-list.service";


@Component({
  selector: 'edit-ride.component',
  templateUrl: 'edit-ride.component.html',
})

export class EditRideComponent implements OnInit {
  editRideForm: FormGroup;
  minDate = new Date();

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

  ngOnInit() {
    this.createForm();
    console.log(this.rideListService.singleRide);
  }

}
