import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";

@Component({
  selector: 'profile-component',
  templateUrl: 'profile.component.html'
})

export class ProfileComponent{
/*  implements OnInit*/
  public profile: User;

  /*refreshProfile(): Observable<User[]> {
    const profiles: Observable<User[]> = this.profileListService.getUser();
    profiles.subscribe(
      profiles => {
        this.profiles = profiles;
      },
      err => {
        console.log(err);
      });
    return profiles;
  }

  ngOnInit(): void {
    this.refreshProfile();
  }*/
}
