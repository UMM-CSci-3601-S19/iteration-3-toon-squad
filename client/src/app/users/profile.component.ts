import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {UserService} from "./user.service";
import {ActivatedRoute} from "@angular/router";
import {Ride} from "../rides/ride";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  userPhone: string;

  constructor(private userService: UserService, private route: ActivatedRoute, private fb:FormBuilder) {
    this.createForm();
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

  savePhone(phoneString: string){
    this.userPhone = phoneString;
  }


  ngOnInit(): void {
    this.getProfile();
    this.getUserRideFromService();
  }
}
