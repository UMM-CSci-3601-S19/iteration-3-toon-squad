import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from "./user";
import {UserService} from "./user.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'profile-component',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit{

  public profile: User;

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  getProfile(): void{
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id).subscribe(user => this.profile = user);
  }


  ngOnInit(): void {
    this.getProfile();
  }

}
