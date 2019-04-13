import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {UserListService} from "./user.service";

@Component({
  selector: 'profile-component',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit{

  public profile: User;
  public id: string;

  constructor(private userService: UserListService) {
    this.id = localStorage.getItem("oid");
  }

  public mockProfile: User = {
    _id: '',
    userId: "'655477182929676100000'",
    email: "Aquamate64@morris.umn.edu",
    fullName: "Imogene Swanson",
    pictureUrl: "https://picsum.photos/200/300/?random",
    lastName: "Swanson",
    firstName: "Imogene",
    phone: "(981) 461-3498"
};


/*
  profile = this.mockProfile;
*/

  refreshProfile(): Observable<User> {
    const profile: Observable<User> = this.userService.getUserById(this.id);
    profile.subscribe(
      user => {
        this.profile = user;
      },
      err => {
        console.log(err);
      });
    return profile;
  }

  ngOnInit(): void {
    this.refreshProfile();
  }
}
