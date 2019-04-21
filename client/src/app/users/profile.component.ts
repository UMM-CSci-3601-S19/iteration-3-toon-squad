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
