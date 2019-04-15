import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {UserService} from "./user.service";
import {ActivatedRoute} from "@angular/router";
import {Ride} from "../rides/ride";

@Component({
  selector: 'profile-component',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit{

  public profile: User;
  public profileId: string;
  public userRides: Ride[];



  constructor(private userService: UserService, private route: ActivatedRoute) {
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

  ngOnInit(): void {
    this.getProfile();
    this.getUserRideFromService();
  }

}
