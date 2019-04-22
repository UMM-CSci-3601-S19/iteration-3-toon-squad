import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {UserService} from "./user.service";
import {ActivatedRoute} from "@angular/router";
import {Ride} from "../rides/ride";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {profileInfoObject} from "./profileInfoObject";

@Component({
  selector: 'profile-component',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit{

  public profile: User;
  public profileId: string;
  public userRides: Ride[];
  userForm: FormGroup;
  public showPhoneForm: boolean;

  constructor(private userService: UserService, private route: ActivatedRoute, private fb:FormBuilder) {
    this.createForm();
  }

  public checkImpossibleDate(ride: Ride) {
    return (ride.departureDate.includes("3000"))
  }

  public checkImpossibleTime(ride: Ride) {
    return (ride.departureTime.includes("99") || ride.departureTime === "")
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



  public getLocalUserId() {
    return localStorage.getItem("userId");
  }

  getProfile(): void{
    const id = this.route.snapshot.paramMap.get('id');
    this.profileId= id;
    this.userService.getUserById(id).subscribe(user => this.profile = user);
  }

  getUserRideFromService(): Observable<Ride[]> {
    const userRides: Observable<Ride[]> = this.userService.getMyRides(this.profileId);
    userRides.subscribe(
      rides => {
        this.userRides = rides;
      },
      err => {
        console.log(err);
      });
    return userRides;
  }

  createForm(){
    this.userForm = this.fb.group({
      phone:['',[Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/),Validators.required]],
    });
  }

  saveProfileInfo(userId: string, phoneInfo: string): void {

    const profileInfo: profileInfoObject = {
      userId: userId,
      phone: phoneInfo
    };

    this.userService.saveProfileInfo(profileInfo).subscribe(
      result => {
        console.log("here is the result from SaveProfileInfo:" + result);
      },
      err => {
        // This should probably be turned into some sort of meaningful response.
        console.log('There was an error adding the ride.');
        console.log('The error was ' + JSON.stringify(err));
      });
    window.location.reload();
  };

  ngOnInit(): void {
    this.getProfile();
    this.getUserRideFromService();
  }
}
