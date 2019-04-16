import { Injectable } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

@Injectable()

export class ValidatorService {

  public rideForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ride_validation_messages = {

    'seatsAvailable': [
      {type: 'pattern', message: 'Please only enter numbers'},
      {type: 'required', message: 'Please specify how many seats you\'re offering'},
      {type: 'min', message: 'Please offer at least 1 seat'},
      {type: 'max', message: 'Can\'t offer more than 12 seats'}
    ],

    'origin': [
      {type: 'required', message: 'Origin is required'}
    ],

    'destination': [
      {type: 'required', message: 'Destination is required'}
    ],

    'driving' : [
      {type: 'required', message: 'You must indicate whether you are the driver or not'},
    ]
  };

  createForm() {

    this.rideForm = this.fb.group({

      origin: new FormControl('origin', Validators.compose([
        Validators.required
      ])),

      destination: new FormControl('destination', Validators.compose([
        Validators.required
      ])),

      seatsAvailable: new FormControl('seatsAvailable', Validators.compose([
        Validators.min(1),
        Validators.max(12),
        Validators.pattern('^[0-9]*$'),
        Validators.required
      ])),

      driving: new FormControl('driving', Validators.compose([
        Validators.required
      ])),

      departureDate: new FormControl('departureDate'),

      departureTime: new FormControl('departureTime'),

      notes: new FormControl('notes'),

      nonSmoking: null
    });
  }

}
